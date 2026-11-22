export type Status = "Em andamento" | "Concluído";

export type Education = {
  id: string;
  institution: string;
  course: string;
  level: string;
  period: string;
  status: Status;
};

/** Source: LinkedIn + CV (ETEC appears only in the CV, marked as concluded there). */
export const education: Education[] = [
  {
    id: "usjt-cc",
    institution: "Universidade São Judas Tadeu",
    course: "Ciência da Computação",
    level: "Bacharelado",
    period: "ago/2026 – dez/2030",
    status: "Em andamento",
  },
  {
    id: "ung-ads",
    institution: "Universidade UNG",
    course: "Análise e Desenvolvimento de Sistemas",
    level: "Tecnólogo (CST)",
    period: "out/2024 – dez/2026",
    status: "Em andamento",
  },
  {
    id: "senac-tds",
    institution: "Senac RS",
    course: "Técnico em Desenvolvimento de Sistemas",
    level: "Técnico",
    period: "jun/2026 – jun/2028",
    status: "Em andamento",
  },
  {
    id: "senac-rh",
    institution: "Senac RS",
    course: "Técnico em Recursos Humanos",
    level: "Técnico",
    period: "ago/2026 – ago/2028",
    status: "Em andamento",
  },
  {
    id: "etec-adm",
    institution: "ETEC Prof. Horácio Augusto da Silveira",
    course: "Técnico em Administração",
    level: "Técnico",
    period: "fev/2023 – jul/2024",
    status: "Concluído",
  },
];

export type Course = {
  id: string;
  title: string;
  institution: string;
  hours: string;
  year: string;
  status: Status;
  area: "tecnologia" | "dados" | "gestao";
};

/** Source: CV. IFRS year confirmed by Giselle as 2025. Google certificate confirmed in progress. */
export const courses: Course[] = [
  {
    id: "ifrs-web",
    title: "Programador Web",
    institution: "IFRS",
    hours: "200h",
    year: "2025",
    status: "Concluído",
    area: "tecnologia",
  },
  {
    id: "ifrs-dba",
    title: "Administrador de Banco de Dados",
    institution: "IFRS",
    hours: "200h",
    year: "2025",
    status: "Concluído",
    area: "tecnologia",
  },
  {
    id: "google-data",
    title: "Análise de Dados",
    institution: "Google Career Certificates",
    hours: "180h de 200h",
    year: "2026",
    status: "Em andamento",
    area: "dados",
  },
  {
    id: "bradesco-office",
    title: "Pacote Office 2016",
    institution: "Fundação Bradesco",
    hours: "110h",
    year: "2026",
    status: "Concluído",
    area: "gestao",
  },
  {
    id: "ifrs-adm",
    title: "Assistente Administrativo",
    institution: "IFRS",
    hours: "200h",
    year: "2025",
    status: "Concluído",
    area: "gestao",
  },
  {
    id: "ifrs-rh",
    title: "Assistente de RH",
    institution: "IFRS",
    hours: "200h",
    year: "2025",
    status: "Concluído",
    area: "gestao",
  },
  {
    id: "simplifica-excel",
    title: "Excel Express",
    institution: "Simplifica Treinamentos",
    hours: "10h",
    year: "2023",
    status: "Concluído",
    area: "dados",
  },
  {
    id: "simplifica-powerbi",
    title: "Power BI Express",
    institution: "Simplifica Treinamentos",
    hours: "10h",
    year: "2024",
    status: "Concluído",
    area: "dados",
  },
  {
    id: "simplifica-pbi-excel",
    title: "Power BI & Excel Express",
    institution: "Simplifica Treinamentos",
    hours: "10h",
    year: "2024",
    status: "Concluído",
    area: "dados",
  },
];
