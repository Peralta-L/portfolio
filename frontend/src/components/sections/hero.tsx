import { FileText } from "lucide-react";
import { Avatar } from "@/components/avatar";
import { GitHubIcon, LinkedInIcon } from "@/components/brand-icons";
import { Button } from "@/components/ui/button";
import { profile } from "@/content/profile";

const nameLines = profile.name.split(" ");

/** The hero is the LCP element, so it animates with CSS (no JS needed to become visible). */
export function Hero({ hasResume }: { hasResume: boolean }) {
  return (
    <section id="top" aria-labelledby="hero-heading" className="pt-8 pb-16 sm:pt-14 sm:pb-24">

      <div className="grid items-end gap-12 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:gap-10">
        <div className="min-w-0">
          <h1
            id="hero-heading"
            className="font-display text-[clamp(3rem,9vw,6.75rem)] leading-[0.9] tracking-[-0.035em]"
          >
            {nameLines.map((word, i) => (
              <span
                key={word}
                className="animate-fade-up block"
                style={{ animationDelay: `${80 + i * 90}ms` }}
              >
                {word}
              </span>
            ))}
          </h1>

          <div className="animate-fade-up mt-10 max-w-lg [animation-delay:420ms]">
            <p className="text-lg font-semibold">{profile.title}</p>
            <p className="mt-2 text-lg leading-relaxed text-pretty text-muted-foreground">{profile.headline}</p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button asChild size="lg">
                <a href="#projects" data-mood="happy">
                  See my projects
                </a>
              </Button>
              {hasResume ? (
                <Button asChild size="lg" variant="secondary">
                  <a href={profile.resumePath} download data-mood="excited">
                    <FileText />
                    Download resume
                  </a>
                </Button>
              ) : null}
              {profile.github ? (
                <Button asChild size="icon" variant="outline" className="size-11">
                  <a href={profile.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub profile" data-mood="wink">
                    <GitHubIcon />
                  </a>
                </Button>
              ) : null}
              {profile.linkedin ? (
                <Button asChild size="icon" variant="outline" className="size-11">
                  <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile" data-mood="curious">
                    <LinkedInIcon />
                  </a>
                </Button>
              ) : null}
            </div>
          </div>
        </div>

        <figure className="animate-fade-up mx-auto w-full max-w-[380px] [animation-delay:200ms] lg:mr-0">
          <div className="bg-dots relative overflow-hidden rounded-t-[190px] border-x border-t border-border-strong bg-card px-6 pt-10">
            <Avatar className="relative h-auto w-full" />
          </div>
          <figcaption className="border-t-2 border-foreground pt-2 font-mono text-[11px] text-muted-foreground">
            Move your cursor, or hover a link, and I react.
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
