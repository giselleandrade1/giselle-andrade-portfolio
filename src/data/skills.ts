export type SkillLevel = "principal" | "projetos" | "aprendendo";

export type SkillGroup = {
  id: string;
  title: string;
  icon: "layout" | "server" | "database" | "wrench" | "workflow";
  skills: { name: string; level: SkillLevel }[];
};

/**
 * "principal": listed as core stack on CV/LinkedIn.
 * "projetos": verified in the source code of Giselle's public repositories.
 * "aprendendo": documented as basic knowledge ("noções") or in study.
 */
export const skillLevelLabel: Record<SkillLevel, string> = {
  principal: "Stack principal",
  projetos: "Usado em projetos",
  aprendendo: "Noções / em estudo",
};

export const skillGroups: SkillGroup[] = [
  {
    id: "frontend",
    title: "Desenvolvimento Frontend",
    icon: "layout",
    skills: [
      { name: "HTML5", level: "principal" },
      { name: "CSS3", level: "principal" },
      { name: "JavaScript", level: "principal" },
      { name: "TypeScript", level: "projetos" },
      { name: "React", level: "projetos" },
      { name: "Next.js", level: "projetos" },
      { name: "Tailwind CSS", level: "projetos" },
    ],
  },
  {
    id: "backend",
    title: "Desenvolvimento Backend",
    icon: "server",
    skills: [
      { name: "Node.js", level: "principal" },
      { name: "Java", level: "principal" },
      { name: "Express", level: "projetos" },
      { name: "Spring Boot", level: "projetos" },
      { name: "APIs REST", level: "projetos" },
    ],
  },
  {
    id: "dados",
    title: "Banco de Dados e Dados",
    icon: "database",
    skills: [
      { name: "SQL", level: "principal" },
      { name: "Bancos relacionais", level: "principal" },
      { name: "SQLite", level: "projetos" },
      { name: "PostgreSQL", level: "projetos" },
      { name: "Excel", level: "principal" },
      { name: "Power BI", level: "aprendendo" },
    ],
  },
  {
    id: "ferramentas",
    title: "Ferramentas",
    icon: "wrench",
    skills: [
      { name: "Git", level: "principal" },
      { name: "GitHub", level: "principal" },
      { name: "Vercel", level: "projetos" },
      { name: "Trello", level: "principal" },
      { name: "Notion", level: "principal" },
      { name: "Figma", level: "principal" },
      { name: "Canva", level: "principal" },
    ],
  },
  {
    id: "processos",
    title: "Engenharia e Processos",
    icon: "workflow",
    skills: [
      { name: "Lógica de programação", level: "principal" },
      { name: "Levantamento de requisitos", level: "principal" },
      { name: "Organização de escopo", level: "principal" },
      { name: "Integração de sistemas", level: "projetos" },
      { name: "Resolução de problemas", level: "principal" },
      { name: "Metodologias ágeis", level: "principal" },
      { name: "Automação com bots", level: "principal" },
    ],
  },
];

export const softSkills = [
  "Raciocínio lógico",
  "Organização e gestão de prioridades",
  "Comunicação clara com clientes e equipes",
  "Proatividade e responsabilidade",
  "Adaptabilidade e trabalho em equipe",
  "Cumprimento de prazos",
];
