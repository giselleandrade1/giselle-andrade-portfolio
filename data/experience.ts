import type { Experience } from "@/data/types";

export const experience = [
  {
    id: "full-stack-journey",
    period: "2026",
    title: "Full Stack Development Journey",
    context: "Project-based learning",
    description:
      "Building and documenting real applications across task management, e-commerce, authentication, finance interfaces, and professional websites.",
    technologies: ["Java", "JavaScript", "TypeScript", "React", "Next.js", "Node.js"],
    kind: "milestone",
  },
  {
    id: "backend-focus",
    period: "2026",
    title: "Backend Engineering Focus",
    context: "Independent study and project work",
    description:
      "Studying APIs, system architecture, databases, authentication, business rules, and object-oriented programming.",
    technologies: ["Java", "Node.js", "SQL", "APIs"],
    kind: "milestone",
  },
  {
    id: "interface-practice",
    period: "2026",
    title: "UI/UX and Web Interfaces",
    context: "Responsive product interfaces",
    description:
      "Designing and implementing accessible, responsive, and visually structured interfaces for web applications.",
    technologies: ["React", "Next.js", "TypeScript", "CSS"],
    kind: "milestone",
  },
  {
    id: "professional-presence",
    period: "2026",
    title: "Portfolio and Professional Positioning",
    context: "GitHub, LinkedIn, and deployed projects",
    description:
      "Organizing a professional digital presence around public repositories, deployed applications, technical documentation, and continuous learning.",
    kind: "milestone",
  },
] as const satisfies readonly Experience[];
