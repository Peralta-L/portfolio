import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import type { ReactNode } from "react";
import { MotionProvider } from "@/components/motion-provider";
import { profile } from "@/content/profile";
import "./globals.css";

const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans", display: "swap" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap" });

const description = `${profile.title}. ${profile.headline} Java, Python, TypeScript, PostgreSQL, cloud and AI integration.`;

export const metadata: Metadata = {
  metadataBase: new URL(profile.siteUrl),
  title: {
    default: `${profile.name} · Backend Engineer`,
    template: `%s · ${profile.name}`,
  },
  description,
  applicationName: `${profile.name} Portfolio`,
  authors: [{ name: profile.name, url: profile.siteUrl }],
  creator: profile.name,
  keywords: [
    profile.name,
    "Backend Engineer",
    "Java",
    "Spring Boot",
    "Python",
    "FastAPI",
    "TypeScript",
    "PostgreSQL",
    "REST API",
    "Software Engineer",
    "AI Integration",
    "Portfolio",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: profile.name,
    title: `${profile.name} · Backend Engineer`,
    description,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} · Backend Engineer`,
    description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#09090b",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:text-white"
        >
          Skip to content
        </a>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
