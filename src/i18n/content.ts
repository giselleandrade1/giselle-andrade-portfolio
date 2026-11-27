import { courses, education, type Course, type Education, type Status } from "@/data/education";
import { experiences, otherExperiences, type Experience } from "@/data/experience";
import { languages, profile, type Language } from "@/data/profile";
import { projects, type Project } from "@/data/projects";
import {
  skillGroups,
  skillLevelLabel,
  softSkills,
  type SkillGroup,
  type SkillLevel,
} from "@/data/skills";

import type { Locale } from "./config";

type Foreign = Exclude<Locale, "pt-BR">;

/* ---------- Generic terms (tags, skill names, statuses, language levels) ---------- */

const terms: Record<Foreign, Record<string, string>> = {
  en: {
    Acessibilidade: "Accessibility",
    Requisitos: "Requirements",
    Processos: "Processes",
    Confidencialidade: "Confidentiality",
    "Ferramentas digitais": "Digital tools",
    Recrutamento: "Recruitment",
    Relatórios: "Reports",
    Indicadores: "KPIs",
    "Automação com bots": "Bot automation",
    "Gestão de comunidade": "Community management",
    Conteúdo: "Content",
    Comunicação: "Communication",
    Atendimento: "Customer service",
    Estoque: "Inventory",
    "APIs REST": "REST APIs",
    "Bancos relacionais": "Relational databases",
    "Lógica de programação": "Programming logic",
    "Levantamento de requisitos": "Requirements gathering",
    "Organização de escopo": "Scope organisation",
    "Integração de sistemas": "Systems integration",
    "Resolução de problemas": "Problem solving",
    "Metodologias ágeis": "Agile methodologies",
    "Em andamento": "In progress",
    Concluído: "Completed",
    Português: "Portuguese",
    Inglês: "English",
    Espanhol: "Spanish",
    Nativo: "Native",
    Profissional: "Professional",
    Iniciante: "Beginner",
    Remoto: "Remote",
  },
  es: {
    Acessibilidade: "Accesibilidad",
    Requisitos: "Requisitos",
    Processos: "Procesos",
    Confidencialidade: "Confidencialidad",
    "Ferramentas digitais": "Herramientas digitales",
    Recrutamento: "Reclutamiento",
    Relatórios: "Informes",
    Indicadores: "Indicadores",
    "Automação com bots": "Automatización con bots",
    "Gestão de comunidade": "Gestión de comunidades",
    Conteúdo: "Contenido",
    Comunicação: "Comunicación",
    Atendimento: "Atención al cliente",
    Estoque: "Inventario",
    "APIs REST": "APIs REST",
    "Bancos relacionais": "Bases de datos relacionales",
    "Lógica de programação": "Lógica de programación",
    "Levantamento de requisitos": "Levantamiento de requisitos",
    "Organização de escopo": "Organización del alcance",
    "Integração de sistemas": "Integración de sistemas",
    "Resolução de problemas": "Resolución de problemas",
    "Metodologias ágeis": "Metodologías ágiles",
    "Em andamento": "En curso",
    Concluído: "Completado",
    Português: "Portugués",
    Inglês: "Inglés",
    Espanhol: "Español",
    Nativo: "Nativo",
    Profissional: "Profesional",
    Iniciante: "Principiante",
    Remoto: "Remoto",
  },
};

export function term(value: string, locale: Locale): string {
  return locale === "pt-BR" ? value : (terms[locale][value] ?? value);
}

/* ---------- Periods ("jan/2026 – atual") ---------- */

const PT_MONTHS = [
  "jan",
  "fev",
  "mar",
  "abr",
  "mai",
  "jun",
  "jul",
  "ago",
  "set",
  "out",
  "nov",
  "dez",
];
const MONTHS: Record<Foreign, string[]> = {
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  es: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"],
};
const PRESENT: Record<Foreign, string> = { en: "Present", es: "actualidad" };

