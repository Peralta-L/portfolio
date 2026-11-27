/**
 * sync-content: refreshes the fallback content from the live API before a build.
 *
 * WHY THIS EXISTS
 *   The site shows projects, skills and experience from the Spring Boot API.
 *   When the API can't be reached, it shows a bundled copy instead
 *   (src/content/data/*.json). This script keeps that copy identical to the
 *   database, so you only ever change content in one place: the backend.
 *
 * WHEN IT RUNS
 *   Automatically, as the "prebuild" npm script: npm runs it right before
 *   `npm run build`, which is what Vercel runs on every deploy.
 *   Manually, with `npm run sync-content` (reads frontend/.env.local).
 *
 * WHAT IT DOES
 *   1. Finds the API URL (API_URL or NEXT_PUBLIC_API_URL). None set: skip.
 *   2. Wakes the API up. Free Render services sleep, so it retries for a while.
 *   3. Downloads /api/projects, /api/skills and /api/experience.
 *   4. Validates them with the same Zod schemas the site uses (src/types/api.ts).
 *   5. Writes them to src/content/data/*.json, but only if ALL three succeeded,
 *      so the snapshot never mixes old and new data.
 *
 * SAFETY RULE
 *   This script never fails the build. If anything goes wrong, it prints a
 *   warning and leaves the existing JSON files untouched, so the site still
 *   deploys with the last good snapshot.
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = join(root, "src", "content", "data");
const log = (message) => console.log(`[sync-content] ${message}`);

// For local runs: load frontend/.env.local like Next.js does. Values that are
// already set (e.g. on Vercel) win, because loadEnvFile never overrides them.
const envFile = join(root, ".env.local");
if (existsSync(envFile) && typeof process.loadEnvFile === "function") process.loadEnvFile(envFile);

/** Each endpoint, the JSON file it's saved to, and which schema checks it. */
const targets = [
  { path: "/api/projects", file: "projects.json", schema: "projectSchema" },
  { path: "/api/skills", file: "skills.json", schema: "skillGroupSchema" },
  { path: "/api/experience", file: "experience.json", schema: "experienceSchema" },
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function getJson(url, timeoutMs) {
  const response = await fetch(url, { headers: { Accept: "application/json" }, signal: AbortSignal.timeout(timeoutMs) });
  if (!response.ok) throw new Error(`HTTP ${response.status} from ${url}`);
  return response.json();
}

/**
 * Free Render services take 30-60 s to start after sleeping. Poll the health
 * endpoint until it answers. A local API either runs or it doesn't, so we
 * give up much sooner on localhost.
 */
async function wakeUp(baseUrl) {
  const isLocal = /^https?:\/\/(localhost|127\.0\.0\.1)/.test(baseUrl);
  const deadline = Date.now() + (isLocal ? 3_000 : 90_000);
  let attempt = 0;
  while (true) {
    attempt += 1;
    try {
      await getJson(`${baseUrl}/actuator/health`, 15_000);
      if (attempt > 1) log(`API is awake (after ${attempt} attempts).`);
      return;
    } catch (error) {
      if (Date.now() >= deadline) throw new Error(`API did not wake up: ${error.message}`);
      if (attempt === 1) log("Waiting for the API to wake up (free Render services sleep when idle)...");
      await sleep(5_000);
    }
  }
}

/** Drops database ids: they're meaningless in the snapshot and would only add noise to diffs. */
const withoutIds = (items) => items.map(({ id: _id, ...rest }) => rest);

async function main() {
  const baseUrl = (process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "").trim().replace(/\/$/, "");
  if (!baseUrl) {
    log("No API URL set, keeping the existing snapshot.");
    return;
  }

  // Reuse the site's own schemas so the script and the site agree on what
  // valid content looks like. Importing a .ts file needs Node 22.18 or newer.
  // Node prints a harmless "MODULE_TYPELESS_PACKAGE_JSON" warning when it loads
  // a .ts file this way. Hide just that one; every other warning still shows.
  const defaultWarningHandlers = process.listeners("warning");
  process.removeAllListeners("warning");
  process.on("warning", (warning) => {
    if (warning.code !== "MODULE_TYPELESS_PACKAGE_JSON") defaultWarningHandlers.forEach((handler) => handler(warning));
  });

  let schemas;
  try {
    schemas = await import("../src/types/api.ts");
  } catch (error) {
    log(`Can't load the schemas (needs Node 22.18+), keeping the existing snapshot. ${error.message}`);
    return;
  }
  const { z } = await import("zod");

  log(`Fetching content from ${baseUrl}`);
  await wakeUp(baseUrl);

  // Download and validate everything first; write nothing until all three pass.
  const results = [];
  for (const target of targets) {
    const raw = await getJson(`${baseUrl}${target.path}`, 30_000);
    const parsed = z.array(schemas[target.schema]).safeParse(raw);
    if (!parsed.success) throw new Error(`${target.path} returned unexpected data: ${parsed.error.message}`);
    if (parsed.data.length === 0) throw new Error(`${target.path} returned an empty list`);
    results.push({ ...target, json: `${JSON.stringify(withoutIds(parsed.data), null, 2)}\n` });
  }

  for (const { file, json, path } of results) {
    const filePath = join(dataDir, file);
    const before = existsSync(filePath) ? readFileSync(filePath, "utf8") : "";
    if (before === json) {
      log(`${path}: unchanged`);
    } else {
      writeFileSync(filePath, json);
      log(`${path}: updated src/content/data/${file}`);
    }
  }
}

main().catch((error) => {
  // Never fail the build: the old snapshot is still a complete, valid site.
  console.warn(`[sync-content] Skipped, keeping the existing snapshot. ${error.message}`);
});
