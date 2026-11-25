import type { CSSProperties, ReactNode } from "react";
import { spanColor, spans, type SpanId } from "@/content/profile";
import { cn } from "@/lib/utils";

type SectionProps = {
  id: SpanId;
  title: string;
  description?: string;
  /** Short fact shown beside the span name, e.g. "4 projects". */
  meta?: string;
  children: ReactNode;
  className?: string;
};

/** Page section headed like a span in a trace: service/name on the left, heading on the right. */
export function Section({ id, title, description, meta, children, className }: SectionProps) {
  const headingId = `${id}-heading`;
  const service = spans.find((s) => s.id === id)!.service;
  return (
    <section
      id={id}
      aria-labelledby={headingId}
      style={{ "--span": spanColor(id) } as CSSProperties}
      className={cn("py-20 sm:py-28", className)}
    >
      <header className="mb-12 grid gap-4 border-t-2 border-(--span) pt-5 sm:mb-16 md:grid-cols-[10rem_minmax(0,1fr)] md:gap-8">
        <p className="font-mono text-xs leading-6 text-(--span)">
          {service}/{id}
          {meta ? <span className="block text-muted-foreground">{meta}</span> : null}
        </p>
        <div className="max-w-2xl">
          <h2 id={headingId} className="font-display text-3xl leading-[1.05] text-balance sm:text-[2.6rem]">
            {title}
          </h2>
          {description ? (
            <p className="mt-4 text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg">{description}</p>
          ) : null}
        </div>
      </header>
      {children}
    </section>
  );
}