export function translatePeriod(period: string, locale: Locale): string {
  if (locale === "pt-BR") return period;
  return period
    .replace(/\b([a-z]{3})\/(\d{4})\b/g, (whole, m: string, y: string) => {
      const i = PT_MONTHS.indexOf(m);
      return i === -1 ? whole : `${MONTHS[locale][i]} ${y}`;
    })
    .replace(/\batual\b/, PRESENT[locale]);
}

/* ---------- Profile ---------- */

type ProfileText = Record<"role" | "availability" | "intro" | "workModes" | "academic", string> & {
  lookingFor: readonly string[];
};

const profileText: Record<Foreign, ProfileText> = {
  en: {
    role: "Junior Full Stack Developer",
    availability: "Open to internships and junior roles",
    intro:
      "I'm a Computer Science and Systems Analysis and Development student with hands-on experience building web applications and digital solutions. I'm interested in Full Stack and backend development, systems architecture and solving problems through technology.",
    workModes: "Remote, hybrid or on-site",
    academic: "Computer Science · Systems Analysis and Development",
    lookingFor: [
      "IT Internship",
      "Junior Full Stack Developer",
      "Junior Back-end Developer",
      "Junior Front-end Developer",
      "Junior Systems Analyst",
    ],
  },
  es: {
    role: "Desarrolladora Full Stack Junior",
    availability: "Disponible para prácticas y puestos junior",
    intro:
      "Soy estudiante de Ciencias de la Computación y de Análisis y Desarrollo de Sistemas, con experiencia práctica en el desarrollo de aplicaciones web y soluciones digitales. Me interesan el desarrollo Full Stack y backend, la arquitectura de sistemas y la resolución de problemas a través de la tecnología.",
    workModes: "Remoto, híbrido o presencial",
    academic: "Ciencias de la Computación · Análisis y Desarrollo de Sistemas",
    lookingFor: [
      "Prácticas en Tecnologías de la Información",
      "Desarrolladora Full Stack Junior",
      "Desarrolladora Back-end Junior",
      "Desarrolladora Front-end Junior",
      "Analista de Sistemas Junior",
    ],
  },
};

/* ---------- Projects ---------- */

type ProjectText = Pick<Project, "tagline" | "description" | "problem" | "features" | "notes"> & {
  demoReason?: string;
  demoNote?: string;
};

