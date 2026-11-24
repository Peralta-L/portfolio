import { existsSync } from "node:fs";
import { join } from "node:path";
import { profile } from "@/content/profile";

/** True when public/resume.pdf exists. Evaluated at build time for static pages. */
export function hasResume(): boolean {
  return existsSync(join(process.cwd(), "public", profile.resumePath));
}
