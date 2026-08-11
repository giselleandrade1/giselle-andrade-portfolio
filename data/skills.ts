import type { SkillGroup } from "@/data/types";

export const skills = [
  {
    category: "Languages",
    technologies: [
      { name: "Java", slug: "java" },
      { name: "JavaScript", slug: "javascript" },
      { name: "TypeScript", slug: "typescript" },
      { name: "Python", slug: "python" },
      { name: "PHP", slug: "php" },
    ],
  },
  {
    category: "Frontend",
    technologies: [
      { name: "HTML5", slug: "html5" },
      { name: "CSS3", slug: "css3" },
      { name: "React", slug: "react" },
      { name: "Next.js", slug: "nextjs" },
      { name: "Tailwind CSS", slug: "tailwindcss" },
    ],
  },
  {
    category: "Backend",
    technologies: [
      { name: "Node.js", slug: "nodejs" },
      { name: "Express", slug: "express" },
      { name: "NestJS", slug: "nestjs" },
      { name: "Spring", slug: "spring" },
      { name: "JWT", slug: "jwt" },
    ],
  },
  {
    category: "Databases",
    technologies: [
      { name: "MySQL", slug: "mysql" },
      { name: "PostgreSQL", slug: "postgresql" },
      { name: "MongoDB", slug: "mongodb" },
      { name: "SQL Server", slug: "sql-server" },
    ],
  },
  {
    category: "Cloud & DevOps",
    technologies: [
      { name: "AWS", slug: "aws" },
      { name: "Azure", slug: "azure" },
      { name: "Vercel", slug: "vercel" },
      { name: "Docker", slug: "docker" },
    ],
  },
  {
    category: "Tools",
    technologies: [
      { name: "Git", slug: "git" },
      { name: "GitHub", slug: "github" },
      { name: "Postman", slug: "postman" },
      { name: "Figma", slug: "figma" },
      { name: "Notion", slug: "notion" },
    ],
  },
] as const satisfies readonly SkillGroup[];
