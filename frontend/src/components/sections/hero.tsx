import { ArrowRight, FileText } from "lucide-react";
import { Avatar } from "@/components/avatar";
import { GitHubIcon, LinkedInIcon } from "@/components/brand-icons";
import { Button } from "@/components/ui/button";
import { profile } from "@/content/profile";

/** The hero is the LCP element, so it animates with CSS (no JS needed to become visible). */
export function Hero({ hasResume }: { hasResume: boolean }) {
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
              <a href="#projects" data-mood="happy">
                View Projects
                <ArrowRight />
              </a>
            </Button>
            {hasResume ? (
              <Button asChild size="lg" variant="secondary">
                <a href={profile.resumePath} download data-mood="excited">
                  <FileText />
                  Download Resume
                </a>
              </Button>
            ) : null}
            <div className="flex items-center gap-2">
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

        <div className="animate-fade-up relative mx-auto w-full max-w-[400px] [animation-delay:120ms]">
          <div
            aria-hidden="true"
            className="absolute inset-[8%] -z-10 rounded-full bg-[radial-gradient(closest-side,rgb(37_99_235/0.35),transparent)] blur-2xl"
          />
          <Avatar className="h-auto w-full drop-shadow-[0_24px_40px_rgb(0_0_0/0.45)]" />
        </div>
      </div>
    </section>
  );
}
