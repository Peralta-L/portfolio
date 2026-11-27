import { Section } from "@/components/section";
import { Badge } from "@/components/ui/badge";
import { certifications, education, languages } from "@/content/education";

export function Education() {
  return (
    <Section id="education" title="Foundations.">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-12">
        {education.map((entry) => (
          <article key={entry.degree}>
            <h3 className="font-display text-xl sm:text-2xl">{entry.degree}</h3>
            <p className="mt-1 text-[15px] font-semibold text-(--span)">{entry.institution}</p>
            {entry.period ? <p className="mt-1 font-mono text-xs text-muted-foreground">{entry.period}</p> : null}
            <p className="mt-4 text-[15px] leading-[1.7] text-pretty text-muted-foreground">{entry.description}</p>
            <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Relevant coursework">
              {entry.coursework.map((course) => (
                <li key={course}>
                  <Badge>{course}</Badge>
                </li>
              ))}
            </ul>
          </article>
        ))}

        <div className="grid content-start gap-10">
          <div>
            <h3 className="text-sm font-semibold">Certifications</h3>
            <ul className="mt-3 divide-y divide-border border-y border-border">
              {certifications.map((cert) => (
                <li key={cert.name} className="py-3">
                  <p className="text-[15px]">{cert.name}</p>
                  <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold">Languages</h3>
            <dl className="mt-3 divide-y divide-border border-y border-border">
              {languages.map((language) => (
                <div key={language.name} className="flex items-center justify-between py-2.5 text-[15px]">
                  <dt>{language.name}</dt>
                  <dd className="font-mono text-xs text-muted-foreground">{language.level}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </Section>
  );
}
