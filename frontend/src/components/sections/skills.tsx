import { Cloud, Monitor, Server, type LucideIcon } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { Section } from "@/components/section";
import { skillCategoryBlurb } from "@/content/skills";
import type { SkillCategory, SkillGroup } from "@/types/api";

const categoryIcon: Record<SkillCategory, LucideIcon> = {
  BACKEND: Server,
  FRONTEND: Monitor,
  CLOUD: Cloud,
};

export function Skills({ groups }: { groups: SkillGroup[] }) {
  return (
    <Section
      id="skills"
      eyebrow="Skills"
      title="The toolkit."
      description="Tools I use to ship and run production software, grouped by where they sit in the stack."
    >
      <ul className="grid gap-4 md:grid-cols-3">
        {groups.map((group, i) => {
          const Icon = categoryIcon[group.category];
          return (
            <li key={group.category}>
              <Reveal delay={i * 0.06} className="h-full">
                <div className="h-full rounded-2xl border border-border bg-card/50 p-6 shadow-soft">
                  <div className="flex items-center gap-3">
                    <span className="grid size-9 place-items-center rounded-lg bg-primary/10 text-accent ring-1 ring-primary/30">
                      <Icon aria-hidden="true" className="size-4" />
                    </span>
                    <h3 className="font-semibold">{group.label}</h3>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {skillCategoryBlurb[group.category]}
                  </p>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {group.skills.map((skill) => (
                      <li
                        key={skill}
                        className="rounded-lg border border-border-strong bg-background/60 px-3 py-1.5 text-sm text-zinc-200"
                      >
                        {skill}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
