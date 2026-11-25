import { JsonLd } from "@/components/json-ld";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { TraceRail } from "@/components/layout/trace-rail";
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
      <div className="mx-auto grid max-w-[84rem] gap-12 px-5 sm:px-8 xl:grid-cols-[17rem_minmax(0,1fr)] xl:gap-16">
        <aside className="hidden xl:block">
          <TraceRail />
        </aside>
        <main id="main" className="min-w-0">
          <Hero hasResume={resume} />
          <About />
          <Projects projects={projects} />
          <Architecture />
          <Skills groups={skills} />
          <Experience items={experience} />
          <Education />
          <Contact />
        </main>
      </div>
      <SiteFooter />
    </>
  );
}
