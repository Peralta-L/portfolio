import { ImageResponse } from "next/og";
import { profile } from "@/content/profile";

export const alt = `${profile.name} · Software Engineer`;
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
          background: "#e9ecef",
          color: "#121820",
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
              background: "#121820",
              color: "#f7f8f9",
              fontSize: 26,
              fontWeight: 700,
            }}
          >
            {profile.initials}
          </div>
          <div style={{ fontSize: 26, color: "#4a5563" }}>Portfolio</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 76, fontWeight: 700, letterSpacing: -2 }}>{profile.name}</div>
          <div style={{ fontSize: 32, color: "#2a3bc9" }}>{profile.title}</div>
          <div style={{ fontSize: 30, color: "#4a5563", maxWidth: 900 }}>{profile.headline}</div>
        </div>
        <div style={{ display: "flex", gap: 14, fontSize: 22, color: "#121820" }}>
          {["Java", "Python", "TypeScript", "Spring Boot", "PostgreSQL", "AI"].map((tag) => (
            <div key={tag} style={{ display: "flex", padding: "8px 16px", borderRadius: 10, border: "1px solid #9aa4b0" }}>
              {tag}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
