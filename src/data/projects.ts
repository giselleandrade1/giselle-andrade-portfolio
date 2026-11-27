import bunnyShot from "@/assets/projects/bunny.webp";
import controlShot from "@/assets/projects/control.webp";
import easyScheduleShot from "@/assets/projects/easy-schedule.webp";
import gistenShot from "@/assets/projects/gisten.webp";
import kinvoShot from "@/assets/projects/kinvo.webp";
import lembrafacilShot from "@/assets/projects/lembrafacil.webp";
import venuxShot from "@/assets/projects/venux.webp";

export type ProjectCategory = "Full Stack" | "Frontend" | "Backend" | "Sistemas";

export const projectCategories: ProjectCategory[] = [
  "Full Stack",
  "Frontend",
  "Backend",
  "Sistemas",
];

export type Demo =
  /** Public URL checked with a real browser: renders the app. */
  | { status: "online"; url: string; embeddable: boolean; verifiedAt: string; note?: string }
  /** Official demo URL that did not respond when last checked: keep the link, warn the visitor. */
  | { status: "unavailable"; url: string; checkedAt: string; reason: string }
  /** No working public deployment: never show a Live Demo button. */
  | { status: "offline"; reason: string };

/** Demo URL to link to, when the project has an official deployment. */
export const demoUrl = (demo: Demo): string | null => (demo.status === "offline" ? null : demo.url);

export type Project = {
  slug: string;
  /** Previous slugs that must keep working (redirected to the current slug). */
  aliases?: string[];
  name: string;
  /** Public GitHub repository, or null when the source code is private. */
  repo: string | null;
  tagline: string;
  description: string;
  problem: string;
  categories: ProjectCategory[];
  /** Only technologies found in dependency files or source code. */
  stack: string[];
  features: string[];
  /** Honest notes about scope, demo data or limitations found in the code. */
  notes: string[];
  demo: Demo;
  /** Real screenshot of the running demo (captured from the live URL). */
  image?: string;
  featured: boolean;
};

const repoUrl = (name: string) => `https://github.com/giselleandrade1/${name}`;
const VERIFIED = "2026-11-19";

