import { Apple, BookOpenText, Building2, LayoutTemplate } from "lucide-react";
import type { Project } from "@/types/api";
import type { ProjectVisual } from "@/types/content";

/**
 * Fallback copy of GET /api/projects, used when the API is unreachable at build
 * or revalidation time. Keep in sync with backend V2__seed_content.sql.
 */
export const fallbackProjects: Project[] = [
  {
    slug: "ai-food-tracker",
    title: "AI Food Tracker",
    summary:
      "Virtual fridge that tracks ingredients and expiry dates, then uses an LLM to suggest meals from what you already have.",
    description:
      "Users keep a live inventory of their fridge and pantry. A scheduled job flags items close to expiry, and an AI service turns the remaining ingredients into ranked meal suggestions with estimated nutrition. LLM calls sit behind a provider-agnostic interface with timeouts, retries and response validation, so a slow or malformed model response never breaks the core inventory features.",
    githubUrl: "https://github.com/Peralta-L",
    featured: true,
    technologies: ["Java 21", "Spring Boot", "PostgreSQL", "LLM API", "React Native", "Docker"],
  },
  {
    slug: "recipe-intelligence",
    title: "Recipe Intelligence Platform",
    summary: "Recipe search engine that normalizes ingredients and ranks results with semantic vector search.",
    description:
      "An ingestion pipeline parses recipes from multiple formats, normalizes ingredient names and units, and stores embeddings in PostgreSQL with pgvector. The search API combines full-text and vector similarity and supports filtering by diet, cooking time and available ingredients. Hot queries are cached in Redis.",
    githubUrl: "https://github.com/Peralta-L",
    featured: true,
    technologies: ["Java 21", "Spring Boot", "PostgreSQL", "pgvector", "Redis", "Next.js"],
  },
  {
    slug: "enterprise-java-api",
    title: "Enterprise Java API",
    summary:
      "Production-style Spring Boot REST API with JWT authentication, role-based access and a full CI/CD pipeline.",
    description:
      "A layered Spring Boot service demonstrating enterprise patterns: JWT authentication with refresh tokens, role-based authorization, DTO mapping, global RFC 9457 error handling, Flyway migrations, OpenAPI documentation, and integration tests against a real PostgreSQL database. GitHub Actions builds, tests and publishes a Docker image on every merge.",
    githubUrl: "https://github.com/Peralta-L",
    featured: true,
    technologies: ["Java 21", "Spring Security", "JWT", "PostgreSQL", "Docker", "GitHub Actions"],
  },
  {
    slug: "portfolio-platform",
    title: "Personal Portfolio Platform",
    summary: "This website: a Next.js frontend on Vercel backed by a Spring Boot API and PostgreSQL on Render.",
    description:
      "Statically generated Next.js 15 frontend with incremental revalidation, reading content from a Spring Boot 3 API. The contact form posts to a validated, rate-limited endpoint that persists messages to PostgreSQL. If the API is cold or unavailable, the site falls back to bundled content so it never renders empty.",
    githubUrl: "https://github.com/Peralta-L/portfolio",
    featured: true,
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Spring Boot", "PostgreSQL", "Vercel"],
  },
];

const defaultVisual: ProjectVisual = { icon: LayoutTemplate, gradient: ["#1e3a8a", "#0f172a"] };

const visuals: Record<string, ProjectVisual> = {
  "ai-food-tracker": { icon: Apple, gradient: ["#065f46", "#0c1a17"] },
  "recipe-intelligence": { icon: BookOpenText, gradient: ["#7c2d12", "#1c1210"] },
  "enterprise-java-api": { icon: Building2, gradient: ["#1e3a8a", "#0b1220"] },
  "portfolio-platform": { icon: LayoutTemplate, gradient: ["#4c1d95", "#120d1f"] },
};

export function projectVisual(slug: string): ProjectVisual {
  return visuals[slug] ?? defaultVisual;
}
