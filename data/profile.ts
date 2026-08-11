import type { NavItem, Profile, SocialLink } from "@/data/types";

const headlineLead = "Full Stack Developer building";
const headlineAccent = "reliable software";
const headlineTail = "and thoughtful digital experiences.";

export const navItems = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Journey", href: "#experience" },
  { label: "Contact", href: "#contact" },
] as const satisfies readonly NavItem[];

export const socialLinks = [
  {
    platform: "github",
    label: "GitHub",
    href: "https://github.com/giselleandrade1",
    handle: "@giselleandrade1",
    external: true,
  },
  {
    platform: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/giselleandrades2",
    handle: "giselleandrades2",
    external: true,
  },
  {
    platform: "email",
    label: "Email",
    href: "mailto:giselleandradelourenco@gmail.com",
    handle: "giselleandradelourenco@gmail.com",
    external: false,
  },
] as const satisfies readonly SocialLink[];

export const profile = {
  name: "Giselle Andrade",
  givenName: "Giselle",
  brand: "Giselle.dev",
  role: "Full Stack Developer",
  headline: `${headlineLead} ${headlineAccent} ${headlineTail}`,
  headlineLead,
  headlineAccent,
  headlineTail,
  summary:
    "I build web applications with a strong focus on backend development, Java, TypeScript, React, Next.js, APIs, and maintainable software.",
  bio:
    "My work combines software engineering, clean architecture, responsive interfaces, and user-centered digital experiences. I keep developing real projects to strengthen my technical practice and build accessible, secure, and well-structured products.",
  location: "São Paulo, SP, Brazil",
  email: "giselleandradelourenco@gmail.com",
  avatar: "/images/giselle-andrade.jpg",
  avatarAlt: "Portrait of Giselle Andrade",
  resumeUrl: "/curriculo-giselle-andrade.txt",
  availability: "Available for opportunities",
  focus: ["Backend", "Java", "TypeScript", "React", "Next.js"],
  socialLinks,
} as const satisfies Profile;
