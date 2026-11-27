import type { Experience } from "@/types/api";

/** Fallback copy of GET /api/experience. Keep in sync with backend V2__seed_content.sql. */
export const fallbackExperience: Experience[] = [
  {
    role: "IT Support",
    organization: "Oppenhoff & Partner",
    location: "Cologne, Germany",
    startDate: "2026-01-01",
    endDate: null,
    current: true,
    summary: "IT support at an international law firm, building internal tools alongside day-to-day support.",
    highlights: [
      "Built an internal Asset Scanner (JavaScript, Node.js, SQLite) that registers hardware by scanning barcodes with a phone camera, with an OCR fallback.",
      "Developed parts of the employee offboarding module, automating secure exit workflows.",
      "Supported lawyers and staff with troubleshooting, onboarding and Active Directory administration.",
    ],
  },
  {
    role: "Soldier",
    organization: "U.S. Army",
    location: "Vilseck, Germany",
    startDate: "2021-01-01",
    endDate: "2025-12-31",
    current: false,
    summary: "Served in a high-responsibility environment where precision, accountability and clear communication are non-negotiable.",
    highlights: [
      "Worked daily with multinational NATO teams.",
      "Responsible for high-value technical equipment.",
    ],
  },
];
