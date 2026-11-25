import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { GitHubIcon } from "@/components/brand-icons";
import { Section } from "@/components/section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Project } from "@/types/api";

export function Projects({ projects }: { projects: Project[] }) {
  return (
    <Section
      id="projects"
      meta={`${projects.length} projects`}
      title="Systems I've designed and built."
      description="From an AI-powered mobile app to a team-built stock tracker, each project tackles a different engineering problem."
    >
      <ul className="border-b border-border">
        {projects.map((project) => (
          <li key={project.slug} className="border-t border-border">
            <ProjectRow project={project} />
          </li>
        ))}
      </ul>
    </Section>
  );
}

function ProjectRow({ project }: { project: Project }) {
  return (
    <article className="grid gap-6 py-10 md:grid-cols-[10rem_minmax(0,1fr)] md:gap-8">
      <ul className="flex flex-wrap content-start gap-1.5 md:order-none md:flex-col md:items-start" aria-label="Technologies">
        {project.technologies.map((tech) => (
          <li key={tech}>
            <Badge>{tech}</Badge>
          </li>
        ))}
      </ul>

      <div className="-order-1 grid gap-6 md:order-none lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-12">
        <div>
          <h3 className="font-display text-2xl leading-tight sm:text-[1.75rem]">{project.title}</h3>
          <p className="mt-3 text-[17px] leading-relaxed text-pretty">{project.summary}</p>
          {project.githubUrl || project.liveUrl ? (
            <div className="mt-6 flex flex-wrap gap-2">
              {project.githubUrl ? (
                <Button asChild size="sm" variant="secondary">
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" data-mood="wink">
                    <GitHubIcon />
                    Source<span className="sr-only"> code for {project.title}</span>
                  </a>
                </Button>
              ) : null}
              {project.liveUrl ? (
                <Button asChild size="sm" variant="ghost">
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" data-mood="excited">
                    Live demo<span className="sr-only"> of {project.title}</span>
                    <ArrowUpRight />
                  </a>
                </Button>
              ) : null}
            </div>
          ) : null}
        </div>
        <div>
          {project.imageUrl ? (
            <div className="relative mb-5 aspect-[16/9] overflow-hidden rounded-[3px] border border-border">
              <Image
                src={project.imageUrl}
                alt={`Screenshot of ${project.title}`}
                fill
                sizes="(min-width: 1024px) 480px, 100vw"
                className="object-cover"
              />
            </div>
          ) : null}
          <p className="text-[15px] leading-[1.7] text-pretty text-muted-foreground">{project.description}</p>
        </div>
      </div>
    </article>
  );
}
