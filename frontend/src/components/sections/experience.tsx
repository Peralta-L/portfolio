import { Section } from "@/components/section";
import { formatPeriod } from "@/lib/utils";
import type { Experience as ExperienceItem } from "@/types/api";

export function Experience({ items }: { items: ExperienceItem[] }) {
  return (
    <Section id="experience" title="Where I've built discipline and software.">
      <ol className="border-b border-border">
        {items.map((item) => (
          <li
            key={`${item.organization}-${item.role}`}
            className="grid gap-4 border-t border-border py-10 md:grid-cols-[10rem_minmax(0,1fr)] md:gap-8"
          >
            <p className="font-mono text-xs leading-6 text-muted-foreground">
              <time dateTime={item.startDate}>{formatPeriod(item.startDate, item.endDate)}</time>
              {item.location ? <span className="block">{item.location}</span> : null}
            </p>
            <div className="max-w-3xl">
              <h3 className="font-display text-xl sm:text-2xl">{item.role}</h3>
              <p className="mt-1 text-[15px] font-semibold text-(--span)">{item.organization}</p>
              <p className="mt-4 text-[15px] leading-[1.7] text-pretty text-muted-foreground">{item.summary}</p>
              {item.highlights.length > 0 ? (
                <ul className="mt-4 space-y-2">
                  {item.highlights.map((highlight) => (
                    <li key={highlight} className="flex gap-3 text-[15px] leading-relaxed">
                      <span aria-hidden="true" className="mt-[0.6em] size-1.5 shrink-0 bg-(--span)" />
                      {highlight}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
