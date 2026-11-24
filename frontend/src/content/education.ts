import type { Certification, Education, Language } from "@/types/content";

export const education: Education[] = [
  {
    degree: "B.S. Computer Science",
    institution: "University of Maryland Global Campus",
    // TODO(Luis): add your graduation year, e.g. period: "2021 — 2025".
    description:
      "Software engineering, data structures and algorithms, databases, operating systems and computer networks, completed alongside military service.",
    coursework: [
      "Data Structures & Algorithms",
      "Database Systems",
      "Software Engineering",
      "Operating Systems",
      "Computer Networks",
      "Object-Oriented Design",
    ],
  },
];

export const certifications: Certification[] = [
  { name: "CS50: Introduction to Computer Science", issuer: "Harvard University (edX)" },
];

export const languages: Language[] = [
  { name: "Spanish", level: "Native" },
  { name: "English", level: "Advanced" },
  { name: "German", level: "B1" },
];
