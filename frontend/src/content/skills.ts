import type { SkillGroup } from "@/types/api";

/** Fallback copy of GET /api/skills. Keep in sync with backend V2__seed_content.sql. */
export const fallbackSkills: SkillGroup[] = [
  { category: "BACKEND", label: "Backend", skills: ["Java", "Spring Boot", "PostgreSQL", "REST APIs", "JWT", "Docker"] },
  { category: "FRONTEND", label: "Frontend", skills: ["TypeScript", "Next.js", "Tailwind CSS"] },
  { category: "CLOUD", label: "Cloud & DevOps", skills: ["Azure", "Vercel", "Render", "GitHub Actions"] },
];

export const skillCategoryBlurb: Record<SkillGroup["category"], string> = {
  BACKEND: "Where I spend most of my time: services, data and security.",
  FRONTEND: "Enough to ship complete products and work well with frontend teams.",
  CLOUD: "Build, test and deploy pipelines, from container to production.",
};
