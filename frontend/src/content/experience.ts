import { z } from "zod";
import { experienceSchema, type Experience } from "@/types/api";
import data from "./data/experience.json";

/**
 * Fallback copy of GET /api/experience, shown only when the API can't be reached.
 *
 * Don't edit data/experience.json by hand: it's a snapshot of the database that
 * scripts/sync-content.mjs rewrites before every build. To change experience,
 * add a Flyway migration in the backend (see docs/content-and-migrations.md).
 *
 * Parsing with the same Zod schema the API response goes through means a broken
 * snapshot fails the build loudly instead of rendering a half-empty section.
 */
export const fallbackExperience: Experience[] = z.array(experienceSchema).parse(data);
