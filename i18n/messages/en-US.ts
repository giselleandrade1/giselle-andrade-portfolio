export const enUS = {
  metadata: {
    title: "Giselle Andrade | Full Stack Developer",
    description:
      "Portfolio of Giselle Andrade, a Full Stack Developer focused on backend development, Java, TypeScript, React, Next.js, APIs, and thoughtful digital experiences.",
    openGraphAlt: "Giselle Andrade — Full Stack Developer portfolio",
    openGraphLocale: "en_US",
    keywords: [
      "Giselle Andrade",
      "Full Stack Developer",
      "Backend Developer",
      "Java Developer",
      "TypeScript Developer",
      "React Developer",
      "Next.js Developer",
      "Software Developer",
      "Web Development",
      "Portfolio",
    ],
  },
  common: {
    email: "Email",
    externalTab: "opens in a new tab",
  },
  navigation: {
    links: {
      home: "Home",
      about: "About",
      skills: "Skills",
      projects: "Projects",
      experience: "Journey",
      contact: "Contact",
    },
    primaryLabel: "Primary navigation",
    mobileLabel: "Mobile navigation",
    dialogLabel: "Navigation menu",
    drawerTitle: "Navigation",
    openMenu: "Open navigation menu",
    closeMenu: "Close navigation menu",
    brandHome: "Giselle.dev, home",
    socialProfileLabel: "{platform} profile (opens in a new tab)",
    resume: "Resume",
    downloadResume: "Download resume",
    skipToContent: "Skip to main content",
  },
  theme: {
    switchToLight: "Switch to light theme",
    switchToDark: "Switch to dark theme",
  },
  language: {
    buttonLabel: "Change language",
    menuLabel: "Choose a language",
    currentLanguage: "Current language",
  },
  hero: {
    sectionLabel: "Introduction",
    greeting: "Hello, I'm",
    role: "Full Stack Developer",
    headlineLead: "Full Stack Developer building",
    headlineAccent: "reliable software",
    headlineTail: "and thoughtful digital experiences.",
    summary:
      "I build web applications with a strong focus on backend development, Java, TypeScript, React, Next.js, APIs, and maintainable software.",
    availability: "Available for opportunities",
    technologiesLabel: "Primary technologies",
    viewProjects: "View projects",
    contactMe: "Contact me",
    downloadResume: "Download resume",
    socialLinksLabel: "Social links",
    portraitAlt: "Portrait of Giselle Andrade",
  },
  about: {
    sectionLabel: "About Giselle Andrade",
    eyebrow: "About me",
    title: "Technology with intent, from system logic to the final interaction.",
    description:
      "I connect backend thinking, interface craft, and product awareness to build software that is useful, understandable, and ready to evolve.",
    note: "Based in São Paulo, SP, Brazil · Building in public through documented, deployed projects.",
    storyLabel: "How I work",
    storyTitle: "Reliable foundations. Clear experiences.",
    bio:
      "My work combines software engineering, clean architecture, responsive interfaces, and user-centered digital experiences. I keep developing real projects to strengthen my technical practice and build accessible, secure, and well-structured products.",
    highlightsLabel: "Areas of focus",
    highlights: [
      "Backend Development",
      "Scalable Applications",
      "Clean Code",
      "UI/UX Awareness",
      "Real Projects",
      "Continuous Learning",
    ],
    principlesLabel: "Development principles",
    principles: [
      {
        title: "Engineering foundations",
        description: "Business rules, data, APIs, and architecture shape the product from the inside out.",
      },
      {
        title: "Thoughtful interfaces",
        description: "Clear hierarchy, responsive behavior, and accessible interaction are part of software quality.",
      },
      {
        title: "Continuous practice",
        description: "Real projects turn study into documented decisions, working features, and better judgment.",
      },
    ],
  },
  skills: {
    sectionLabel: "Technical skills",
    eyebrow: "Technical toolkit",
    title: "Tools chosen for the problem, not for the trend.",
    description:
      "A growing toolkit for interfaces, APIs, data, delivery, and the engineering work that connects them.",
    note: "Six practical areas · No remote icon requests · Lightweight, local interface marks.",
    categories: {
      Languages: "Languages",
      Frontend: "Frontend",
      Backend: "Backend",
      Databases: "Databases",
      "Cloud & DevOps": "Cloud & DevOps",
      Tools: "Tools",
    },
  },
  projects: {
    sectionLabel: "Selected projects",
    eyebrow: "Selected projects",
    title: "Products that turn technical practice into something you can use.",
    description:
      "Real, deployed work presented with the context behind the interface: problem, implementation choices, and current limitations.",
    note: "Screenshots captured from live deployments · Repository and demo URLs validated.",
    filterLabel: "Filter projects by category",
    filters: {
      All: "All",
      "Full Stack": "Full Stack",
      Frontend: "Frontend",
      Backend: "Backend",
      Java: "Java",
    },
    status: {
      allOne: "Showing 1 project.",
      allMany: "Showing {count} projects.",
      filteredOne: "Showing 1 project in {filter}.",
      filteredMany: "Showing {count} projects in {filter}.",
    },
    live: "Live",
    selectedWork: "Selected work",
    technologiesLabel: "Technologies used in {project}",
    projectNotes: "Project notes",
    challenge: "Challenge",
    solution: "Solution",
    keyDecisions: "Key decisions",
    result: "Result",
    liveDemo: "Live demo",
    sourceCode: "Source code",
    liveDemoLabel: "View live demo of {project} (opens in a new tab)",
    sourceCodeLabel: "View {project} source code on GitHub (opens in a new tab)",
    repositoryLabel: "Open {project} repository on GitHub (opens in a new tab)",
    items: {
      lembrafacil: {
        description:
          "An accessible, offline-capable task manager with daily planning, Kanban, Eisenhower prioritization, scheduling, and analytics. Its static frontend stores data locally, while the repository also contains an optional Java 17 service.",
        previewAlt: "LembraFácil task manager dashboard",
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
      venux: {
        description:
          "A jewelry e-commerce application built as one Next.js App Router project, combining the storefront with internal APIs for authentication, products, cart, wishlist, orders, and contact.",
        previewAlt: "Venux Bijoux e-commerce storefront",
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
      kinvo: {
        description:
          "A responsive fixed-income product interface that consumes mock API data and provides real-time filtering, sorting, pagination, loading feedback, and error handling.",
        previewAlt: "Kinvo fixed-income product interface",
        caseStudy: {
          challenge: "Implement the Kinvo frontend challenge around fixed-income products backed by a mock API.",
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
      gisten: {
        description:
          "A responsive authentication and client-management system with per-user data isolation, role-based access, persistent themes, and a SQLite database.",
        previewAlt: "GistenLixt authentication and client management interface",
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
      control: {
        description:
          "A responsive institutional website for Control Consultoria Empresarial, built without frameworks and featuring persistent themes, semantic content, a WhatsApp contact flow, FAQ, and SEO metadata.",
        previewAlt: "Control Consultoria Empresarial website",
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
      portfolio: {
        description:
          "A personal developer portfolio presenting selected projects, technical skills, services, and a software-development journey in a responsive themed interface.",
        previewAlt: "Giselle Andrade developer portfolio",
        caseStudy: null,
      },
    },
  },
  services: {
    sectionLabel: "Services and expertise",
    eyebrow: "Services / Expertise",
    title: "From the system underneath to the experience on screen.",
    description:
      "Focused capabilities across software delivery, with backend engineering at the center and interface quality built in.",
    note: "Scope is shaped around the product, its users, and the technical constraints that matter.",
    items: {
      "software-development": {
        title: "Software Development",
        description: "Systems and digital products built around clear requirements, maintainable code, and reliable behavior.",
      },
      "backend-development": {
        title: "Backend Development",
        description: "APIs, authentication, business rules, data persistence, and application architecture.",
      },
      "frontend-development": {
        title: "Frontend Development",
        description: "Responsive, accessible, and performant interfaces built with modern web technologies.",
      },
      "ui-ux-interfaces": {
        title: "UI/UX & Interfaces",
        description: "Clear visual hierarchy, thoughtful interactions, usability, and user-centered interface decisions.",
      },
      "web-development": {
        title: "Web Development",
        description: "Institutional websites, landing pages, portfolios, and complete web applications.",
      },
      "cloud-devops": {
        title: "Cloud / DevOps",
        description: "Deployment, version control, automation, containers, and cloud-oriented delivery workflows.",
      },
    },
  },
  process: {
    sectionLabel: "Software development process",
    eyebrow: "How I build",
    title: "Structure first. Then thoughtful execution.",
    description:
      "A practical path from an uncertain idea to a tested, documented product — with feedback built into every stage.",
    note: "Discover · Plan · Design · Develop · Test · Deploy",
    items: {
      discover: {
        title: "Discover",
        description: "Clarify the goal, the people using the product, its constraints, and what success means.",
      },
      plan: {
        title: "Plan",
        description: "Turn requirements into scope, flows, data, priorities, and deliberate technical decisions.",
      },
      design: {
        title: "Design",
        description: "Shape hierarchy, responsive behavior, accessible interactions, and clear system feedback.",
      },
      develop: {
        title: "Develop",
        description: "Build maintainable interfaces, APIs, business rules, and the connections between them.",
      },
      test: {
        title: "Test",
        description: "Validate behavior, accessibility, performance, edge cases, and real device constraints.",
      },
      deploy: {
        title: "Deploy",
        description: "Ship carefully, verify production behavior, and document decisions and limitations.",
      },
    },
  },
  journey: {
    sectionLabel: "Development experience and journey",
    eyebrow: "Experience / Journey",
    title: "Learning in public, one deliberate build at a time.",
    description:
      "A project-led path through software engineering, backend systems, interfaces, and professional communication.",
    note: "This timeline records study and project milestones, not fictional employment or inflated seniority.",
    intro:
      "My current experience is grounded in independent study and hands-on projects. Each build is an opportunity to work through product requirements, architecture, implementation, documentation, testing, accessibility, and deployment.",
    aside:
      "I value honest scope: the work shown here reflects what is implemented and documented in public repositories.",
    technologiesLabel: "Technologies for {item}",
    items: {
      "full-stack-journey": {
        title: "Full Stack Development Journey",
        context: "Project-based learning",
        description:
          "Building and documenting real applications across task management, e-commerce, authentication, finance interfaces, and professional websites.",
      },
      "backend-focus": {
        title: "Backend Engineering Focus",
        context: "Independent study and project work",
        description:
          "Studying APIs, system architecture, databases, authentication, business rules, and object-oriented programming.",
      },
      "interface-practice": {
        title: "UI/UX and Web Interfaces",
        context: "Responsive product interfaces",
        description:
          "Designing and implementing accessible, responsive, and visually structured interfaces for web applications.",
      },
      "professional-presence": {
        title: "Portfolio and Professional Positioning",
        context: "GitHub, LinkedIn, and deployed projects",
        description:
          "Organizing a professional digital presence around public repositories, deployed applications, technical documentation, and continuous learning.",
      },
    },
  },
  github: {
    sectionLabel: "GitHub repositories",
    eyebrow: "Open work",
    title: "The code tells the fuller story.",
    description: "Selected public repositories with source, documentation, and the decisions behind each project.",
    note: "Curated HTML content · No third-party stats image · No token required to render.",
    profileCopy:
      "Explore implementation details, project documentation, current limitations, and the progression of each application directly in the repositories.",
    visitGitHub: "Visit GitHub",
    visitGitHubLabel: "Visit GitHub profile for Giselle Andrade",
  },
  contact: {
    sectionLabel: "Contact Giselle Andrade",
    eyebrow: "Start a conversation",
    title: "Let's build something meaningful.",
    description:
      "I'm open to software-development opportunities, collaborations, and conversations about backend systems, web applications, and thoughtful digital products.",
    copyNote: "Copy the address or use the email link. No form pretends to send a message without a backend.",
    copyEmail: {
      idle: "Copy email",
      copying: "Copying…",
      copied: "Copied",
      error: "Try again",
      copiedFeedback: "Email address copied to the clipboard.",
      errorFeedback: "The email address could not be copied. Please try again.",
    },
    form: {
      eyebrow: "Prefer to write first?",
      title: "Start the message here.",
      description: "This form prepares an email on your device. It does not claim to send anything through a server.",
      ariaLabel: "Email contact form",
      fields: {
        name: { label: "Name", placeholder: "Your name" },
        email: { label: "Email", placeholder: "you@example.com" },
        subject: { label: "Subject", placeholder: "Project, role, or collaboration" },
        message: { label: "Message", placeholder: "Tell me a little about what you are building." },
      },
      errors: {
        name: "Enter your name.",
        email: "Enter a valid email address.",
        subject: "Add a short subject.",
        message: "Write at least 12 characters so there is enough context.",
      },
      invalidStatus: "Please review the highlighted fields.",
      openedStatus: "Your email application has been opened. Review the message and send it when ready.",
      submit: "Open email application",
      mailBodyName: "Name",
      mailBodyEmail: "Email",
    },
  },
  footer: {
    navigationLabel: "Footer navigation",
    roleLine: "Full Stack Developer · Backend focus · São Paulo, SP, Brazil",
    backToTop: "Back to top",
    builtWithCare: "Designed and built with care, accessibility, and performance in mind.",
  },
  notFound: {
    code: "404 / route_not_found",
    title: "This page stepped outside the stack.",
    description: "The address may have changed, but the portfolio is still right where it should be.",
    returnHome: "Return home",
  },
  manifest: {
    name: "Giselle Andrade — Full Stack Developer",
    shortName: "Giselle.dev",
  },
} as const;
