import type { Service } from "@/data/types";

export const services = [
  {
    id: "software-development",
    title: "Software Development",
    description: "Systems and digital products built around clear requirements, maintainable code, and reliable behavior.",
    icon: "code",
  },
  {
    id: "backend-development",
    title: "Backend Development",
    description: "APIs, authentication, business rules, data persistence, and application architecture.",
    icon: "server",
  },
  {
    id: "frontend-development",
    title: "Frontend Development",
    description: "Responsive, accessible, and performant interfaces built with modern web technologies.",
    icon: "layout",
  },
  {
    id: "ui-ux-interfaces",
    title: "UI/UX & Interfaces",
    description: "Clear visual hierarchy, thoughtful interactions, usability, and user-centered interface decisions.",
    icon: "palette",
  },
  {
    id: "web-development",
    title: "Web Development",
    description: "Institutional websites, landing pages, portfolios, and complete web applications.",
    icon: "globe",
  },
  {
    id: "cloud-devops",
    title: "Cloud / DevOps",
    description: "Deployment, version control, automation, containers, and cloud-oriented delivery workflows.",
    icon: "cloud",
  },
] as const satisfies readonly Service[];
