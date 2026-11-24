import { ArrowUpRight } from "lucide-react";
import { GitHubIcon } from "@/components/brand-icons";
import { ProjectCover } from "@/components/project-cover";
import { Reveal } from "@/components/reveal";
import { Section } from "@/components/section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Project } from "@/types/api";

export function Projects({ projects }: { projects: Project[] }) {
  return (
    <Section
      id="projects"
      eyebrow="Featured Projects"
      title="Systems I've designed and built."
      description="From an AI-powered mobile app to a team-built stock tracker, each project tackles a different engineering problem."
    >
      <ul className="grid gap-6 md:grid-cols-2">
        {projects.map((project, i) => (
          <li key={project.slug}>
            <Reveal delay={(i % 2) * 0.06} className="h-full">
              <ProjectCard project={project} />
            </Reveal>
          </li>
        ))}
      </ul>
    </Section>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card/50 shadow-soft transition-colors duration-300 hover:border-border-strong">
      <ProjectCover project={project} />
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-lg font-semibold tracking-tight">{project.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-zinc-300">{project.summary}</p>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{project.description}</p>

        <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Technologies">
          {project.technologies.map((tech) => (
            <li key={tech}>
              <Badge>{tech}</Badge>
            </li>
          ))}
        </ul>

        {project.githubUrl || project.liveUrl ? (
          <div className="mt-auto flex flex-wrap gap-2 pt-6">
            {project.githubUrl ? (
              <Button asChild size="sm" variant="secondary">
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                  <GitHubIcon />
                  Source<span className="sr-only"> code for {project.title}</span>
                </a>
              </Button>
            ) : null}
            {project.liveUrl ? (
              <Button asChild size="sm" variant="ghost">
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                  Live demo<span className="sr-only"> of {project.title}</span>
                  <ArrowUpRight />
                </a>
              </Button>
            ) : null}
          </div>
        ) : null}
      </div>
    </article>
  );
}
