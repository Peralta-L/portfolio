import { education } from "@/content/education";
import { profile } from "@/content/profile";
import type { SkillGroup } from "@/types/api";

/** schema.org structured data so search engines understand who the site is about. */
export function JsonLd({ skills }: { skills: SkillGroup[] }) {
  const sameAs = [profile.github, profile.linkedin].filter(Boolean);
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${profile.siteUrl}/#person`,
        name: profile.name,
        jobTitle: "Software Engineer",
        description: profile.headline,
        url: profile.siteUrl,
        ...(profile.email ? { email: `mailto:${profile.email}` } : {}),
        sameAs,
        knowsAbout: skills.flatMap((group) => group.skills),
        alumniOf: education.map((entry) => ({ "@type": "CollegeOrUniversity", name: entry.institution })),
      },
      {
        "@type": "WebSite",
        "@id": `${profile.siteUrl}/#website`,
        url: profile.siteUrl,
        name: `${profile.name} · Portfolio`,
        author: { "@id": `${profile.siteUrl}/#person` },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      // Escape "<" so content can never close the script tag early.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
