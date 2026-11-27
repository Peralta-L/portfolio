# Content and migrations: how it works

Notes on where the site's projects, skills and experience come from, how to
change them, and how database migrations work.

## The short version

- **The database is the source of truth** for projects, skills and experience.
- **You change content by adding a migration** in the backend (`V4__...sql`).
- **The frontend's fallback copy updates itself** on the next Vercel build.
  You never edit it by hand.

## Where the content lives

```
backend/src/main/resources/db/migration/*.sql   the real content (database)
frontend/src/content/data/*.json                 fallback snapshot (generated)
frontend/src/content/*.ts                        loads + validates the snapshot
frontend/scripts/sync-content.mjs                refreshes the snapshot
```

Everything else on the site (hero, about, education, architecture, the skill
group blurbs) is plain text in `frontend/src/content/*.ts`. Edit those
directly.

## What happens when someone opens the site

```
Visitor ─► Vercel page ─► lib/api.ts asks the API ─► Spring Boot ─► PostgreSQL
                               │
                               └─ API down/asleep? use src/content/data/*.json
```

- The page is built ahead of time and refreshed at most once an hour
  (`revalidate = 3600` in `app/page.tsx`), so most visitors never wait for
  the API.
- If the API doesn't answer within 5 seconds, `lib/api.ts` uses the bundled
  snapshot instead. The section is never empty.

## How the snapshot stays up to date

`frontend/package.json` has `"prebuild": "node scripts/sync-content.mjs"`.
npm runs any script called `pre<name>` right before `<name>`, so every
`npm run build`, including Vercel's, first runs the sync script:

1. It reads the API URL from `API_URL` or `NEXT_PUBLIC_API_URL`. If neither
   is set (GitHub Actions, or a local build without `.env.local`), it does
   nothing.
2. It wakes the API up. Free Render services sleep when idle, so it retries
   for up to 90 seconds.
3. It downloads `/api/projects`, `/api/skills` and `/api/experience`.
4. It checks them with the same Zod schemas the site uses
   (`src/types/api.ts`).
5. It writes `src/content/data/*.json`, but only if all three passed.

**It never fails the build.** If any step goes wrong, it prints a warning and
keeps the old snapshot, so the site still deploys.

On Vercel, the updated JSON only exists inside that build. Your repo copy
doesn't change. To refresh your local copy too, run:

```bash
cd frontend
npm run sync-content     # uses NEXT_PUBLIC_API_URL from .env.local
```

The JSON files then show up as changed in git. Commit them if you like. It
doesn't matter for the live site, which syncs on every build anyway.

## How migrations work (Flyway)

A migration is a SQL file that changes the database one step at a time. They
live in `backend/src/main/resources/db/migration/` and run in version order:

| File | What it did |
| ---- | ----------- |
| `V1__create_schema.sql` | created the tables |
| `V2__seed_content.sql` | inserted the first content |
| `V3__update_experience.sql` | replaced the experience entries |

**On every API start, Flyway:**

1. Looks at its history table `flyway_schema_history`, which lists every
   migration already applied, with a checksum of its contents.
2. Runs, in order, every file not in that table yet. Each file runs **once**,
   in a transaction: if a statement fails, the whole file is rolled back and
   the API refuses to start. That's annoying, but it means the database never
   ends up half-changed.
3. Records each file it ran.

So the database on Render remembers which steps it has had, and a fresh
database (like the test one) replays V1, V2, V3... to reach the same state.

### The rules

1. **Never edit a migration that has already run** on Render. Flyway compares
   checksums, and if one changed, the API stops with a "checksum mismatch"
   error. Fix mistakes with a new migration.
2. **Names must follow the pattern** `V<number>__<description>.sql`, with
   **two** underscores, e.g. `V4__add_azure_skill.sql`. Numbers only go up.
3. **One change per file** keeps history readable: "V4 added a project" is
   easier to follow than "V4 changed everything".
4. Editing a migration that has **not** been pushed yet is fine. It hasn't
   run anywhere except possibly your local database.

### Common changes

```sql
-- Replace a whole section (what V3 does for experience):
DELETE FROM experiences;          -- highlights are removed too (ON DELETE CASCADE)
INSERT INTO experiences (...) VALUES (...);

-- Change one field:
UPDATE projects SET summary = 'New summary' WHERE slug = 'asset-scanner';

-- Add a skill:
INSERT INTO skills (name, category, display_order) VALUES ('Azure', 'CLOUD', 23);

-- Remove a skill:
DELETE FROM skills WHERE category = 'CLOUD' AND name = 'Azure';
```

Text in SQL goes in single quotes. To write an apostrophe, double it:
`'Luis''s project'`.

## Step by step: changing content

1. Create the next migration, e.g.
   `backend/src/main/resources/db/migration/V4__update_projects.sql`.
2. Optional: test it locally. `cd backend && mvnw.cmd spring-boot:test-run`
   starts the API on an empty embedded database and runs V1 to V4. Check
   <http://localhost:8080/api/projects>.
3. If you changed what a test checks (counts, names), update
   `backend/src/test/java/com/portfolio/PortfolioApiIntegrationTest.java`.
   `mvnw.cmd verify` runs the tests (GitHub Actions runs them on every push).
4. Commit and push to the branch Render deploys (`main`).
5. Watch **Render → portfolio-api → Logs** for
   `Migrating schema "public" to version "4 - update projects"`, then
   `Started PortfolioApplication`.
6. Check `https://<your-api>.onrender.com/api/projects`.
7. **Redeploy on Vercel** (Deployments → ⋯ → Redeploy). The live page would
   pick up the change within an hour anyway, but the redeploy also refreshes
   the fallback snapshot right away.

### Why step 7 matters

Vercel starts building as soon as you push, often before Render has finished
deploying the new migration. That first build then snapshots the *old*
content. The live page still updates within the hour, because the hourly
refresh asks the API again. The fallback snapshot, though, stays old until the
next Vercel build. A manual redeploy after Render is done fixes it.

To automate this later, you could create a **Deploy Hook** in Vercel
(Settings → Git) and call it once Render's deploy succeeds.

## Troubleshooting

| Symptom | Cause |
| ------- | ----- |
| Render logs: `Validate failed: Migrations have failed validation` / checksum mismatch | An already-applied migration was edited. Undo the edit, then make the change in a new file |
| Render logs: SQL error in `V4__...` | Typo in the SQL. Nothing was applied (transaction). Fix the file and push again |
| Vercel log: `[sync-content] Skipped, keeping the existing snapshot` | API asleep longer than 90 s or down. The site still deploys. Redeploy later to refresh |
| Live site shows old content after a migration | It refreshes within an hour, or redeploy on Vercel |
| Build fails in `src/content/*.ts` with a Zod error | Someone hand-edited `data/*.json` into an invalid shape. Run `npm run sync-content` or undo the edit |