const projectText: Record<Foreign, Record<string, ProjectText>> = {
  en: {
    "control-consultoria": {
      tagline: "Corporate website for a real business consultancy.",
      description:
        "Responsive corporate website for Control Consultoria, presenting its services, methodology and FAQ, with direct contact through WhatsApp.",
      problem:
        "Give the consultancy a professional online presence where potential clients understand the services and start a conversation easily.",
      features: [
        "Services, methodology, figures, FAQ and contact sections",
        "Validated form that builds a ready-to-send WhatsApp message",
        "Diagnostic logic that guides visitors to the right service",
        "Light and dark themes",
        "Automated tests for routes, form and site rules",
      ],
      notes: ["Contact happens through WhatsApp; the site does not store messages."],
    },
    "easy-schedule-java": {
      tagline: "Scheduling system in Java with Spring Boot.",
      description:
        "Java web application to manage clients, professionals, services, availability and appointments, with an admin area and a client area.",
      problem:
        "Centralise scheduling and day-to-day administration for service businesses, applying structured business rules.",
      features: [
        "Registration of clients, professionals and services",
        "Professional availability and appointments with business rules",
        "Appointment status and payment updates",
        "Admin dashboard, financial pages and reports",
        "Separate access for admins and clients, BCrypt passwords and CSRF protection",
        "Service tests with JUnit",
      ],
      notes: ["The source code is in a private GitHub repository."],
    },
    "bunny-bites": {
      tagline: "Chocolate e-commerce with its own Node.js API.",
      description:
        "Online store for chocolates and Easter gifts with catalogue, product details, user account, cart, wishlist and checkout.",
      problem:
        "Offer an online storefront where customers discover products and place orders linked to their own account.",
      features: [
        "Catalogue and product detail pages",
        "Sign-up, login and logout with JWT and encrypted passwords",
        "CAPTCHA in the authentication flow",
        "Authenticated cart and wishlist",
        "Checkout that records the order in the database",
      ],
      notes: ["Demo project: checkout records the order but does not process payment."],
    },
    "venux-bijoux": {
      tagline: "Jewellery e-commerce with Next.js and API routes.",
      description:
        "Jewellery store with catalogue, authentication, cart, wishlist, shipping calculation and orders, built with Next.js and its own API routes.",
      problem:
        "Let customers browse collections, save favourites and place orders in a delicate, responsive shopping experience.",
      features: [
        "Catalogue and product details served by an API",
        "Sign-up, login and password recovery",
        "Cart, wishlist and totals with shipping",
        "Authenticated orders",
        "Theme preference and contact form",
      ],
      notes: [
        "Data is kept in server memory: accounts and orders are not permanent.",
        "Orders are recorded without charging: there is no payment integration.",
      ],
    },
    gistenlixt: {
      tagline: "Authentication and registration of business clients.",
      description:
        "Next.js application with authentication and registration of business clients, storing company name, CNPJ, contact, tax regime, location and annual revenue.",
      problem:
        "Organise the registration of client companies with Brazilian tax data in a dashboard with authenticated access.",
      features: [
        "Sign-up, login, logout and user session",
        "Creation and listing of clients with tax data",
        "Passwords protected with bcrypt",
        "Guest access option for demonstration",
        "Interface tests with Jest and Testing Library",
      ],
      notes: [
        "The figures shown on the dashboard are illustrative; they are not calculated from the data.",
      ],
      demoNote: "Use “Acessar GistenLixt agora” to sign in without creating an account.",
    },
    lembrafacil: {
      tagline: "Offline task manager with a prioritisation engine in Java.",
      description:
        "Accessible task manager that works offline in the browser, with Today, Tasks, Planning and Analytics views, plus a separate Java service for prioritisation and critical path.",
      problem: "Help organise tasks, priorities and project schedules, even without internet.",
      features: [
        "Tasks saved on the device with IndexedDB",
        "Works offline as a PWA",
        "Today, Tasks, Planning, Analytics and Settings views",
        "Java engine for priority and critical path (separate service)",
        "Frontend tests and Java tests",
      ],
      notes: [
        "The published version is the frontend; the Java service runs separately and is not connected to the demo.",
      ],
    },
    "kinvo-renda-fixa": {
      tagline: "Frontend challenge with React, TypeScript and API consumption.",
      description:
        "Interface to browse fixed-income products from an API, with return indicators, search, sorting and pagination.",
      problem: "Make it easier to analyse a fixed-income portfolio with clear filters and sorting.",
      features: [
        "API data consumption and transformation",
        "Search by name or bond type",
        "Sorting by name, maturity or return",
        "Pagination with loading and error states",
      ],
      notes: [],
    },
    "noctora-vault-challenge": {
      tagline: "Movie catalogue with a recommendations API in Express.",
      description:
        "Movie library with search, categories, franchises, sagas, alphabetical browsing, highlights and similarity-based recommendations, served by a Node.js API.",
      problem: "Help people find related movies, franchises and sagas in an organised catalogue.",
      features: [
        "REST API with listing, details, search and categories",
        "Filters, pagination and recommendations by genre, themes and franchise",
        "Favourites saved in the browser",
      ],
      notes: ["The catalogue is stored in a local JSON file, without a database."],
      demoReason:
        "At the last check (11/22/2026) the official demo address returned “404 — NOT_FOUND” on Vercel. The link is kept and will work again as soon as the deployment is reactivated.",
    },
  },
  es: {
    "control-consultoria": {
      tagline: "Sitio institucional de una consultora empresarial real.",
      description:
        "Sitio institucional responsivo para Control Consultoria, con presentación de servicios, metodología, preguntas frecuentes y contacto directo por WhatsApp.",
      problem:
        "Dar a la consultora una presencia online profesional, donde los potenciales clientes entienden los servicios e inician el contacto con facilidad.",
      features: [
        "Secciones de servicios, metodología, cifras, FAQ y contacto",
        "Formulario validado que genera un mensaje listo para WhatsApp",
        "Lógica de diagnóstico que orienta al visitante entre los servicios",
        "Tema claro y oscuro",
        "Pruebas automatizadas de rutas, formulario y reglas del sitio",
      ],
      notes: ["El contacto se hace por WhatsApp; el sitio no almacena mensajes."],
    },
    "easy-schedule-java": {
      tagline: "Sistema de citas en Java con Spring Boot.",
      description:
        "Aplicación web en Java para gestionar clientes, profesionales, servicios, disponibilidad y citas, con área administrativa y área del cliente.",
      problem:
        "Centralizar las citas y la administración diaria de negocios de servicios, aplicando reglas de negocio estructuradas.",
      features: [
        "Registro de clientes, profesionales y servicios",
        "Disponibilidad de profesionales y citas con reglas de negocio",
        "Actualización del estado y del pago de las citas",
        "Panel administrativo, páginas financieras e informes",
        "Acceso separado para administrador y cliente, contraseñas con BCrypt y protección CSRF",
        "Pruebas de servicio con JUnit",
      ],
      notes: ["El código fuente está en un repositorio privado de GitHub."],
    },
    "bunny-bites": {
      tagline: "E-commerce de chocolates con API propia en Node.js.",
      description:
        "Tienda online de chocolates y regalos de Pascua con catálogo, detalles de producto, cuenta de usuario, carrito, lista de deseos y finalización del pedido.",
      problem:
        "Ofrecer un escaparate online donde los clientes descubren productos y arman pedidos vinculados a su propia cuenta.",
      features: [
        "Catálogo y página de detalles de productos",
        "Registro, inicio y cierre de sesión con JWT y contraseñas cifradas",
        "CAPTCHA en el flujo de autenticación",
        "Carrito y lista de deseos autenticados",
        "Checkout que registra el pedido en la base de datos",
      ],
      notes: ["Proyecto de demostración: el checkout registra el pedido, pero no procesa pagos."],
    },
    "venux-bijoux": {
      tagline: "E-commerce de bisutería con Next.js y rutas de API.",
      description:
        "Tienda de bisutería con catálogo, autenticación, carrito, lista de deseos, cálculo de envío y pedidos, construida con Next.js y rutas de API propias.",
      problem:
        "Permitir que los clientes recorran colecciones, guarden favoritos y envíen pedidos en una experiencia de compra delicada y responsiva.",
      features: [
        "Catálogo y detalles de productos servidos por API",
        "Registro, inicio de sesión y recuperación de contraseña",
        "Carrito, lista de deseos y totales con envío",
        "Pedidos autenticados",
        "Preferencia de tema y formulario de contacto",
      ],
      notes: [
        "Los datos se guardan en la memoria del servidor: cuentas y pedidos no son permanentes.",
        "El pedido se registra sin cobro: no hay integración de pagos.",
      ],
    },
    gistenlixt: {
      tagline: "Autenticación y registro de clientes empresariales.",
      description:
        "Aplicación Next.js con autenticación y registro de clientes empresariales, que almacena razón social, CNPJ, contacto, régimen tributario, ubicación y facturación anual.",
      problem:
        "Organizar el registro de empresas clientes con datos fiscales brasileños en un panel con acceso autenticado.",
      features: [
        "Registro, inicio y cierre de sesión y sesión de usuario",
        "Creación y listado de clientes con datos fiscales",
        "Contraseñas protegidas con bcrypt",
        "Opción de acceso sin registro para demostración",
        "Pruebas de interfaz con Jest y Testing Library",
      ],
      notes: ["Las cifras del panel son ilustrativas; no se calculan a partir de los datos."],
      demoNote: "Usa “Acessar GistenLixt agora” para entrar sin crear una cuenta.",
    },
    lembrafacil: {
      tagline: "Gestor de tareas offline, con motor de priorización en Java.",
      description:
        "Gestor de tareas accesible que funciona sin conexión en el navegador, con vistas de hoy, tareas, planificación y analytics, además de un servicio Java aparte para priorización y ruta crítica.",
      problem:
        "Ayudar a organizar tareas, prioridades y cronogramas de proyectos, incluso sin internet.",
      features: [
        "Tareas guardadas en el propio dispositivo con IndexedDB",
        "Funcionamiento offline como PWA",
        "Vistas Hoy, Tareas, Planificación, Analytics y Configuración",
        "Motor Java de prioridad y de ruta crítica (servicio aparte)",
        "Pruebas de frontend y pruebas Java",
      ],
      notes: [
        "La versión publicada es el frontend; el servicio Java se ejecuta por separado y no está conectado a la demo.",
      ],
    },
    "kinvo-renda-fixa": {
      tagline: "Desafío frontend con React, TypeScript y consumo de API.",
      description:
        "Interfaz para consultar productos de renta fija a partir de una API, con indicadores de rentabilidad, búsqueda, ordenación y paginación.",
      problem:
        "Facilitar el análisis de una cartera de renta fija con filtros y ordenación claros.",
      features: [
        "Consumo y transformación de datos de API",
        "Búsqueda por nombre o tipo de título",
        "Ordenación por nombre, vencimiento o rentabilidad",
        "Paginación con estados de carga y error",
      ],
      notes: [],
    },
    "noctora-vault-challenge": {
      tagline: "Catálogo de películas con API de recomendaciones en Express.",
      description:
        "Biblioteca de películas con búsqueda, categorías, franquicias, sagas, navegación alfabética, destacados y recomendaciones por similitud, servida por una API Node.js.",
      problem:
        "Ayudar a encontrar películas relacionadas, franquicias y sagas en un catálogo organizado.",
      features: [
        "API REST con listado, detalles, búsqueda y categorías",
        "Filtros, paginación y recomendaciones por género, temas y franquicia",
        "Favoritos guardados en el navegador",
      ],
      notes: ["El catálogo se almacena en un archivo JSON local, sin base de datos."],
      demoReason:
        "En la última verificación (22/11/2026) la dirección oficial de la demo respondió “404 — NOT_FOUND” en Vercel. El enlace se mantiene y volverá a funcionar en cuanto se reactive el despliegue.",
    },
  },
};

