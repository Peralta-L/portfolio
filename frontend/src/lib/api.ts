import { z } from "zod";
import { fallbackExperience } from "@/content/experience";
import { fallbackProjects } from "@/content/projects";
import { fallbackSkills } from "@/content/skills";
import { experienceSchema, projectSchema, skillGroupSchema } from "@/types/api";

/** Server-side API base URL. Never imported by client components. */
const API_URL = (process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");

/** Content changes only on backend deploys, so pages revalidate hourly. */
const REVALIDATE_SECONDS = 3600;

/**
 * Fetches and validates content from the API. Any failure (not configured,
 * cold start timeout, network error, unexpected shape) falls back to the
 * bundled copy, so the page always renders complete.
 */
async function fetchContent<T>(path: string, schema: z.ZodType<T>, fallback: T): Promise<T> {
  if (!API_URL) return fallback;

  try {
    const response = await fetch(`${API_URL}${path}`, {
      headers: { Accept: "application/json" },
      next: { revalidate: REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const parsed = schema.safeParse(await response.json());
    if (!parsed.success) throw new Error(`Unexpected response shape: ${parsed.error.message}`);
    return parsed.data;
  } catch (error) {
    console.warn(`[api] ${path} unavailable, using bundled content:`, (error as Error).message);
    return fallback;
  }
}

export const getProjects = () => fetchContent("/api/projects", z.array(projectSchema), fallbackProjects);
export const getSkills = () => fetchContent("/api/skills", z.array(skillGroupSchema), fallbackSkills);
export const getExperience = () => fetchContent("/api/experience", z.array(experienceSchema), fallbackExperience);
