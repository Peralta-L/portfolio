"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { spanColor, spans } from "@/content/profile";
import { useActiveSection } from "@/hooks/use-active-section";
import { cn } from "@/lib/utils";

const ids = spans.map((s) => s.id);

type Bar = { left: number; width: number };

/**
 * The page drawn as a trace waterfall: each section is a span whose bar is its
 * real position and height on the page, and the playhead is the scroll position.
 * Bars are measured from the DOM; the playhead is a CSS scroll-driven animation.
 */
export function TraceRail() {
  const active = useActiveSection(ids);
  const [bars, setBars] = useState<Record<string, Bar>>({});

  useEffect(() => {
    const measure = () => {
      // Progress space: 0 at the top of the page, 1 when scrolled to the bottom.
      const range = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const next: Record<string, Bar> = {};
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top + window.scrollY;
        // A section that starts below the last scroll position still keeps its 2% bar inside the track.
        const left = Math.min(0.98, top / range);
        next[id] = { left, width: Math.max(0.02, Math.min(1 - left, el.offsetHeight / range)) };
      }
      setBars(next);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(document.body);
    // The range also depends on the window height, which the body observer doesn't see.
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <nav aria-label="Sections" className="sticky top-24">
      <p className="mb-4 font-mono text-[11px] text-muted-foreground">trace, {spans.length} spans</p>
      <div className="relative">
        <ol className="space-y-1">
          {spans.map((span) => {
            const bar = bars[span.id];
            const isActive = active === span.id;
            return (
              <li key={span.id} style={{ "--span": spanColor(span.id) } as CSSProperties}>
                <a
                  href={`#${span.id}`}
                  data-mood="happy"
                  aria-current={isActive ? "location" : undefined}
                  className="group grid grid-cols-[6.5rem_1fr] items-center gap-3 rounded-sm py-1.5"
                >
                  <span
                    className={cn(
                      "truncate text-sm transition-colors",
                      isActive ? "font-semibold text-foreground" : "text-muted-foreground group-hover:text-foreground",
                    )}
                  >
                    {span.label}
                  </span>
                  <span className="relative h-3 bg-muted">
                    {bar ? (
                      <span
                        className={cn(
                          "absolute inset-y-0 bg-(--span) transition-opacity",
                          isActive ? "opacity-100" : "opacity-45 group-hover:opacity-80",
                        )}
                        style={{ left: `${bar.left * 100}%`, width: `${bar.width * 100}%` }}
                      />
                    ) : null}
                  </span>
                </a>
              </li>
            );
          })}
        </ol>
        {/* Playhead, aligned with the bar column. */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 left-[calc(6.5rem+0.75rem)]">
          <span
            className="scroll-linked absolute -inset-y-2 w-px bg-foreground"
            style={{ "--scroll-anim": "playhead" } as CSSProperties}
          />
        </div>
      </div>
    </nav>
  );
}
