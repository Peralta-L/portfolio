import { JsonLd } from "@/components/json-ld";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { About } from "@/components/sections/about";
import { Architecture } from "@/components/sections/architecture";
import { Contact } from "@/components/sections/contact";
import { Education } from "@/components/sections/education";
import { Experience } from "@/components/sections/experience";
import { Hero } from "@/components/sections/hero";
import { Projects } from "@/components/sections/projects";
import { Skills } from "@/components/sections/skills";
import { getExperience, getProjects, getSkills } from "@/lib/api";
import { hasResume } from "@/lib/resume";

/** Statically generated; content from the API is refreshed hourly (ISR). */
export const revalidate = 3600;

export default async function HomePage() {
  const [projects, skills, experience] = await Promise.all([getProjects(), getSkills(), getExperience()]);
  const resume = hasResume();

  return (
    <>
      <JsonLd skills={skills} />
      <SiteHeader hasResume={resume} />
      <main id="main">
        <Hero projects={projects} hasResume={resume} />
        <About />
        <Projects projects={projects} />
        <Architecture />
        <Skills groups={skills} />
        <Experience items={experience} />
        <Education />
        <Contact />
      </main>
      <SiteFooter />
    </>
  );
}
