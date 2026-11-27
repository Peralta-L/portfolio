import type { SkillGroup } from "@/types/api";

/** Fallback copy of GET /api/skills. Keep in sync with backend V2__seed_content.sql. */
export const fallbackSkills: SkillGroup[] = [
  {
    category: "BACKEND",
    label: "Backend",
    skills: ["Java", "Spring Boot", "Python", "SQL", "FastAPI", "Node.js", "Express", "PostgreSQL", "Prisma", "REST APIs", "JWT", "LLM APIs", "Docker"],
  },
  { category: "FRONTEND", label: "Frontend", skills: ["TypeScript", "JavaScript", "HTML/CSS", "React", "Next.js", "React Native", "Tailwind CSS"] },
  { category: "CLOUD", label: "Cloud & DevOps", skills: ["Git", "GitHub", "Vercel", "Render", "Neon", "GitHub Actions"] },
];

export const skillCategoryBlurb: Record<SkillGroup["category"], string> = {
  BACKEND: "Where I spend most of my time: services, data and security.",
  FRONTEND: "Enough to ship complete products and work well with frontend teams.",
  CLOUD: "Build, test and deploy pipelines, from container to production.",
};