function localizeProject(p: Project, locale: Locale): Project {
  if (locale === "pt-BR") return p;
  const t = projectText[locale][p.slug];
  if (!t) return p;
  const demo =
    p.demo.status === "unavailable" && t.demoReason
      ? { ...p.demo, reason: t.demoReason }
      : p.demo.status === "online" && t.demoNote
        ? { ...p.demo, note: t.demoNote }
        : p.demo;
  return {
    ...p,
    tagline: t.tagline,
    description: t.description,
    problem: t.problem,
    features: t.features,
    notes: t.notes,
    demo,
  };
}

/* ---------- Experience ---------- */

type ExperienceText = Pick<Experience, "role" | "summary" | "highlights">;

const experienceText: Record<Foreign, Record<string, ExperienceText>> = {
  en: {
    "control-dev": {
      role: "Web Developer",
      summary:
        "Development and evolution of the company's corporate website, focusing on responsiveness, accessibility, performance and user experience.",
      highlights: [
        "Implemented light and dark themes, a responsive menu, an interactive FAQ, animations and navigation features.",
        "Form validation with WhatsApp integration.",
        "Semantic HTML, accessibility, SEO best practices and version control with Git and GitHub.",
      ],
    },
    "workana-dev": {
      role: "Freelance Web Developer",
      summary:
        "Development of responsive websites, from requirements gathering and understanding client needs to organising and delivering projects.",
      highlights: [
        "Requirements gathering and direct communication with clients at every stage.",
        "Planning of schedules, deadlines and deliveries.",
        "Version control with Git and GitHub, applying programming logic and problem solving.",
      ],
    },
    "actionline-dp": {
      role: "Payroll Apprentice",
      summary:
        "Support for payroll routines, organising, checking and updating documents and information.",
      highlights: [
        "Support for the department's internal administrative processes.",
        "Responsible and confidential handling of corporate information.",
        "Following procedures with organisation and attention to detail.",
      ],
    },
    "control-adm": {
      role: "Junior Administrative Analyst",
      summary:
        "Support for recruitment and selection, and preparation of spreadsheets, reports and KPIs to track internal processes.",
      highlights: [
        "Résumé screening and analysis, candidate contact and scheduling.",
        "Organisation of hiring documentation and onboarding follow-up.",
        "Preparation and updating of spreadsheets, reports and KPIs in Excel and corporate systems.",
      ],
    },
    "discord-cm": {
      role: "Community Manager",
      summary:
        "Creation, structuring and administration of digital communities: servers, channels, roles, permissions, hierarchies and bot automations.",
      highlights: [
        "Moderation, definition of rules and processes and user support.",
        "Organisation of staff teams and monitoring of server operations.",
      ],
    },
    "workana-adm": {
      role: "Virtual Administrative Assistant",
      summary:
        "Remote support for administrative routines, document organisation and workflow structuring with Trello and Notion.",
      highlights: ["Tracking of requests, deadlines and routine efficiency."],
    },
    "freelancer-social": {
      role: "Copywriter and Social Media",
      summary:
        "Content planning for social media, corporate copy, publishing management and tracking of basic metrics.",
      highlights: [],
    },
    "oticas-carol": {
      role: "Sales Assistant",
      summary:
        "Customer service and after-sales, cash handling, organisation of tax documents and inventory support.",
      highlights: [],
    },
  },
  es: {
    "control-dev": {
      role: "Desarrolladora Web",
      summary:
        "Desarrollo y evolución del sitio institucional de la empresa, con foco en diseño responsivo, accesibilidad, rendimiento y experiencia de usuario.",
      highlights: [
        "Implementación de tema claro y oscuro, menú responsivo, FAQ interactivo, animaciones y recursos de navegación.",
        "Validación de formularios con integración a WhatsApp.",
        "HTML semántico, accesibilidad, buenas prácticas de SEO y control de versiones con Git y GitHub.",
      ],
    },
    "workana-dev": {
      role: "Desarrolladora Web Freelance",
      summary:
        "Desarrollo de sitios responsivos, desde el levantamiento de requisitos y la comprensión de las necesidades de los clientes hasta la organización y entrega de los proyectos.",
      highlights: [
        "Levantamiento de requisitos y comunicación directa con los clientes en todas las etapas.",
        "Organización de cronogramas, plazos y entregas.",
        "Control de versiones con Git y GitHub, aplicando lógica de programación y resolución de problemas.",
      ],
    },
    "actionline-dp": {
      role: "Aprendiz de Nómina y Personal",
      summary:
        "Apoyo a las rutinas del departamento de personal, con organización, verificación y actualización de documentos e información.",
      highlights: [
        "Apoyo a los procesos administrativos internos del área.",
        "Tratamiento responsable y confidencial de la información corporativa.",
        "Cumplimiento de procedimientos con organización y atención al detalle.",
      ],
    },
    "control-adm": {
      role: "Analista Administrativa Jr.",
      summary:
        "Apoyo en reclutamiento y selección y elaboración de hojas de cálculo, informes e indicadores para el seguimiento de procesos internos.",
      highlights: [
        "Selección y análisis de currículums, contacto y agenda de candidatos.",
        "Organización de la documentación de admisión y seguimiento del onboarding.",
        "Elaboración y actualización de hojas de cálculo, informes e indicadores en Excel y sistemas corporativos.",
      ],
    },
    "discord-cm": {
      role: "Community Manager",
      summary:
        "Creación, estructuración y administración de comunidades digitales: servidores, canales, roles, permisos, jerarquías y automatizaciones con bots.",
      highlights: [
        "Moderación, definición de reglas y procesos y soporte a los usuarios.",
        "Organización de equipos de staff y seguimiento del funcionamiento de los servidores.",
      ],
    },
    "workana-adm": {
      role: "Asistente Administrativa Virtual",
      summary:
        "Soporte remoto a rutinas administrativas, organización de documentos y estructuración de flujos de trabajo con Trello y Notion.",
      highlights: ["Seguimiento de solicitudes, plazos y eficiencia de las rutinas."],
    },
    "freelancer-social": {
      role: "Redactora y Social Media",
      summary:
        "Planificación de contenidos para redes sociales, textos institucionales, gestión de publicaciones y seguimiento de métricas básicas.",
      highlights: [],
    },
    "oticas-carol": {
      role: "Auxiliar de Ventas",
      summary:
        "Atención al cliente y posventa, control de caja, organización de documentos fiscales y apoyo a la gestión de inventario.",
      highlights: [],
    },
  },
};

