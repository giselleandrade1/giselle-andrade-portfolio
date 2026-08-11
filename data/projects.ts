import type { Project, ProjectFilter } from "@/data/types";

export const projectFilters = ["All", "Full Stack", "Frontend", "Backend", "Java"] as const satisfies readonly ProjectFilter[];

export const projects = [
  {
    slug: "lembrafacil",
    name: "LembraFácil",
    category: "Full Stack",
    categories: ["Full Stack", "Frontend", "Backend", "Java"],
    description:
      "An accessible, offline-capable task manager with daily planning, Kanban, Eisenhower prioritization, scheduling, and analytics. Its static frontend stores data locally, while the repository also contains an optional Java 17 service.",
    preview: "/projects/lembrafacil.webp",
    previewAlt: "LembraFácil task manager dashboard",
    demoUrl: "https://lembrafacil-task-manager.vercel.app/",
    repositoryUrl: "https://github.com/giselleandrade1/lembrafacil-task-manager",
    technologies: ["JavaScript", "Java 17", "HTML", "CSS", "IndexedDB", "PWA"],
    status: "Live",
    featured: true,
    caseStudy: {
      challenge:
        "Bring daily task management, prioritization, scheduling, and analytics into one accessible interface that remains useful offline.",
      solution:
        "A framework-free ES module frontend uses IndexedDB with a localStorage fallback, lazy-loaded Planning and Analytics views, and an installable service worker. A separate stateless Java 17 service handles validation, priority, CPM, and PERT analysis.",
      keyDecisions: [
        "Keep task data local to the browser in the deployed frontend.",
        "Use IndexedDB as the primary repository with a localStorage fallback.",
        "Keep the Java service stateless and separate from the static Vercel deployment.",
      ],
      result:
        "The live Vercel build is a static PWA with local task persistence. The Java handlers remain available in the repository and require a separate JVM and Servlet host.",
    },
  },
  {
    slug: "venux",
    name: "Venux Bijoux",
    category: "Full Stack",
    categories: ["Full Stack", "Frontend", "Backend"],
    description:
      "A jewelry e-commerce application built as one Next.js App Router project, combining the storefront with internal APIs for authentication, products, cart, wishlist, orders, and contact.",
    preview: "/projects/venux.webp",
    previewAlt: "Venux Bijoux e-commerce storefront",
    demoUrl: "https://venuxbijoux-app.vercel.app/",
    repositoryUrl: "https://github.com/giselleandrade1/venux-bijoux-ecommerce",
    technologies: ["Next.js", "React", "JavaScript", "App Router", "API Routes"],
    status: "Live",
    featured: true,
    caseStudy: {
      challenge: "Unify the storefront and its commerce API in one maintainable application.",
      solution:
        "A Next.js App Router codebase organizes pages, API routes, reusable components, providers, domain hooks, services, stores, data, and shared types.",
      keyDecisions: [
        "Keep the frontend and internal API in the same application.",
        "Separate HTTP services, state adapters, domain hooks, and data contracts.",
        "Support light, dark, and system themes plus Portuguese and English route aliases.",
      ],
      result:
        "The repository documents integrated authentication, product catalog, cart, wishlist, order, and contact flows in a single deployable app.",
    },
  },
  {
    slug: "kinvo",
    name: "Kinvo Frontend Challenge",
    category: "Frontend",
    categories: ["Frontend"],
    description:
      "A responsive fixed-income product interface that consumes mock API data and provides real-time filtering, sorting, pagination, loading feedback, and error handling.",
    preview: "/projects/kinvo.webp",
    previewAlt: "Kinvo fixed-income product interface",
    demoUrl: "https://kinvofrontendtest.vercel.app/",
    repositoryUrl: "https://github.com/giselleandrade1/kinvo-frontend-challenge",
    technologies: ["React 19", "TypeScript 5", "Styled Components", "Axios", "Vite 7"],
    status: "Live",
    featured: true,
    caseStudy: {
      challenge:
        "Implement the Kinvo frontend challenge around fixed-income products backed by a mock API.",
      solution:
        "Functional React components and strongly typed services separate the product table, filters, sorting, pagination, and API integration, with Styled Components handling the responsive UI.",
      keyDecisions: [
        "Use TypeScript for the product and API contracts.",
        "Keep filtering and sorting controls separate from the product table.",
        "Provide explicit loading and error feedback.",
      ],
      result:
        "The README records real-time search, five sorting options, five products per page, responsive layouts, and API error handling.",
    },
  },
  {
    slug: "gisten",
    name: "GistenLixt",
    category: "Full Stack",
    categories: ["Full Stack", "Frontend", "Backend"],
    description:
      "A responsive authentication and client-management system with per-user data isolation, role-based access, persistent themes, and a SQLite database.",
    preview: "/projects/gisten.webp",
    previewAlt: "GistenLixt authentication and client management interface",
    demoUrl: "https://gisten-lixt.vercel.app/",
    repositoryUrl: "https://github.com/giselleandrade1/gistenlixt-finance_app",
    technologies: ["Next.js 16", "TypeScript", "Tailwind CSS 4", "SQLite", "Jest"],
    status: "Live",
    featured: false,
    caseStudy: {
      challenge: "Provide authentication and isolated client management in one responsive application.",
      solution:
        "Next.js API routes handle authentication and client operations, while SQLite stores relational data and the UI uses reusable components, providers, and Tailwind CSS.",
      keyDecisions: [
        "Use HttpOnly cookies for authentication tokens.",
        "Hash passwords with bcryptjs.",
        "Enforce per-user data isolation with database foreign keys.",
      ],
      result:
        "The application includes login, signup, logout, role-based access, and isolated client-management flows with Jest and React Testing Library in the repository.",
    },
  },
  {
    slug: "control",
    name: "Control Consultoria",
    category: "Frontend",
    categories: ["Frontend"],
    description:
      "A responsive institutional website for Control Consultoria Empresarial, built without frameworks and featuring persistent themes, semantic content, a WhatsApp contact flow, FAQ, and SEO metadata.",
    preview: "/projects/control.webp",
    previewAlt: "Control Consultoria Empresarial website",
    demoUrl: "https://control-consultoria-website.vercel.app/",
    repositoryUrl: "https://github.com/giselleandrade1/control-consultoria-website",
    technologies: ["HTML", "CSS", "JavaScript", "Schema.org", "Open Graph"],
    status: "Live",
    featured: false,
    caseStudy: {
      challenge: "Deliver a responsive company website without runtime frameworks or libraries.",
      solution:
        "Semantic HTML, responsive CSS, and vanilla JavaScript provide navigation, theme persistence, form validation, FAQ behavior, animations, and SEO metadata.",
      keyDecisions: [
        "Use native web technologies with no external runtime dependency.",
        "Support keyboard navigation, associated form labels, and a skip link.",
        "Send the validated contact form through a formatted WhatsApp action.",
      ],
      result:
        "The README documents layouts tested from 320px to 1920px, light and dark themes, structured metadata, and an approximately 62 KB HTML, CSS, and JavaScript bundle.",
    },
  },
  {
    slug: "portfolio",
    name: "Giselle Andrade Portfolio",
    category: "Frontend",
    categories: ["Frontend"],
    description:
      "A personal developer portfolio presenting selected projects, technical skills, services, and a software-development journey in a responsive themed interface.",
    preview: "/projects/portfolio.webp",
    previewAlt: "Giselle Andrade developer portfolio",
    demoUrl: "https://giselleandrade1-dev.vercel.app/",
    repositoryUrl: "https://github.com/giselleandrade1/giselle-andrade-portfolio",
    technologies: ["Next.js 16", "React 19", "TypeScript", "CSS Modules"],
    status: "Live",
    featured: false,
  },
] as const satisfies readonly Project[];
