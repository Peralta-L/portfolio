import { z } from "zod";

/**
 * Runtime schemas for the Spring Boot API responses. Types are inferred from
 * them, so the compile-time and runtime contracts can never drift apart.
 * The API omits null fields, hence `.nullish()`.
 */
export const projectSchema = z.object({
  id: z.number().optional(),
  slug: z.string(),
  title: z.string(),
  summary: z.string(),
  description: z.string(),
  imageUrl: z.string().nullish(),
  githubUrl: z.string().nullish(),
  liveUrl: z.string().nullish(),
  featured: z.boolean(),
  technologies: z.array(z.string()),
});

export const skillCategorySchema = z.enum(["BACKEND", "FRONTEND", "CLOUD"]);

export const skillGroupSchema = z.object({
  category: skillCategorySchema,
  label: z.string(),
  skills: z.array(z.string()),
});

export const experienceSchema = z.object({
  id: z.number().optional(),
  role: z.string(),
  organization: z.string(),
  location: z.string().nullish(),
  startDate: z.iso.date(),
  endDate: z.iso.date().nullish(),
  current: z.boolean(),
  summary: z.string(),
  highlights: z.array(z.string()),
});

export const contactRequestSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name.").max(100, "Name must be at most 100 characters."),
  email: z.email("Please enter a valid email address.").max(254),
  subject: z.string().trim().min(1, "Please add a subject.").max(150, "Subject must be at most 150 characters."),
  message: z
    .string()
    .trim()
    .min(10, "Your message should be at least 10 characters.")
    .max(5000, "Your message should be at most 5000 characters."),
  website: z.string().optional(),
});

/** RFC 9457 problem response, as produced by the API's global exception handler. */
export const problemSchema = z.object({
  title: z.string().optional(),
  status: z.number().optional(),
  detail: z.string().optional(),
  errors: z.record(z.string(), z.string()).optional(),
});

export type Project = z.infer<typeof projectSchema>;
export type SkillCategory = z.infer<typeof skillCategorySchema>;
export type SkillGroup = z.infer<typeof skillGroupSchema>;
export type Experience = z.infer<typeof experienceSchema>;
export type ContactRequest = z.infer<typeof contactRequestSchema>;
export type Problem = z.infer<typeof problemSchema>;