function localizeExperience(e: Experience, locale: Locale): Experience {
  if (locale === "pt-BR") return e;
  const t = experienceText[locale][e.id];
  return {
    ...e,
    ...(t ?? {}),
    period: translatePeriod(e.period, locale),
    location: term(e.location, locale),
    tags: e.tags.map((tag) => term(tag, locale)),
  };
}

/* ---------- Education ---------- */

const educationText: Record<Foreign, Record<string, Pick<Education, "course" | "level">>> = {
  en: {
    "usjt-cc": { course: "Computer Science", level: "Bachelor's degree" },
    "ung-ads": {
      course: "Systems Analysis and Development",
      level: "Associate degree in Technology (CST)",
    },
    "senac-tds": { course: "Systems Development Technician", level: "Technical course" },
    "senac-rh": { course: "Human Resources Technician", level: "Technical course" },
    "etec-adm": { course: "Business Administration Technician", level: "Technical course" },
  },
  es: {
    "usjt-cc": { course: "Ciencias de la Computación", level: "Licenciatura" },
    "ung-ads": { course: "Análisis y Desarrollo de Sistemas", level: "Tecnólogo (CST)" },
    "senac-tds": { course: "Técnico en Desarrollo de Sistemas", level: "Técnico" },
    "senac-rh": { course: "Técnico en Recursos Humanos", level: "Técnico" },
    "etec-adm": { course: "Técnico en Administración", level: "Técnico" },
  },
};

