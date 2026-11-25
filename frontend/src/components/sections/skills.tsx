import { Section } from "@/components/section";
import { skillCategoryBlurb } from "@/content/skills";
import type { SkillGroup } from "@/types/api";

export function Skills({ groups }: { groups: SkillGroup[] }) {
  return (
    <Section
      id="skills"
      meta={`${groups.reduce((n, g) => n + g.skills.length, 0)} tools`}
      title="The toolkit."
      description="Tools I use to ship and run production software, grouped by where they sit in the stack."
    >
      <ul className="grid gap-10 md:grid-cols-3 md:gap-0 md:divide-x md:divide-border">
        {groups.map((group) => (
          <li key={group.category} className="md:px-8 md:first:pl-0 md:last:pr-0">
            <h3 className="font-display text-xl">{group.label}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{skillCategoryBlurb[group.category]}</p>
            <ul className="mt-5 divide-y divide-border border-y border-border">
              {group.skills.map((skill) => (
                <li key={skill} className="py-2 text-[15px]">
                  {skill}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </Section>
  );
}
