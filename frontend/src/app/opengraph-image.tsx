import { ImageResponse } from "next/og";
import { profile } from "@/content/profile";

export const alt = `${profile.name} · Backend Engineer`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Social preview card, generated at build time. */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background: "radial-gradient(80% 90% at 50% 0%, #172554 0%, #09090b 70%)",
          color: "#fafafa",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 64,
              height: 64,
              borderRadius: 14,
              background: "#2563eb",
              fontSize: 26,
              fontWeight: 700,
            }}
          >
            {profile.initials}
          </div>
          <div style={{ fontSize: 26, color: "#a1a1aa" }}>Portfolio</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 76, fontWeight: 700, letterSpacing: -2 }}>{profile.name}</div>
          <div style={{ fontSize: 32, color: "#60a5fa" }}>{profile.title}</div>
          <div style={{ fontSize: 30, color: "#a1a1aa", maxWidth: 900 }}>{profile.headline}</div>
        </div>
        <div style={{ display: "flex", gap: 14, fontSize: 22, color: "#d4d4d8" }}>
          {["Java", "Python", "TypeScript", "Spring Boot", "PostgreSQL", "AI"].map((tag) => (
            <div key={tag} style={{ display: "flex", padding: "8px 16px", borderRadius: 10, border: "1px solid #3f3f46" }}>
              {tag}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