const courseText: Record<Foreign, Record<string, Partial<Pick<Course, "title" | "hours">>>> = {
  en: {
    "ifrs-web": { title: "Web Programmer" },
    "ifrs-dba": { title: "Database Administrator" },
    "google-data": { title: "Data Analytics", hours: "180h of 200h" },
    "bradesco-office": { title: "Microsoft Office 2016" },
    "ifrs-adm": { title: "Administrative Assistant" },
    "ifrs-rh": { title: "HR Assistant" },
  },
  es: {
    "ifrs-web": { title: "Programador Web" },
    "ifrs-dba": { title: "Administrador de Bases de Datos" },
    "google-data": { title: "Análisis de Datos", hours: "180h de 200h" },
    "bradesco-office": { title: "Paquete Office 2016" },
    "ifrs-adm": { title: "Asistente Administrativo" },
    "ifrs-rh": { title: "Asistente de RR. HH." },
  },
};

/* ---------- Skills ---------- */

const skillGroupTitle: Record<Foreign, Record<string, string>> = {
  en: {
    frontend: "Frontend Development",
    backend: "Backend Development",
    dados: "Databases & Data",
    ferramentas: "Tools",
    processos: "Engineering & Processes",
  },
  es: {
    frontend: "Desarrollo Frontend",
    backend: "Desarrollo Backend",
    dados: "Bases de datos y datos",
    ferramentas: "Herramientas",
    processos: "Ingeniería y procesos",
  },
};

