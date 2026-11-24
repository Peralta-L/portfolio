import { ArrowRight, FileText } from "lucide-react";
import { GitHubIcon, LinkedInIcon } from "@/components/brand-icons";
import { Button } from "@/components/ui/button";
import { profile } from "@/content/profile";
import type { Project } from "@/types/api";

/** The hero is the LCP element, so it animates with CSS (no JS needed to become visible). */
export function Hero({ projects, hasResume }: { projects: Project[]; hasResume: boolean }) {
  return (
    <section id="top" aria-labelledby="hero-heading" className="relative isolate overflow-hidden">
      <div aria-hidden="true" className="bg-grid absolute inset-0 -z-10" />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -top-40 -z-10 mx-auto h-[480px] max-w-4xl rounded-full bg-[radial-gradient(closest-side,rgb(37_99_235/0.22),transparent)] blur-2xl"
      />

      <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 pt-16 pb-24 sm:px-8 sm:pt-24 sm:pb-32 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <div className="animate-fade-up min-w-0">
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs text-zinc-300">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-success" />
            </span>
            {profile.availability}
          </p>

          <h1 id="hero-heading" className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
            <span className="text-gradient">{profile.name}</span>
          </h1>
          <p className="mt-4 font-mono text-sm text-accent sm:text-base">{profile.title}</p>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-pretty text-muted-foreground sm:text-xl">
            {profile.headline}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Button asChild size="lg">
              <a href="#projects">
                View Projects
                <ArrowRight />
              </a>
            </Button>
            {hasResume ? (
              <Button asChild size="lg" variant="secondary">
                <a href={profile.resumePath} download>
                  <FileText />
                  Download Resume
                </a>
              </Button>
            ) : null}
            <div className="flex items-center gap-2">
              {profile.github ? (
                <Button asChild size="icon" variant="outline" className="size-11">
                  <a href={profile.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub profile">
                    <GitHubIcon />
                  </a>
                </Button>
              ) : null}
              {profile.linkedin ? (
                <Button asChild size="icon" variant="outline" className="size-11">
                  <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile">
                    <LinkedInIcon />
                  </a>
                </Button>
              ) : null}
            </div>
          </div>
        </div>

        <ApiConsole projects={projects} />
      </div>
    </section>
  );
}

/** A stylised request/response against this site's own API: shows, rather than tells, what I build. */
function ApiConsole({ projects }: { projects: Project[] }) {
  const sample = projects.slice(0, 2);
  return (
    <figure
      className="animate-fade-up relative min-w-0 rounded-2xl border border-border bg-card/70 shadow-soft backdrop-blur [animation-delay:120ms]"
      aria-label="Example response from this site's GET /api/projects endpoint"
    >
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <span aria-hidden="true" className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-zinc-700" />
          <span className="size-2.5 rounded-full bg-zinc-700" />
          <span className="size-2.5 rounded-full bg-zinc-700" />
        </span>
        <span className="ml-2 font-mono text-xs text-muted-foreground">portfolio-api · Spring Boot 3</span>
      </div>
      <pre className="overflow-x-auto p-5 font-mono text-[12.5px] leading-6 text-zinc-300 sm:text-[13px]">
        <code>
          <span className="text-success">GET</span> <span className="text-zinc-100">/api/projects</span>
          {"\n"}
          <span className="text-muted-foreground">HTTP/1.1 </span>
          <span className="text-success">200 OK</span>
          <span className="text-muted-foreground"> · application/json · 38 ms</span>
          {"\n\n"}
          {"["}
          {sample.map((project, i) => (
            <span key={project.slug}>
              {"\n  {\n"}
              {"    "}
              <span className="text-accent">&quot;slug&quot;</span>: <span className="text-amber-200">&quot;{project.slug}&quot;</span>,
              {"\n    "}
              <span className="text-accent">&quot;stack&quot;</span>: [
              {project.technologies.slice(0, 3).map((tech, j) => (
                <span key={tech}>
                  <span className="text-amber-200">&quot;{tech}&quot;</span>
                  {j < 2 ? ", " : ""}
                </span>
              ))}
              ]{"\n  }"}
              {i < sample.length - 1 ? "," : ""}
            </span>
          ))}
          {"\n]"}
        </code>
      </pre>
      <figcaption className="flex flex-wrap gap-x-5 gap-y-2 border-t border-border px-5 py-3 font-mono text-[11px] text-muted-foreground">
        <span>✓ validated DTOs</span>
        <span>✓ RFC 9457 errors</span>
        <span>✓ rate limited</span>
      </figcaption>
    </figure>
  );
}
