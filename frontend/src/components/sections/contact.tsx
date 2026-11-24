import { Mail } from "lucide-react";
import { GitHubIcon, LinkedInIcon } from "@/components/brand-icons";
import { ContactForm } from "@/components/contact-form";
import { Reveal } from "@/components/reveal";
import { Section } from "@/components/section";
import { profile } from "@/content/profile";

const channels = [
  { label: "Email", value: profile.email, href: profile.email ? `mailto:${profile.email}` : "", icon: Mail },
  { label: "LinkedIn", value: "Connect on LinkedIn", href: profile.linkedin, icon: LinkedInIcon },
  { label: "GitHub", value: profile.github.replace(/^https?:\/\//, ""), href: profile.github, icon: GitHubIcon },
].filter((channel) => channel.href);

export function Contact() {
  return (
    <Section
      id="contact"
      eyebrow="Contact"
      title="Let's build something reliable."
      description="Hiring for a backend role, or want to talk about an API or system design? Send a message. I read every one and reply within a couple of days."
    >
      <div className="grid gap-10 lg:grid-cols-[1fr_1.5fr] lg:gap-16">
        <Reveal>
          <ul className="space-y-3">
            {channels.map(({ label, value, href, icon: Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="group flex items-center gap-4 rounded-xl border border-border bg-card/40 p-4 transition-colors hover:border-border-strong"
                >
                  <span className="grid size-10 place-items-center rounded-lg border border-border bg-background text-muted-foreground transition-colors group-hover:text-foreground">
                    <Icon className="size-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs text-muted-foreground">{label}</span>
                    <span className="block truncate text-sm text-zinc-200">{value}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.06}>
          <div className="relative rounded-2xl border border-border bg-card/50 p-6 shadow-soft sm:p-8">
            <ContactForm />
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