const levelLabels: Record<Foreign, Record<SkillLevel, string>> = {
  en: { principal: "Core stack", projetos: "Used in projects", aprendendo: "Basics / studying" },
  es: {
    principal: "Stack principal",
    projetos: "Usado en proyectos",
    aprendendo: "Nociones / estudiando",
  },
};

const softSkillText: Record<Foreign, string[]> = {
  en: [
    "Logical reasoning",
    "Organisation and priority management",
    "Clear communication with clients and teams",
    "Proactivity and responsibility",
    "Adaptability and teamwork",
    "Meeting deadlines",
  ],
  es: [
    "Razonamiento lógico",
    "Organización y gestión de prioridades",
    "Comunicación clara con clientes y equipos",
    "Proactividad y responsabilidad",
    "Adaptabilidad y trabajo en equipo",
    "Cumplimiento de plazos",
  ],
};

/* ---------- Public API ---------- */

export type LocalizedContent = {
  profile: typeof profile;
  languages: Language[];
  projects: Project[];
  experiences: Experience[];
  otherExperiences: Experience[];
  education: (Education & { statusLabel: string })[];
  courses: (Course & { statusLabel: string })[];
  skillGroups: SkillGroup[];
  skillLevelLabel: Record<SkillLevel, string>;
  softSkills: string[];
  statusLabel: (status: Status) => string;
};

