export type Experience = {
  id: string;
  company: string;
  role: string;
  /** Human-readable period exactly as documented (pt-BR). */
  period: string;
  start: string; // YYYY-MM
  end: string | null; // null = atual
  location: string;
  kind: "tecnologia" | "administrativo" | "outros";
  summary: string;
  highlights: string[];
  tags: string[];
};

/** Main timeline, ordered by relevance for tech roles. Source: LinkedIn + CV. */
export const experiences: Experience[] = [
  {
    id: "control-dev",
    company: "Control Consultoria",
    role: "Desenvolvedora Web",
    period: "jan/2026 – atual",
    start: "2026-01",
    end: null,
    location: "São Paulo, SP",
    kind: "tecnologia",
    summary:
      "Desenvolvimento e evolução do website institucional da empresa, com foco em responsividade, acessibilidade, desempenho e experiência do usuário.",
    highlights: [
      "Implementação de tema claro e escuro, menu responsivo, FAQ interativo, animações e recursos de navegação.",
      "Validação de formulários com integração ao WhatsApp.",
      "Aplicação de HTML semântico, acessibilidade, boas práticas de SEO e versionamento com Git e GitHub.",
    ],
    tags: ["HTML5", "CSS3", "JavaScript", "SEO", "Acessibilidade", "Git"],
  },
  {
    id: "workana-dev",
    company: "Workana",
    role: "Desenvolvedora Web Freelancer",
    period: "jul/2024 – atual",
    start: "2024-07",
    end: null,
    location: "Remoto",
    kind: "tecnologia",
    summary:
      "Desenvolvimento de sites responsivos, do levantamento de requisitos e entendimento das necessidades dos clientes até a organização e entrega dos projetos.",
    highlights: [
      "Levantamento de requisitos e comunicação direta com clientes em todas as etapas.",
      "Organização de cronogramas, prazos e entregas.",
      "Versionamento de código com Git e GitHub, aplicando lógica de programação e resolução de problemas.",
    ],
    tags: ["HTML", "CSS", "JavaScript", "Requisitos", "Git"],
  },
  {
    id: "actionline-dp",
    company: "Actionline",
    role: "Aprendiz de Departamento Pessoal",
    period: "mai/2026 – atual",
    start: "2026-05",
    end: null,
    location: "São Paulo, SP",
    kind: "administrativo",
    summary:
      "Suporte às rotinas de Departamento Pessoal, com organização, conferência e atualização de documentos e informações.",
    highlights: [
      "Apoio aos processos administrativos internos da área.",
      "Tratamento responsável e confidencial de informações corporativas.",
      "Cumprimento de procedimentos com organização e atenção aos detalhes.",
    ],
    tags: ["Processos", "Confidencialidade", "Ferramentas digitais"],
  },
  {
    id: "control-adm",
    company: "Control Consultoria",
    role: "Analista Administrativo Jr",
    period: "jul/2025 – jul/2026",
    start: "2025-07",
    end: "2026-07",
    location: "São Paulo, SP",
    kind: "administrativo",
    summary:
      "Apoio a recrutamento e seleção e elaboração de planilhas, relatórios e indicadores para acompanhamento de processos internos.",
    highlights: [
      "Triagem e análise de currículos, contato e agendamento de candidatos.",
      "Organização de documentação admissional e acompanhamento de onboarding.",
      "Elaboração e atualização de planilhas, relatórios e indicadores em Excel e sistemas corporativos.",
    ],
    tags: ["Recrutamento", "Excel", "Relatórios", "Indicadores"],
  },
];

/** Other documented experiences, shown in an expandable section. Source: LinkedIn. */
export const otherExperiences: Experience[] = [
  {
    id: "discord-cm",
    company: "Discord",
    role: "Community Manager",
    period: "set/2016 – atual",
    start: "2016-09",
    end: null,
    location: "Remoto",
    kind: "outros",
    summary:
      "Criação, estruturação e administração de comunidades digitais: servidores, canais, cargos, permissões, hierarquias e automações com bots.",
    highlights: [
      "Moderação, definição de regras e processos e suporte aos usuários.",
      "Organização de equipes de staff e acompanhamento do funcionamento dos servidores.",
    ],
    tags: ["Automação com bots", "Gestão de comunidade"],
  },
  {
    id: "workana-adm",
    company: "Workana",
    role: "Assistente Administrativo Virtual",
    period: "jan/2024 – atual",
    start: "2024-01",
    end: null,
    location: "Remoto",
    kind: "outros",
    summary:
      "Suporte remoto a rotinas administrativas, organização de documentos e estruturação de fluxos de trabalho com Trello e Notion.",
    highlights: ["Acompanhamento de demandas, prazos e eficiência das rotinas."],
    tags: ["Trello", "Notion"],
  },
  {
    id: "freelancer-social",
    company: "Freelancer",
    role: "Redatora e Social Media",
    period: "jul/2023 – jan/2026",
    start: "2023-07",
    end: "2026-01",
    location: "Remoto",
    kind: "outros",
    summary:
      "Planejamento de conteúdos para redes sociais, textos institucionais, gerenciamento de publicações e acompanhamento de métricas básicas.",
    highlights: [],
    tags: ["Conteúdo", "Comunicação"],
  },
  {
    id: "oticas-carol",
    company: "Óticas Carol",
    role: "Auxiliar de Vendas",
    period: "mar/2025 – jul/2025",
    start: "2025-03",
    end: "2025-07",
    location: "São Paulo, SP",
    kind: "outros",
    summary:
      "Atendimento ao cliente e pós-venda, controle de caixa, organização de documentos fiscais e apoio à gestão de estoque.",
    highlights: [],
    tags: ["Atendimento", "Estoque"],
  },
];
