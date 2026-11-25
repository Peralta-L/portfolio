import {
  BrainCircuit,
  CandlestickChart,
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
    slug: "what-to-eat",
    name: "What to Eat",
    summary: "Mobile client, async Python API and an LLM, with the model treated as just another external dependency.",
    tiers: [
      [{ title: "Expo Mobile App", detail: "React Native, NativeWind", icon: MonitorSmartphone }],
      [{ title: "FastAPI", detail: "JWT auth, REST routers", icon: Server }],
      [
        { title: "Inventory & Recipes", detail: "Controllers → services", icon: Layers },
        { title: "AI Recipe Service", detail: "Prompting, JSON parsing", icon: Workflow },
      ],
      [
        { title: "PostgreSQL (Neon)", detail: "asyncpg, 10 tables", icon: Database },
        { title: "Groq LLM", detail: "JSON-mode completions", icon: BrainCircuit },
      ],
    ],
    decisions: [
      "The LLM is called in JSON mode and the output is parsed before anything is stored, so recipes always have a predictable shape.",
      "Prompts carry the user's allergies and cuisine preferences, so personalisation happens server-side, not in the app.",
      "Database access is fully async through asyncpg, so slow AI calls don't block other requests.",
      "Tokens are kept in the device's secure storage (expo-secure-store), not in plain app storage.",
    ],
  },
  {
    slug: "stock-portfolio-assistant",
    name: "Stock Portfolio Assistant",
    summary: "Full-stack Next.js with a clean controller/service split and a third-party market-data API behind the server.",
    tiers: [
      [{ title: "Next.js UI", detail: "React, Tailwind CSS", icon: Globe }],
      [
        { title: "API Routes", detail: "Holdings, transactions, portfolio", icon: Server },
        { title: "NextAuth", detail: "Sessions, bcrypt passwords", icon: KeyRound },
      ],
      [{ title: "Controllers → Services", detail: "Validation, business rules", icon: Layers }],
      [
        { title: "PostgreSQL (Neon)", detail: "Prisma ORM", icon: Database },
        { title: "Finnhub API", detail: "Quotes, search, history", icon: CandlestickChart },
      ],
    ],
    decisions: [
      "The Finnhub key lives only in server-side routes; the browser never sees it.",
      "Batch quotes return a per-symbol notFound flag instead of failing the whole request.",
      "Transactions are stored as history, separate from current holdings, so gains and losses can be recalculated.",
      "The Prisma schema is the single source of truth for the database, shared by the whole team.",
    ],
  },
  {
    slug: "portfolio-platform",
    name: "This Portfolio",
    summary: "Static-first frontend with a small, hardened Spring Boot API behind it. The site still renders if the API is asleep.",
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
];
