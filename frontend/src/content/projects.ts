import type { Project } from "@/types/api";

/**
 * Fallback copy of GET /api/projects, used when the API is unreachable at build
 * or revalidation time. Keep in sync with backend V2__seed_content.sql.
 */
export const fallbackProjects: Project[] = [
  {
    slug: "what-to-eat",
    title: "What to Eat",
    summary:
      "AI meal planner: a mobile virtual fridge that tracks expiry dates and generates recipes from the ingredients you already have.",
    description:
      "Users log fridge items with quantities and expiry dates, and an expiration calendar shows what to use first. A FastAPI backend sends the available ingredients, allergies and cuisine preferences to a Groq-hosted LLM in JSON mode, then parses and stores the generated recipes. Includes JWT authentication with bcrypt-hashed passwords, a 10-table PostgreSQL schema accessed asynchronously through asyncpg, and saved, favourite and cooked-recipe history.",
    githubUrl: "https://github.com/Peralta-L/What_to_eat",
    featured: true,
    technologies: ["Python", "FastAPI", "PostgreSQL", "Groq LLM", "JWT", "React Native", "Expo", "TypeScript"],
  },
  {
    slug: "stock-portfolio-assistant",
    title: "Stock Portfolio Assistant",
    summary:
      "Team capstone (team of 4, backend & database lead): a full-stack app for tracking stock holdings, live quotes and portfolio gains and losses.",
    description:
      "Built with a four-person team for the CMSC 495 capstone. I designed the Prisma/PostgreSQL schema and built the authentication (NextAuth with bcrypt) and the user, holdings, transactions and portfolio services and controllers. Server-side API routes proxy the Finnhub market-data API for quotes, symbol search, batch quotes and price history, so the API key never reaches the browser.",
    githubUrl: "https://github.com/Group1-Capstone-Project/Stock-Portfolio-Assistant",
    featured: true,
    technologies: ["Next.js", "TypeScript", "PostgreSQL", "Prisma", "NextAuth", "Finnhub API", "Tailwind CSS"],
  },
  {
    slug: "asset-scanner",
    title: "Asset Scanner",
    summary:
      "Internal IT inventory tool built at Oppenhoff & Partner: registers hardware by scanning barcodes with a phone camera, with an OCR fallback.",
    description:
      "Scans asset tags with the native BarcodeDetector API and reads printed serial numbers with Tesseract.js OCR, with camera zoom controls for small labels. Scanned assets go through an Express 5 REST API (create, review, update, delete) and are stored in SQLite, and a review page lists scanned assets for correction or removal.",
    githubUrl: "https://github.com/Peralta-L/Asset_Scanner",
    featured: true,
    technologies: ["Node.js", "Express", "SQLite", "JavaScript", "Tesseract.js", "Web APIs"],
  },
  {
    slug: "portfolio-platform",
    title: "Personal Portfolio Platform",
    summary:
      "This website: a Next.js frontend on Vercel backed by a Spring Boot API and PostgreSQL on Render.",
    description:
      "Statically generated Next.js 15 frontend with incremental revalidation, reading content from a Spring Boot 3 API. The contact form posts to a validated, rate-limited endpoint that persists messages to PostgreSQL. If the API is cold or unavailable, the site falls back to bundled content so it never renders empty.",
    githubUrl: "https://github.com/Peralta-L/portfolio",
    featured: true,
    technologies: ["Java 25", "Spring Boot", "PostgreSQL", "Next.js", "TypeScript", "Tailwind CSS"],
  },
];
