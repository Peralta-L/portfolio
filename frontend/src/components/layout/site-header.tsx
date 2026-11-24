"use client";

import { FileText, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
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
        scrolled || open ? "border-border bg-background/80 backdrop-blur-xl" : "border-transparent",
      )}
    >
      <nav aria-label="Main" className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <a href="#top" className="group flex items-center gap-2.5 rounded-md" aria-label={`${profile.name}, back to top`}>
          <span className="grid size-8 place-items-center rounded-lg bg-primary font-mono text-xs font-semibold text-white shadow-glow">
            {profile.initials}
          </span>
          <span className="hidden text-sm font-medium tracking-tight sm:inline">{profile.shortName}</span>
        </a>

        <ul className="hidden items-center gap-1 md:flex">
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

        <div className="flex items-center gap-2">
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

      {open ? (
        <div id="mobile-menu" className="border-t border-border md:hidden">
          <ul className="mx-auto flex max-w-6xl flex-col px-5 py-3">
            {navigation.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={() => setOpen(false)}
                  className="block rounded-md px-2 py-3 text-base text-zinc-200 hover:bg-card"
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
                  className="flex items-center gap-2 rounded-md px-2 py-3 text-base text-zinc-200 hover:bg-card"
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
