import { profile } from "@/data/profile";

export interface SiteConfig {
  readonly name: string;
  readonly title: string;
  readonly description: string;
  readonly url: string;
  readonly locale: "en_US";
  readonly language: "en";
  readonly author: string;
  readonly email: string;
  readonly keywords: readonly string[];
  readonly links: {
    readonly github: string;
    readonly linkedin: string;
  };
  readonly openGraphImage: {
    readonly url: string;
    readonly width: number;
    readonly height: number;
    readonly alt: string;
  };
}

export const siteConfig = {
  name: profile.brand,
  title: "Giselle Andrade | Full Stack Developer",
  description:
    "Portfolio of Giselle Andrade, a Full Stack Developer focused on backend development, Java, TypeScript, React, Next.js, APIs, and thoughtful digital experiences.",
  url: "https://giselleandrade1-dev.vercel.app",
  locale: "en_US",
  language: "en",
  author: profile.name,
  email: profile.email,
  keywords: [
    "Giselle Andrade",
    "Full Stack Developer",
    "Backend Developer",
    "Java Developer",
    "TypeScript Developer",
    "React Developer",
    "Next.js Developer",
    "Software Developer",
    "Web Development",
    "Portfolio",
  ],
  links: {
    github: "https://github.com/giselleandrade1",
    linkedin: "https://www.linkedin.com/in/giselleandrades2",
  },
  openGraphImage: {
    url: "/opengraph-image",
    width: 1200,
    height: 630,
    alt: "Giselle Andrade — Full Stack Developer portfolio",
  },
} as const satisfies SiteConfig;
