import {
  BrainCircuit,
  Clock,
  Database,
  Globe,
  KeyRound,
  Layers,
  MonitorSmartphone,
  Server,
  ShieldCheck,
  Workflow,
} from "lucide-react";
import type { ArchitectureDiagram } from "@/types/content";

export const architectures: ArchitectureDiagram[] = [
  {
    slug: "portfolio-platform",
    name: "Portfolio Platform",
    summary: "Static-first frontend with a small, hardened API behind it. The site still renders if the API is asleep.",
    tiers: [
      [{ title: "Next.js on Vercel", detail: "SSG + ISR, edge CDN", icon: Globe }],
      [{ title: "Spring Security", detail: "CORS allow-list, rate limiting", icon: ShieldCheck }],
      [{ title: "REST Controllers", detail: "DTOs, Bean Validation", icon: Server }],
      [{ title: "Service Layer", detail: "Transactions, normalization", icon: Layers }],
      [{ title: "PostgreSQL", detail: "Flyway-versioned schema", icon: Database }],
    ],
    decisions: [
      "Pages are generated at build time and revalidated hourly, so a cold API never blocks a page view.",
      "Bundled fallback content keeps the site complete even when the API is unreachable.",
      "Errors follow RFC 9457 problem+json, so the frontend can map field errors straight onto the form.",
      "Flyway owns the schema and Hibernate only validates it, preventing silent drift.",
    ],
  },
  {
    slug: "ai-food-tracker",
    name: "AI Food Tracker",
    summary: "Core inventory works without AI; the LLM is an enhancement behind a resilient boundary.",
    tiers: [
      [{ title: "Mobile Client", detail: "React Native", icon: MonitorSmartphone }],
      [{ title: "Spring Boot API", detail: "JWT auth, REST", icon: Server }],
      [
        { title: "Inventory Service", detail: "Items, quantities, expiry", icon: Layers },
        { title: "Meal Suggestion Service", detail: "Prompting, ranking", icon: Workflow },
      ],
      [
        { title: "PostgreSQL", detail: "Inventory + history", icon: Database },
        { title: "LLM Provider", detail: "Timeouts, retries, validation", icon: BrainCircuit },
      ],
    ],
    decisions: [
      "LLM calls sit behind an interface, so the provider can be swapped or mocked in tests.",
      "Model output is parsed into typed DTOs and validated; malformed responses degrade to rule-based suggestions.",
      "Expiry alerts run as a scheduled job, decoupled from request latency.",
    ],
  },
  {
    slug: "enterprise-java-api",
    name: "Enterprise Java API",
    summary: "A textbook layered service with security and delivery treated as first-class concerns.",
    tiers: [
      [{ title: "API Clients", detail: "Web, mobile, services", icon: Globe }],
      [
        { title: "JWT Filter", detail: "Access + refresh tokens", icon: KeyRound },
        { title: "Role-Based Access", detail: "Method security", icon: ShieldCheck },
      ],
      [{ title: "Controllers → Services → Repositories", detail: "DTO mapping at the edges", icon: Layers }],
      [
        { title: "PostgreSQL", detail: "Flyway migrations", icon: Database },
        { title: "CI/CD", detail: "GitHub Actions → Docker", icon: Clock },
      ],
    ],
    decisions: [
      "Entities never leave the service layer; controllers speak only DTOs.",
      "Integration tests run against real PostgreSQL, not an in-memory substitute.",
      "Every merge builds, tests and publishes an immutable Docker image.",
    ],
  },
];
