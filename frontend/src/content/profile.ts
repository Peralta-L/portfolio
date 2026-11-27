import { BrainCircuit, Cloud, Code, Database, Layers, Network, Puzzle } from "lucide-react";
import type { FocusArea } from "@/types/content";

export const profile = {
  name: "Luis Peralta Aguirre",
  shortName: "Luis Peralta",
  initials: "LP",
  title: "Software engineer, full-stack",
  headline: "Building scalable APIs, AI-powered applications, and cloud-ready systems.",
  availability: "Open to software roles · Germany",
  /** Public contact email. Empty hides every email link on the site. */
  email: "",
  github: "https://github.com/Peralta-L",
  linkedin: "https://www.linkedin.com/in/luis-peralta-aguirre-987950375",
  resumePath: "/portfolioCV.pdf",
  siteUrl: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
} as const;

export const bio: string[] = [
  "I'm a full-stack software engineer with a B.S. in Computer Science from the University of Maryland Global Campus, based in Germany. Today I work in IT support at Oppenhoff & Partner in Cologne, where I build internal tools such as an asset scanner and parts of the employee offboarding module. I design and build the parts of software people rarely see but always depend on: APIs that stay fast under load, data models that age well, and services that fail gracefully.",
  "I work across Java, Python and TypeScript: Spring Boot and FastAPI services, Node.js and Next.js APIs, usually on PostgreSQL. Whatever the language, I care about clean, layered architecture, explicit contracts between systems, and tests that make change cheap. Increasingly, I build AI features into products, like LLM-generated recipes in my What to Eat app, and I treat the model like any other external dependency: structured output, validated before it is used.",
  "Before that, I served in the U.S. Army in Vilseck, Germany (2021–2025), working daily with multinational NATO teams and responsible for high-value technical equipment. That taught me discipline, calm under pressure and clear communication, which I bring to every code review, incident and design discussion.",
];

export const focusAreas: FocusArea[] = [
  { title: "Java, Python & TypeScript", icon: Code, description: "Three languages, one standard: readable, typed and tested code." },
  { title: "Spring Boot & FastAPI", icon: Layers, description: "REST services with validation, auth and clean controller/service layers." },
  { title: "API Architecture", icon: Network, description: "Resource-oriented REST, DTO boundaries, versioning and RFC 9457 errors." },
  { title: "Databases", icon: Database, description: "PostgreSQL schema design, indexing, migrations and query tuning." },
  { title: "Cloud Services", icon: Cloud, description: "Deploys on Vercel, Render and Neon, with Docker and GitHub Actions CI." },
  { title: "AI Integration", icon: BrainCircuit, description: "LLM features with structured JSON output, personalised and validated server-side." },
  { title: "Problem Solving", icon: Puzzle, description: "Strong CS fundamentals: data structures, algorithms and trade-off analysis." },
];

export const spans = [
  { id: "about", label: "About", service: "profile", nav: true },
  { id: "projects", label: "Projects", service: "work", nav: true },
  { id: "architecture", label: "Architecture", service: "work" },
  { id: "skills", label: "Skills", service: "stack" },
  { id: "experience", label: "Experience", service: "career", nav: true },
  { id: "education", label: "Education", service: "profile" },
  { id: "contact", label: "Contact", service: "contact", nav: true },
] as const;

export type SpanId = (typeof spans)[number]["id"];

export const spanColor = (id: SpanId) => `var(--color-svc-${spans.find((s) => s.id === id)!.service})`;

export const navigation = spans.filter((s) => "nav" in s);
