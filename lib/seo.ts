import { profile } from "@/data/profile";

export interface SiteConfig {
  readonly name: string;
  readonly url: string;
  readonly author: string;
  readonly email: string;
  readonly links: {
    readonly github: string;
    readonly linkedin: string;
  };
  readonly openGraphImage: {
    readonly url: string;
    readonly width: number;
    readonly height: number;
  };
}

export const siteConfig = {
  name: profile.brand,
  url: "https://giselleandrade1-dev.vercel.app",
  author: profile.name,
  email: profile.email,
  links: {
    github: "https://github.com/giselleandrade1",
    linkedin: "https://www.linkedin.com/in/giselleandrades2",
  },
  openGraphImage: {
    url: "/opengraph-image",
    width: 1200,
    height: 630,
  },
} as const satisfies SiteConfig;
