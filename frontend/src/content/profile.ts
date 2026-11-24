import { BrainCircuit, Cloud, Coffee, Database, Layers, Network, Puzzle } from "lucide-react";
import type { FocusArea } from "@/types/content";

/**
 * Personal details. Links left empty are hidden everywhere on the site,
 * so visitors never hit a dead link.
 */
export const profile = {
  name: "Luis Peralta Aguirre",
  shortName: "Luis Peralta",
  initials: "LP",
  title: "Backend Engineer | Computer Science Graduate",
  headline: "Building scalable APIs, AI-powered applications, and cloud-ready systems.",
  availability: "Open to backend engineering roles",
  /** TODO: add your public contact email, e.g. "luis@yourdomain.com". */
  email: "",
  github: "https://github.com/Peralta-L",
  /** TODO: add your LinkedIn profile URL. */
  linkedin: "",
  /** Drop your CV at frontend/public/resume.pdf and every "Resume" button appears. */
  resumePath: "/resume.pdf",
  siteUrl: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
} as const;

export const bio: string[] = [
  "I'm a backend engineer and Computer Science graduate from the University of Maryland Global Campus. I design and build the parts of software people rarely see but always depend on: APIs that stay fast under load, data models that age well, and services that fail gracefully.",
  "My core stack is Java and Spring Boot on PostgreSQL. I care about clean, layered architecture, explicit contracts between systems, and tests that make change cheap. Increasingly, I integrate large language models into products, treating them like any other unreliable dependency: behind clear interfaces, with timeouts, validation and fallbacks.",
  "Before software, I served in the U.S. Armed Forces, working in high-responsibility environments with international teams and sensitive information. That taught me discipline, calm under pressure and clear communication, which I bring to every code review, incident and design discussion.",
];

export const focusAreas: FocusArea[] = [
  { title: "Java", icon: Coffee, description: "Modern Java 21: records, sealed types and virtual threads, written for readability." },
  { title: "Spring Boot", icon: Layers, description: "Production services with Spring Web, Data JPA, Security and Validation." },
  { title: "API Architecture", icon: Network, description: "Resource-oriented REST, DTO boundaries, versioning and RFC 9457 errors." },
  { title: "Databases", icon: Database, description: "PostgreSQL schema design, indexing, migrations and query tuning." },
  { title: "Cloud Services", icon: Cloud, description: "Containerized deploys on Azure, Render and Vercel with CI/CD pipelines." },
  { title: "AI Integration", icon: BrainCircuit, description: "LLM features behind resilient, provider-agnostic service interfaces." },
  { title: "Problem Solving", icon: Puzzle, description: "Strong CS fundamentals: data structures, algorithms and trade-off analysis." },
];

export const navigation = [
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
] as const;
