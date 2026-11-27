"use client";

import { FileText, Menu, X } from "lucide-react";
import { useEffect, useState, type CSSProperties } from "react";
import { Button } from "@/components/ui/button";
import { navigation, profile } from "@/content/profile";
import { useActiveSection } from "@/hooks/use-active-section";
import { useScrolled } from "@/hooks/use-scrolled";
import { cn } from "@/lib/utils";

const sectionIds = navigation.map((item) => item.id);

export function SiteHeader({ hasResume }: { hasResume: boolean }) {
  const scrolled = useScrolled();
  const active = useActiveSection(sectionIds);
  const [open, setOpen] = useState(false);

  // Close the mobile menu on Escape and when the viewport grows to desktop size.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const desktop = window.matchMedia("(min-width: 768px)");
    const onResize = () => desktop.matches && setOpen(false);
    window.addEventListener("keydown", onKey);
    desktop.addEventListener("change", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      desktop.removeEventListener("change", onResize);
    };
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-colors duration-300",
        scrolled || open ? "border-border bg-background/85 backdrop-blur-md" : "border-transparent",
      )}
    >
      <nav aria-label="Main" className="mx-auto flex h-16 max-w-[96rem] items-center justify-between gap-6 px-5 sm:px-8">
        <a href="#top" className="group flex items-center gap-2.5 rounded-md" aria-label={`${profile.name}, back to top`}>
          <span className="grid size-8 place-items-center rounded-sm bg-primary font-mono text-[11px] font-semibold text-primary-foreground">
            {profile.initials}
          </span>
          <span className="hidden text-sm font-semibold sm:inline">{profile.shortName}</span>
        </a>

        <ul className="hidden items-center gap-1 md:flex xl:hidden">
          {navigation.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                data-mood="happy"
                aria-current={active === item.id ? "location" : undefined}
                className={cn(
                  "rounded-md px-3 py-2 text-sm transition-colors hover:text-foreground",
                  active === item.id ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <p className="hidden items-center gap-2 font-mono text-[11px] text-muted-foreground lg:flex">
            <span aria-hidden="true" className="size-2 rounded-full bg-success" />
            {profile.availability}
          </p>
          {hasResume ? (
            <Button asChild size="sm" variant="secondary" className="hidden sm:inline-flex">
              <a href={profile.resumePath} download data-mood="excited">
                <FileText />
                Resume
              </a>
            </Button>
          ) : null}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X /> : <Menu />}
          </Button>
        </div>
      </nav>

      {/* Reading progress, for screens without the trace rail. */}
      <span
        aria-hidden="true"
        className="scroll-linked absolute inset-x-0 -bottom-px h-0.5 origin-left bg-foreground xl:hidden"
        style={{ "--scroll-anim": "grow-x" } as CSSProperties}
      />

      {open ? (
        <div id="mobile-menu" className="border-t border-border md:hidden">
          <ul className="mx-auto flex flex-col px-5 py-3">
            {navigation.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={() => setOpen(false)}
                  className="block rounded-md px-2 py-3 text-base text-foreground hover:bg-card"
                >
                  {item.label}
                </a>
              </li>
            ))}
            {hasResume ? (
              <li>
                <a
                  href={profile.resumePath}
                  download
                  className="flex items-center gap-2 rounded-md px-2 py-3 text-base text-foreground hover:bg-card"
                >
                  <FileText className="size-4" />
                  Resume
                </a>
              </li>
            ) : null}
          </ul>
        </div>
      ) : null}
    </header>
  );
}
