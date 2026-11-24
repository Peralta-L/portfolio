import { Reveal } from "@/components/reveal";
import { Section } from "@/components/section";
import { bio, focusAreas } from "@/content/profile";

export function About() {
  return (
    <Section
      id="about"
      eyebrow="About"
      title="Backend engineer who cares about the whole system."
      description="I like problems where correctness, performance and clarity all matter at once."
    >
      <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
        <Reveal className="space-y-5 text-base leading-relaxed text-pretty text-zinc-300 sm:text-[17px]">
          {bio.map((paragraph) => (
            <p key={paragraph.slice(0, 24)}>{paragraph}</p>
          ))}
        </Reveal>

        <ul className="grid gap-3 sm:grid-cols-2">
          {focusAreas.map(({ title, description, icon: Icon }, i) => (
            <li key={title} className={i === focusAreas.length - 1 ? "sm:col-span-2" : undefined}>
              <Reveal delay={i * 0.04} className="h-full">
                <div className="h-full rounded-xl border border-border bg-card/50 p-5 transition-colors hover:border-border-strong">
                  <Icon aria-hidden="true" className="size-5 text-accent" />
                  <h3 className="mt-3 text-sm font-semibold">{title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{description}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
