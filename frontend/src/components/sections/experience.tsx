import { MapPin } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { Section } from "@/components/section";
import { formatPeriod } from "@/lib/utils";
import type { Experience as ExperienceItem } from "@/types/api";

export function Experience({ items }: { items: ExperienceItem[] }) {
  return (
    <Section
      id="experience"
      eyebrow="Experience"
      title="Where I've built discipline and software."
    >
      <ol className="relative ml-1.5 border-l border-border sm:ml-3">
        {items.map((item, i) => (
          <li key={`${item.organization}-${item.role}`} className="relative pb-12 pl-8 last:pb-0 sm:pl-12">
            <span
              aria-hidden="true"
              className="absolute top-1.5 -left-[7px] size-3.5 rounded-full border-2 border-background bg-primary ring-4 ring-primary/15"
            />
            <Reveal delay={i * 0.05}>
              <div className="grid gap-2 sm:grid-cols-[1fr_auto] sm:items-baseline sm:gap-6">
                <div>
                  <h3 className="text-lg font-semibold tracking-tight">{item.role}</h3>
                  <p className="mt-0.5 text-[15px] text-zinc-300">
                    {item.organization}
                    {item.location ? (
                      <span className="ml-2 inline-flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin aria-hidden="true" className="size-3.5" />
                        {item.location}
                      </span>
                    ) : null}
                  </p>
                </div>
                <p className="font-mono text-xs text-muted-foreground sm:text-right">
                  <time dateTime={item.startDate}>{formatPeriod(item.startDate, item.endDate)}</time>
                </p>
              </div>
              <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
                {item.summary}
              </p>
              {item.highlights.length > 0 ? (
                <ul className="mt-4 max-w-3xl space-y-2">
                  {item.highlights.map((highlight) => (
                    <li key={highlight} className="flex gap-3 text-sm leading-relaxed text-zinc-300">
                      <span aria-hidden="true" className="mt-2 size-1 shrink-0 rounded-full bg-accent" />
                      {highlight}
                    </li>
                  ))}
                </ul>
              ) : null}
            </Reveal>
          </li>
        ))}
      </ol>
    </Section>
  );
}
