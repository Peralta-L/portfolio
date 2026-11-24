import type { LucideIcon } from "lucide-react";

export type FocusArea = {
  title: string;
  description: string;
  icon: LucideIcon;
};

/** Frontend-only visual metadata for a project card, keyed by project slug. */
export type ProjectVisual = {
  icon: LucideIcon;
  /** Two CSS colors for the cover gradient. */
  gradient: [string, string];
};

export type ArchitectureNode = {
  title: string;
  detail: string;
  icon: LucideIcon;
};

export type ArchitectureDiagram = {
  slug: string;
  name: string;
  summary: string;
  /** Top-to-bottom tiers. A tier with several nodes renders them side by side. */
  tiers: ArchitectureNode[][];
  decisions: string[];
};

export type Education = {
  degree: string;
  institution: string;
  period?: string;
  description: string;
  coursework: string[];
};

export type Certification = {
  name: string;
  issuer: string;
};

export type Language = {
  name: string;
  level: string;
};
