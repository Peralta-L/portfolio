import type { Experience } from "@/types/api";

/**
 * Fallback copy of GET /api/experience. Keep in sync with backend V2__seed_content.sql.
 * TODO(Luis): replace the dates with your real ones before deploying.
 */
export const fallbackExperience: Experience[] = [
  {
    role: "Backend Developer (Independent Projects)",
    organization: "Self-directed",
    location: "Remote",
    startDate: "2023-01-01",
    endDate: null,
    current: true,
    summary:
      "Designing and building full-stack applications end to end, with a focus on Java and Spring Boot APIs, relational data modeling and cloud deployment.",
    highlights: [
      "Built REST APIs with Spring Boot, Spring Security and PostgreSQL using layered, testable architecture.",
      "Integrated LLM APIs into applications behind resilient, provider-agnostic service interfaces.",
      "Containerized services with Docker and automated builds and deployments with GitHub Actions.",
    ],
  },
  {
    role: "Service Member",
    organization: "U.S. Armed Forces",
    startDate: "2018-01-01",
    endDate: null,
    current: true,
    summary:
      "Operating in high-responsibility environments where precision, accountability and clear communication are non-negotiable.",
    highlights: [
      "Collaborated with international teams on time-critical operations.",
      "Handled sensitive information with strict accuracy and confidentiality.",
      "Developed discipline, adaptability and the ability to perform under pressure.",
    ],
  },
];
