import { Section } from "@/components/section";
import { bio, focusAreas } from "@/content/profile";

export function About() {
  return (
    <Section
      id="about"
      title="Full-stack engineer who cares about the whole system."
      description="I like problems where correctness, performance and clarity all matter at once."
    >
      <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-12">
        <div className="max-w-prose space-y-5 text-[17px] leading-[1.7] text-pretty">
          {bio.map((paragraph) => (
            <p key={paragraph.slice(0, 24)}>{paragraph}</p>
          ))}
        </div>

        <dl className="divide-y divide-border border-y border-border">
          {focusAreas.map(({ title, description, icon: Icon }) => (
            <div key={title} className="grid grid-cols-[1.25rem_minmax(0,1fr)] gap-x-3 py-4">
              <Icon aria-hidden="true" className="mt-0.5 size-4 text-(--span)" />
              <dt className="text-[15px] font-semibold">{title}</dt>
              <dd className="col-start-2 mt-1 text-sm leading-relaxed text-muted-foreground">{description}</dd>
            </div>
          ))}
        </dl>
      </div>
    </Section>
  );
}
