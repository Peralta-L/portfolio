import { z } from "zod";
import { projectSchema, type Project } from "@/types/api";
import data from "./data/projects.json";

/**
 * Fallback copy of GET /api/projects, shown only when the API can't be reached.
 *
 * Don't edit data/projects.json by hand: it's a snapshot of the database that
 * scripts/sync-content.mjs rewrites before every build. To change projects,
 * add a Flyway migration in the backend (see docs/content-and-migrations.md).
 */
export const fallbackProjects: Project[] = z.array(projectSchema).parse(data);