function build(locale: Locale): LocalizedContent {
  const statusLabel = (s: Status) => term(s, locale);
  if (locale === "pt-BR") {
    return {
      profile,
      languages,
      projects,
      experiences,
      otherExperiences,
      education: education.map((e) => ({ ...e, statusLabel: e.status })),
      courses: courses.map((c) => ({ ...c, statusLabel: c.status })),
      skillGroups,
      skillLevelLabel,
      softSkills,
      statusLabel,
    };
  }
  const p = profileText[locale];
  return {
    profile: { ...profile, ...p, lookingFor: p.lookingFor } as unknown as typeof profile,
    languages: languages.map((l) => ({ name: term(l.name, locale), level: term(l.level, locale) })),
    projects: projects.map((x) => localizeProject(x, locale)),
    experiences: experiences.map((x) => localizeExperience(x, locale)),
    otherExperiences: otherExperiences.map((x) => localizeExperience(x, locale)),
    education: education.map((e) => ({
      ...e,
      ...(educationText[locale][e.id] ?? {}),
      period: translatePeriod(e.period, locale),
      statusLabel: statusLabel(e.status),
    })),
    courses: courses.map((c) => ({
      ...c,
      ...(courseText[locale][c.id] ?? {}),
      statusLabel: statusLabel(c.status),
    })),
    skillGroups: skillGroups.map((g) => ({
      ...g,
      title: skillGroupTitle[locale][g.id] ?? g.title,
      skills: g.skills.map((s) => ({ ...s, name: term(s.name, locale) })),
    })),
    skillLevelLabel: levelLabels[locale],
    softSkills: softSkillText[locale],
    statusLabel,
  };
}

const cache = new Map<Locale, LocalizedContent>();

export function getContent(locale: Locale): LocalizedContent {
  let content = cache.get(locale);
  if (!content) {
    content = build(locale);
    cache.set(locale, content);
  }
  return content;
}
