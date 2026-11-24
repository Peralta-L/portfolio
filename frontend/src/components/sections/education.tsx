import { Award, GraduationCap, Languages } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { Section } from "@/components/section";
import { Badge } from "@/components/ui/badge";
import { certifications, education, languages } from "@/content/education";

export function Education() {
  return (
    <Section id="education" eyebrow="Education" title="Foundations.">
      <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        {education.map((entry) => (
          <Reveal key={entry.degree} className="h-full">
            <article className="h-full rounded-2xl border border-border bg-card/50 p-6 shadow-soft sm:p-8">
              <div className="flex items-start gap-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-accent ring-1 ring-primary/30">
                  <GraduationCap aria-hidden="true" className="size-5" />
                </span>
                <div>
                  <h3 className="text-lg font-semibold tracking-tight">{entry.degree}</h3>
                  <p className="mt-0.5 text-zinc-300">{entry.institution}</p>
                  {entry.period ? <p className="mt-1 font-mono text-xs text-muted-foreground">{entry.period}</p> : null}
                </div>
              </div>
              <p className="mt-5 text-sm leading-relaxed text-muted-foreground sm:text-[15px]">{entry.description}</p>
              <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Relevant coursework">
                {entry.coursework.map((course) => (
                  <li key={course}>
                    <Badge variant="outline">{course}</Badge>
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>
        ))}

        <div className="grid gap-4">
          <Reveal delay={0.05}>
            <div className="rounded-2xl border border-border bg-card/50 p-6 shadow-soft">
              <h3 className="flex items-center gap-2 text-sm font-semibold">
                <Award aria-hidden="true" className="size-4 text-accent" />
                Certifications
              </h3>
              <ul className="mt-4 space-y-3">
                {certifications.map((cert) => (
                  <li key={cert.name}>
                    <p className="text-sm text-zinc-200">{cert.name}</p>
                    <p className="text-xs text-muted-foreground">{cert.issuer}</p>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="rounded-2xl border border-border bg-card/50 p-6 shadow-soft">
              <h3 className="flex items-center gap-2 text-sm font-semibold">
                <Languages aria-hidden="true" className="size-4 text-accent" />
                Languages
              </h3>
              <dl className="mt-4 space-y-2.5">
                {languages.map((language) => (
                  <div key={language.name} className="flex items-center justify-between text-sm">
                    <dt className="text-zinc-200">{language.name}</dt>
                    <dd className="text-muted-foreground">{language.level}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
