import { Mail } from "lucide-react";
import { GitHubIcon, LinkedInIcon } from "@/components/brand-icons";
import { ContactForm } from "@/components/contact-form";
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
      title="Let's build something reliable."
      description="Hiring for a backend role, or want to talk about an API or system design? Send a message. I read every one and reply within a couple of days."
    >
      <div className="grid gap-10 md:ml-48 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:gap-12">
        <ul className="content-start divide-y divide-border border-y border-border">
          {channels.map(({ label, value, href, icon: Icon }) => (
            <li key={label}>
              <a
                href={href}
                data-mood={label === "GitHub" ? "wink" : "curious"}
                {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="group flex items-center gap-4 py-4"
              >
                <Icon aria-hidden="true" className="size-4 shrink-0 text-(--span)" />
                <span className="min-w-0">
                  <span className="block text-sm text-muted-foreground">{label}</span>
                  <span className="block truncate text-[15px] font-semibold underline-offset-4 group-hover:underline">
                    {value}
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>

        <div className="relative rounded-[3px] border border-border-strong bg-card p-6 sm:p-8">
          <ContactForm />
        </div>
      </div>
    </Section>
  );
}