export const projects: Project[] = [
  {
    slug: "control-consultoria",
    name: "Control Consultoria",
    repo: repoUrl("control-consultoria-website"),
    tagline: "Website institucional de uma consultoria empresarial real.",
    description:
      "Site institucional responsivo para a Control Consultoria, com apresentação de serviços, metodologia, perguntas frequentes e contato direto via WhatsApp.",
    problem:
      "Dar à consultoria uma presença online profissional, onde potenciais clientes entendem os serviços e iniciam o contato com facilidade.",
    categories: ["Frontend"],
    stack: [
      "React 19",
      "TypeScript",
      "TanStack Start",
      "Vite",
      "Tailwind CSS 4",
      "Radix UI",
      "Vitest",
    ],
    features: [
      "Seções de serviços, metodologia, números, FAQ e contato",
      "Formulário validado que gera mensagem pronta para o WhatsApp",
      "Lógica de diagnóstico para orientar o visitante entre os serviços",
      "Tema claro e escuro",
      "Testes automatizados de rotas, formulário e regras do site",
    ],
    notes: ["O contato é feito pelo WhatsApp; o site não armazena mensagens."],
    demo: {
      status: "online",
      url: "https://control-consultoria-website.vercel.app",
      embeddable: true,
      verifiedAt: VERIFIED,
    },
    image: controlShot,
    featured: true,
  },
  {
    slug: "easy-schedule-java",
    aliases: ["easy-schedule"],
    name: "EasySchedule",
    repo: null,
    tagline: "Sistema de agendamentos em Java com Spring Boot.",
    description:
      "Aplicação web em Java para gestão de clientes, profissionais, serviços, disponibilidade e agendamentos, com área administrativa e área do cliente.",
    problem:
      "Centralizar o agendamento e a administração do dia a dia de negócios de serviços, aplicando regras de negócio estruturadas.",
    categories: ["Full Stack", "Backend", "Sistemas"],
    stack: [
      "Java 21",
      "Spring Boot 3.5",
      "Spring Security",
      "Spring Data JPA",
      "Thymeleaf",
      "Flyway",
      "MySQL / PostgreSQL",
      "Maven",
    ],
    features: [
      "Cadastro de clientes, profissionais e serviços",
      "Disponibilidade de profissionais e agendamentos com regras de negócio",
      "Atualização de status e pagamento dos agendamentos",
      "Painel administrativo, páginas financeiras e relatórios",
      "Acesso separado para administrador e cliente, senhas com BCrypt e proteção CSRF",
      "Testes de serviço com JUnit",
    ],
    notes: ["O código-fonte está em um repositório privado no GitHub."],
    demo: {
      status: "online",
      url: "https://easy-schedule-java.fly.dev/login",
      // The app sends X-Frame-Options: DENY, so it cannot be previewed inside the portfolio.
      embeddable: false,
      verifiedAt: "2026-11-22",
    },
    image: easyScheduleShot,
    featured: true,
  },
  {
    slug: "bunny-bites",
    name: "Bunny Bites",
    repo: repoUrl("bunny-bites_ecommerce"),
    tagline: "E-commerce de chocolates com API própria em Node.js.",
    description:
      "Loja virtual de chocolates e presentes de Páscoa com catálogo, detalhes de produto, conta de usuário, carrinho, lista de desejos e finalização de pedido.",
    problem:
      "Oferecer uma vitrine online onde clientes descobrem produtos e montam pedidos vinculados à própria conta.",
    categories: ["Full Stack"],
    stack: [
      "HTML",
      "CSS",
      "JavaScript",
      "Node.js",
      "Express",
      "JWT",
      "bcrypt",
      "SQLite",
      "PostgreSQL",
    ],
    features: [
      "Catálogo e página de detalhes de produtos",
      "Cadastro, login e logout com JWT e senhas criptografadas",
      "CAPTCHA no fluxo de autenticação",
      "Carrinho e lista de desejos autenticados",
      "Checkout que registra o pedido no banco de dados",
    ],
    notes: ["Projeto de demonstração: o checkout registra o pedido, mas não processa pagamento."],
    demo: {
      status: "online",
      url: "https://bunny-bites-app.vercel.app",
      embeddable: true,
      verifiedAt: VERIFIED,
    },
    image: bunnyShot,
    featured: true,
  },
  {
    slug: "venux-bijoux",
    name: "Venux Bijoux",
    repo: repoUrl("venux-bijoux-ecommerce"),
    tagline: "E-commerce de bijuterias com Next.js e rotas de API.",
    description:
      "Loja de bijuterias com catálogo, autenticação, carrinho, lista de desejos, cálculo de frete e pedidos, construída com Next.js e rotas de API próprias.",
    problem:
      "Permitir que clientes naveguem por coleções, salvem favoritos e enviem pedidos em uma experiência de compra delicada e responsiva.",
    categories: ["Full Stack"],
    stack: ["Next.js 16", "React 19", "JavaScript", "CSS", "Next.js API Routes"],
    features: [
      "Catálogo e detalhes de produtos servidos por API",
      "Cadastro, login e recuperação de senha",
      "Carrinho, lista de desejos e totais com frete",
      "Pedidos autenticados",
      "Preferência de tema e formulário de contato",
    ],
    notes: [
      "Os dados ficam em memória no servidor: contas e pedidos não são permanentes.",
      "O pedido é registrado sem cobrança: não há integração de pagamento.",
    ],
    demo: {
      status: "online",
      url: "https://venuxbijoux-app.vercel.app",
      embeddable: true,
      verifiedAt: VERIFIED,
    },
    image: venuxShot,
    featured: false,
  },
  {
    slug: "gistenlixt",
    name: "GistenLixt",
    repo: repoUrl("gistenlixt-finance_app"),
    tagline: "Autenticação e cadastro de clientes empresariais.",
    description:
      "Aplicação Next.js com autenticação e cadastro de clientes empresariais, armazenando razão social, CNPJ, contato, regime tributário, localização e faturamento anual.",
    problem:
      "Organizar o cadastro de empresas clientes com dados fiscais brasileiros em um painel com acesso autenticado.",
    categories: ["Full Stack", "Sistemas"],
    stack: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS 4", "SQLite", "bcrypt", "Jest"],
    features: [
      "Cadastro, login, logout e sessão do usuário",
      "Criação e listagem de clientes com dados fiscais",
      "Senhas protegidas com bcrypt",
      "Opção de acesso sem login para demonstração",
      "Testes de interface com Jest e Testing Library",
    ],
    notes: [
      "Os números exibidos no painel são ilustrativos; não são calculados a partir dos dados.",
    ],
    demo: {
      status: "online",
      url: "https://gisten-lixt.vercel.app/",
      embeddable: true,
      verifiedAt: VERIFIED,
      note: "Use “Acessar GistenLixt agora” para entrar sem criar conta.",
    },
    image: gistenShot,
    featured: false,
  },
  {
    slug: "lembrafacil",
    name: "LembraFácil",
    repo: repoUrl("lembrafacil-task-manager"),
    tagline: "Gerenciador de tarefas offline, com motor de priorização em Java.",
    description:
      "Gerenciador de tarefas acessível que funciona offline no navegador, com visões de hoje, tarefas, planejamento e analytics, além de um serviço Java separado para priorização e caminho crítico.",
    problem:
      "Ajudar a organizar tarefas, prioridades e cronogramas de projetos, inclusive sem internet.",
    categories: ["Frontend", "Sistemas"],
    stack: [
      "JavaScript (ES Modules)",
      "HTML",
      "CSS",
      "IndexedDB",
      "Service Worker (PWA)",
      "Java 17",
      "JUnit 5",
    ],
    features: [
      "Tarefas salvas no próprio dispositivo com IndexedDB",
      "Funcionamento offline como PWA",
      "Visões Hoje, Tarefas, Planejamento, Analytics e Configurações",
      "Motor Java de prioridade e de caminho crítico (serviço separado)",
      "Testes de frontend e testes Java",
    ],
    notes: [
      "A versão publicada é o frontend; o serviço Java roda separadamente e não está conectado à demo.",
    ],
    demo: {
      status: "online",
      url: "https://lembrafacil-task-manager.vercel.app/",
      embeddable: false,
      verifiedAt: VERIFIED,
    },
    image: lembrafacilShot,
    featured: false,
  },
  {
    slug: "kinvo-renda-fixa",
    name: "Kinvo — Renda Fixa",
    repo: repoUrl("kinvo-frontend-challenge"),
    tagline: "Desafio frontend com React, TypeScript e consumo de API.",
    description:
      "Interface para consultar produtos de renda fixa a partir de uma API, com indicadores de rentabilidade, busca, ordenação e paginação.",
    problem: "Facilitar a análise de uma carteira de renda fixa com filtros e ordenação claros.",
    categories: ["Frontend"],
    stack: ["React 19", "TypeScript", "styled-components", "Axios", "Vite"],
    features: [
      "Consumo e transformação de dados de API",
      "Busca por nome ou tipo de título",
      "Ordenação por nome, vencimento ou rentabilidade",
      "Paginação com estados de carregamento e erro",
    ],
    notes: [],
    demo: {
      status: "online",
      url: "https://kinvofrontendtest.vercel.app/",
      embeddable: true,
      verifiedAt: VERIFIED,
    },
    image: kinvoShot,
    featured: false,
  },
  {
    slug: "noctora-vault-challenge",
    aliases: ["noctora-vault"],
    name: "Noctora Vault",
    repo: repoUrl("noctora-vault-challenge"),
    tagline: "Catálogo de filmes com API de recomendações em Express.",
    description:
      "Biblioteca de filmes com busca, categorias, franquias, sagas, navegação alfabética, destaques e recomendações por similaridade, servida por uma API Node.js.",
    problem: "Ajudar a encontrar filmes relacionados, franquias e sagas em um catálogo organizado.",
    categories: ["Full Stack", "Backend"],
    stack: ["Node.js", "Express 5", "JavaScript", "HTML", "CSS"],
    features: [
      "API REST com listagem, detalhes, busca e categorias",
      "Filtros, paginação e recomendações por gênero, temas e franquia",
      "Favoritos salvos no navegador",
    ],
    notes: ["O catálogo é armazenado em arquivo JSON local, sem banco de dados."],
    demo: {
      status: "unavailable",
      url: "https://noctora-vault-challenge.vercel.app",
      checkedAt: "2026-11-22",
      reason:
        "Na última verificação (22/11/2026) o endereço oficial da demo respondeu “404 — NOT_FOUND” na Vercel. O link foi mantido e volta a funcionar assim que a implantação for reativada.",
    },
    featured: false,
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);

/** Finds a project by its current slug or by one of its previous slugs. */
export const findProject = (slug: string) =>
  projects.find((p) => p.slug === slug || p.aliases?.includes(slug));

/** Every technology used across projects, most frequent first (for filters). */
export const projectTechnologies = (() => {
  const counts = new Map<string, number>();
  for (const p of projects)
    for (const t of p.stack) {
      const key = techKey(t);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  return [...counts.entries()]
    .filter(([, n]) => n > 1)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([t]) => t);
})();

/** Normalises "React 19" / "Next.js 16" to their family name so filters group versions. */
export function techKey(tech: string): string {
  return tech
    .replace(/\s+\d+(\.\d+)*$/, "")
    .replace(/\s*\(.*\)$/, "")
    .trim();
}
