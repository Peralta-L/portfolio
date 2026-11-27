import { z } from "zod";
import { skillGroupSchema, type SkillGroup } from "@/types/api";
import data from "./data/skills.json";

/**
 * Fallback copy of GET /api/skills, shown only when the API can't be reached.
 *
 * Don't edit data/skills.json by hand: it's a snapshot of the database that
 * scripts/sync-content.mjs rewrites before every build. To change skills,
 * add a Flyway migration in the backend (see docs/content-and-migrations.md).
 */
export const fallbackSkills: SkillGroup[] = z.array(skillGroupSchema).parse(data);

/** Copy text under each skill group. Not in the database, so edit it here directly. */
export const skillCategoryBlurb: Record<SkillGroup["category"], string> = {
  BACKEND: "Where I spend most of my time: services, data and security.",
  FRONTEND: "Enough to ship complete products and work well with frontend teams.",
  CLOUD: "Build, test and deploy pipelines, from container to production.",
};
