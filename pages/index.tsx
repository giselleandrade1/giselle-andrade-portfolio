import Head from "next/head";
import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import styles from "@/styles/Home.module.css";

const profile = {
  name: "Giselle Andrade",
  role: "Full Stack Developer",
  subtitle: "Backend Focus • Java • TypeScript",
  location: "Sao Paulo, SP - Brazil",
  email: "giselleandradelourenco@gmail.com",
  github: "https://github.com/giselleandrade1",
  linkedin: "https://linkedin.com/in/giselleandrades2",
  avatar: "https://avatars.githubusercontent.com/u/187031179?v=4",
};

const navItems = [
  ["#hero", "Home"],
  ["#about", "About"],
  ["#skills", "Skills"],
  ["#projects", "Projects"],
  ["#services", "Services"],
  ["#experience", "Experience"],
  ["#contact", "Contact"],
];

const typingRoles = [
  "Backend Developer",
  "Full Stack Developer",
  "Software Developer",
  "UI/UX Enthusiast",
  "Web Developer",
  "App Developer",
];

const aboutHighlights = [
  "Backend Focus",
  "Scalable Applications",
  "UI/UX Vision",
  "Clean Code",
  "Real Projects",
  "Continuous Learning",
];

const stats = [
  ["20+", "Repositories"],
  ["12+", "Featured Projects"],
  ["10+", "Technologies"],
  ["4+", "Main Development Areas"],
];

const services = [
  ["Software Development", "Development of systems, web applications and scalable digital solutions."],
  ["Backend Development", "APIs, authentication, business rules, databases and system architecture."],
  ["Frontend Development", "Modern, responsive, accessible and high-performance interfaces."],
  ["UI/UX Design", "Intuitive digital experiences, visual hierarchy, usability and user-centered design."],
  ["Web Development", "Institutional websites, landing pages, portfolios and complete web applications."],
  ["App Development", "Adaptive interfaces, PWAs and mobile-first digital experiences."],
  ["Cloud & DevOps", "Deploy, versioning, automation, Docker, Vercel, AWS and Azure."],
  ["Database & Data", "Data modeling, organization and structuring with relational and non-relational databases."],
];

const stack = [
  {
    category: "Languages",
    items: [
      ["Java", "java/java-original.svg"],
      ["JavaScript", "javascript/javascript-original.svg"],
      ["TypeScript", "typescript/typescript-original.svg"],
      ["Python", "python/python-original.svg"],
      ["PHP", "php/php-original.svg"],
    ],
  },
  {
    category: "Frontend",
    items: [
      ["HTML5", "html5/html5-original.svg"],
      ["CSS3", "css3/css3-original.svg"],
      ["React", "react/react-original.svg"],
      ["Next.js", "nextjs/nextjs-original.svg"],
      ["Tailwind CSS", "tailwindcss/tailwindcss-original.svg"],
    ],
  },
  {
    category: "Backend",
    items: [
      ["Node.js", "nodejs/nodejs-original.svg"],
      ["Express", "express/express-original.svg"],
      ["NestJS", "nestjs/nestjs-original.svg"],
      ["Spring", "spring/spring-original.svg"],
      ["JWT", "jsonwebtokens/jsonwebtokens-original.svg"],
    ],
  },
  {
    category: "Databases",
    items: [
      ["MySQL", "mysql/mysql-original.svg"],
      ["PostgreSQL", "postgresql/postgresql-original.svg"],
      ["MongoDB", "mongodb/mongodb-original.svg"],
      ["SQL Server", "microsoftsqlserver/microsoftsqlserver-plain.svg"],
    ],
  },
  {
    category: "Cloud & DevOps",
    items: [
      ["AWS", "amazonwebservices/amazonwebservices-original-wordmark.svg"],
      ["Azure", "azure/azure-original.svg"],
      ["Vercel", "vercel/vercel-original.svg"],
      ["Docker", "docker/docker-original.svg"],
    ],
  },
  {
    category: "Tools",
    items: [
      ["Git", "git/git-original.svg"],
      ["GitHub", "github/github-original.svg"],
      ["Postman", "postman/postman-original.svg"],
      ["Figma", "figma/figma-original.svg"],
      ["Notion", "notion/notion-original.svg"],
    ],
  },
];

const projects = [
  {
    name: "Giselle Andrade Portfolio",
    status: "Live",
    link: "https://giselleandrade1-dev.vercel.app/",
    github: "https://github.com/giselleandrade1/giselle-andrade_portfolio",
    description:
      "Personal portfolio developed with modern web technologies, focused on performance, responsive design, accessibility and professional digital presence.",
    highlight: "Design system, SEO, dark mode and professional positioning.",
    tech: ["Next.js", "TypeScript", "React", "CSS Modules"],
  },
  {
    name: "Venux Bijoux",
    status: "Live",
    link: "https://venuxbijoux-app.vercel.app/",
    github: "https://github.com/giselleandrade1/venux-bijoux_ecommerce",
    description:
      "E-commerce interface for a jewelry brand, focused on elegant visual presentation, product experience and responsive layout.",
    highlight: "Commercial UI, catalog structure and responsive shopping flow.",
    tech: ["React", "Next.js", "E-commerce", "UI/UX"],
  },
  {
    name: "Gisten Lixt",
    status: "Live",
    link: "https://gisten-lixt.vercel.app/",
    github: "https://github.com/giselleandrade1/gistenlixt-finance_app",
    description:
      "Finance management application designed to organize financial data with a clean, intuitive and user-friendly interface.",
    highlight: "Financial dashboard, data organization and clear navigation.",
    tech: ["React", "JavaScript", "Finance", "Dashboard"],
  },
  {
    name: "Kinvo Frontend Challenge",
    status: "Live",
    link: "https://kinvofrontendtest.vercel.app/",
    github: "https://github.com/giselleandrade1",
    description:
      "Frontend challenge focused on interface development, component structure, responsiveness and clean visual implementation.",
    highlight: "Component structure, responsive layout and API-oriented UI.",
    tech: ["React", "Frontend", "API", "Challenge"],
  },
  {
    name: "EasySchedule Java System",
    status: "Repository",
    link: "https://github.com/giselleandrade1/easyschedule_javasystem",
    github: "https://github.com/giselleandrade1/easyschedule_javasystem",
    description:
      "Scheduling system built with Java and Object-Oriented Programming, simulating a real business workflow with clients, professionals, services and available times.",
    highlight: "OOP, business rules and scheduling domain modeling.",
    tech: ["Java", "OOP", "Systems", "Backend"],
  },
];

const caseStudies = [
  {
    title: "Portfolio as a professional authority platform",
    context: "Create a complete digital presence for a full stack developer with backend focus.",
    challenge: "Communicate technical depth, visual maturity and product thinking in one page.",
    solution: "A premium layout with fixed profile sidebar, structured sections, projects, cases and contact flow.",
    technologies: "Next.js, React, TypeScript, CSS Modules and Vercel.",
    highlights: "Accessibility, responsive layout, SEO, dark/light theme and reusable visual tokens.",
    result: "A portfolio that presents technical evolution with a more senior and product-oriented positioning.",
  },
  {
    title: "Venux Bijoux as an e-commerce experience",
    context: "Present a jewelry brand through a modern, elegant and conversion-focused interface.",
    challenge: "Balance product visibility, visual appeal and easy mobile navigation.",
    solution: "Responsive product presentation with clear hierarchy, brand-focused sections and Vercel deployment.",
    technologies: "React, Next.js, CSS and deployment workflow.",
    highlights: "Catalog experience, responsive design, visual consistency and commercial interface decisions.",
    result: "A project that demonstrates the ability to translate business needs into usable digital products.",
  },
];

const experience = [
  [
    "2026 - Full Stack Development Journey",
    "Development of real-world projects using Java, JavaScript, TypeScript, React, Next.js and Node.js.",
  ],
  [
    "2026 - Backend Focus",
    "Studies and projects focused on APIs, systems architecture, databases and object-oriented programming.",
  ],
  [
    "2026 - UI/UX and Web Interfaces",
    "Creation of responsive, accessible and visually structured interfaces for web applications.",
  ],
  [
    "2026 - Portfolio and Professional Positioning",
    "Building a professional digital presence through GitHub, LinkedIn and deployed projects.",
  ],
];

const repositories = [
  "controlconsultoria-website",
  "easyschedule_javasystem",
  "bunny-bites_ecommerce",
  "venux-bijoux_ecommerce",
  "gistenlixt-finance_app",
  "giselle-andrade_portfolio",
  "contabilizei-fullstack_challenge",
  "invest-management_app",
  "noctora-vault_challenge",
  "angular-first_steps",
];

type ButtonProps = {
  href?: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  target?: string;
  rel?: string;
  download?: boolean;
};

function Button({ href, children, variant = "primary", target, rel, download }: ButtonProps) {
  const className = `${styles.button} ${styles[variant]}`;

  if (href) {
    return (
      <a className={className} href={href} target={target} rel={rel} download={download}>
        {children}
      </a>
    );
  }

  return (
    <button className={className} type="submit">
      {children}
    </button>
  );
}

function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const saved = window.localStorage.getItem("theme") as "dark" | "light" | null;
    const preferred = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
    const next = saved || preferred;
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
  }, []);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    window.localStorage.setItem("theme", next);
  }

  return (
    <button
      aria-label={`Activate ${theme === "dark" ? "light" : "dark"} mode`}
      className={styles.themeToggle}
      type="button"
      onClick={toggleTheme}
    >
      <span aria-hidden="true">{theme === "dark" ? "☾" : "☼"}</span>
    </button>
  );
}

function SectionTitle({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className={styles.sectionHeader}>
      <span className={styles.eyebrow}>{eyebrow}</span>
      <h2>{title}</h2>
      {description ? <p>{description}</p> : null}
    </div>
  );
}

function SidebarProfile() {
  return (
    <aside className={styles.sidebar} aria-label="Profile summary">
      <div className={styles.profileImage}>
        <Image src={profile.avatar} alt="Giselle Andrade" width={220} height={220} priority />
      </div>
      <div>
        <span className={styles.statusDot}>Available for projects and opportunities</span>
        <h2>{profile.name}</h2>
        <p className={styles.profileRole}>{profile.role}</p>
        <p className={styles.profileSubtitle}>{profile.subtitle}</p>
        <p className={styles.profileLocation}>{profile.location}</p>
      </div>
      <div className={styles.socialLinks} aria-label="Social links">
        <a href={profile.github} target="_blank" rel="noreferrer">GitHub</a>
        <a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
        <a href={`mailto:${profile.email}`}>E-mail</a>
      </div>
      <Button href="#contact">Contact Me</Button>
    </aside>
  );
}

function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className={styles.navbar}>
      <a className={styles.navBrand} href="#hero">Giselle.dev</a>
      <button
        className={styles.menuButton}
        type="button"
        aria-expanded={open}
        aria-controls="main-navigation"
        onClick={() => setOpen((current) => !current)}
      >
        Menu
      </button>
      <nav id="main-navigation" className={open ? styles.navOpen : ""} aria-label="Main navigation">
        {navItems.map(([href, label]) => (
          <a key={href} href={href} onClick={() => setOpen(false)}>
            {label}
          </a>
        ))}
      </nav>
      <div className={styles.navActions}>
        <ThemeToggle />
        <Button href="/curriculo-giselle-andrade.txt" variant="secondary" download>
          Download CV
        </Button>
      </div>
    </header>
  );
}

function AnimatedBackground() {
  return (
    <div className={styles.animatedBackground} aria-hidden="true">
      <span />
      <span />
      <span />
    </div>
  );
}

function ContactForm() {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const subject = String(data.get("subject") || "").trim();
    const message = String(data.get("message") || "").trim();
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!name || !validEmail || !subject || message.length < 12) {
      setStatus("error");
      return;
    }

    const body = `Name: ${name}\nE-mail: ${email}\n\n${message}`;
    window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setStatus("success");
    event.currentTarget.reset();
  }

  return (
    <form className={styles.contactForm} onSubmit={handleSubmit} noValidate>
      <label>
        Name
        <input name="name" type="text" autoComplete="name" placeholder="Your name" required />
      </label>
      <label>
        Email
        <input name="email" type="email" autoComplete="email" placeholder="you@email.com" required />
      </label>
      <label>
        Subject
        <input name="subject" type="text" placeholder="Opportunity, project or collaboration" required />
      </label>
      <label>
        Message
        <textarea name="message" placeholder="Tell me how I can help." minLength={12} required />
      </label>
      <Button>Send Message</Button>
      <p className={status === "error" ? styles.formError : styles.formSuccess} role="status">
        {status === "error"
          ? "Please check the fields and write a valid message."
          : status === "success"
            ? "Your email app was opened with the message ready to send."
            : ""}
      </p>
    </form>
  );
}

export default function Home() {
  return (
    <>
      <Head>
        <title>Giselle Andrade | Full Stack Developer</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <meta
          name="description"
          content="Professional portfolio of Giselle Andrade, Full Stack Developer focused on Backend, Java, JavaScript, TypeScript, Next.js, Node.js and modern digital solutions."
        />
        <meta
          name="keywords"
          content="Giselle Andrade, Full Stack Developer, Backend Developer, Java Developer, JavaScript Developer, TypeScript, Next.js, Node.js, Portfolio, Web Developer, UI UX Design"
        />
        <meta name="author" content="Giselle Andrade" />
        <meta property="og:title" content="Giselle Andrade | Full Stack Developer" />
        <meta property="og:description" content="Full Stack Developer focused on Backend, Software Architecture and Digital Experiences." />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={profile.avatar} />
        <meta name="theme-color" content="#8E25FF" />
      </Head>

      <div className={styles.page}>
        <AnimatedBackground />
        <a className={styles.skipLink} href="#main">Skip to content</a>
        <SidebarProfile />
        <div className={styles.shell}>
          <Navbar />
          <main id="main">
            <section className={`${styles.section} ${styles.hero}`} id="hero">
              <div className={styles.heroCopy}>
                <span className={styles.eyebrow}>Hello, I&apos;m Giselle Andrade</span>
                <h1>Full Stack Developer focused on Backend, Software Architecture and Digital Experiences.</h1>
                <p>
                  I design and build scalable digital solutions with backend logic, modern interfaces
                  and user-centered experiences.
                </p>
                <div className={styles.typingStack} aria-label="Professional roles">
                  {typingRoles.map((role, index) => (
                    <span key={role} style={{ animationDelay: `${index * 1.8}s` }}>
                      {role}
                    </span>
                  ))}
                </div>
                <div className={styles.heroActions}>
                  <Button href="#projects">View Projects</Button>
                  <Button href="/curriculo-giselle-andrade.txt" variant="secondary" download>Download CV</Button>
                  <Button href="#contact" variant="ghost">Contact Me</Button>
                </div>
              </div>
              <div className={styles.heroVisual} aria-label="Technology profile visual">
                <div className={styles.codeCard}>
                  <span>profile.ts</span>
                  <code>
                    const focus = [&quot;Backend&quot;, &quot;APIs&quot;, &quot;UX&quot;];
                    <br />
                    build(&quot;scalable digital products&quot;);
                  </code>
                </div>
                <div className={styles.visualStats}>
                  <strong>100%</strong>
                  <span>Focused on evolution</span>
                </div>
              </div>
            </section>

            <section className={styles.section} id="about">
              <SectionTitle
                eyebrow="About Me"
                title="Technology, product thinking and clean execution."
                description="I am Giselle Andrade, a Full Stack Developer in progress with a strong focus on Backend Development, Java, JavaScript, TypeScript, Node.js and scalable web applications."
              />
              <p className={styles.sectionText}>
                My work combines software engineering, clean architecture, responsive interfaces and
                user-centered digital experiences. I am constantly developing real-world projects to
                improve my technical skills and build solutions that are efficient, accessible, secure
                and visually well structured.
              </p>
              <div className={styles.highlightGrid}>
                {aboutHighlights.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </section>

            <section className={`${styles.section} ${styles.statsSection}`} aria-label="Professional stats">
              {stats.map(([number, label]) => (
                <article key={label}>
                  <strong>{number}</strong>
                  <span>{label}</span>
                </article>
              ))}
            </section>

            <section className={styles.section} id="services">
              <SectionTitle
                eyebrow="Services / Expertise"
                title="Digital solutions from backend logic to product experience."
              />
              <div className={styles.serviceGrid}>
                {services.map(([title, description], index) => (
                  <article className={styles.card} key={title}>
                    <span className={styles.cardNumber}>{String(index + 1).padStart(2, "0")}</span>
                    <h3>{title}</h3>
                    <p>{description}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className={styles.section} id="skills">
              <SectionTitle
                eyebrow="Tech Stack"
                title="A growing stack for web products, APIs and scalable systems."
              />
              <div className={styles.stackGrid}>
                {stack.map((group) => (
                  <article className={styles.stackCard} key={group.category}>
                    <h3>{group.category}</h3>
                    <div className={styles.techList}>
                      {group.items.map(([name, icon]) => (
                        <span className={styles.techBadge} key={name}>
                          <Image
                            src={`https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${icon}`}
                            alt=""
                            aria-hidden="true"
                            width={18}
                            height={18}
                            loading="lazy"
                            unoptimized
                          />
                          {name}
                        </span>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className={styles.section} id="projects">
              <SectionTitle
                eyebrow="Featured Projects"
                title="Premium project cards with context, stack and technical highlights."
              />
              <div className={styles.projectGrid}>
                {projects.map((project, index) => (
                  <article className={styles.projectCard} key={project.name}>
                    <div className={styles.projectMockup}>
                      <span>{project.status}</span>
                      <div>
                        <strong>{String(index + 1).padStart(2, "0")}</strong>
                        <p>{project.name}</p>
                      </div>
                    </div>
                    <div className={styles.projectContent}>
                      <h3>{project.name}</h3>
                      <p>{project.description}</p>
                      <strong>{project.highlight}</strong>
                      <div className={styles.projectTags}>
                        {project.tech.map((tag) => (
                          <span key={tag}>{tag}</span>
                        ))}
                      </div>
                      <div className={styles.cardActions}>
                        <a href={project.link} target="_blank" rel="noreferrer">Live Demo</a>
                        <a href={project.github} target="_blank" rel="noreferrer">GitHub</a>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className={styles.section} id="cases">
              <SectionTitle
                eyebrow="Case Studies"
                title="Senior-style thinking behind each digital solution."
              />
              <div className={styles.caseGrid}>
                {caseStudies.map((study) => (
                  <article className={styles.caseCard} key={study.title}>
                    <h3>{study.title}</h3>
                    <dl>
                      {Object.entries(study)
                        .filter(([key]) => key !== "title")
                        .map(([key, value]) => (
                          <div key={key}>
                            <dt>{key.replace(/^\w/, (letter) => letter.toUpperCase())}</dt>
                            <dd>{value}</dd>
                          </div>
                        ))}
                    </dl>
                  </article>
                ))}
              </div>
            </section>

            <section className={styles.section} id="experience">
              <SectionTitle
                eyebrow="Experience / Journey"
                title="A clear path through software, backend and digital product practice."
              />
              <div className={styles.timeline}>
                {experience.map(([title, description]) => (
                  <article key={title}>
                    <span />
                    <div>
                      <h3>{title}</h3>
                      <p>{description}</p>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className={styles.section} id="github">
              <SectionTitle
                eyebrow="GitHub"
                title="Public repositories, languages and continuous technical evolution."
              />
              <div className={styles.githubGrid}>
                <Image
                  src="https://github-readme-stats.vercel.app/api?username=giselleandrade1&show_icons=true&theme=midnight-purple&hide_border=true&bg_color=00000000&title_color=8E25FF&icon_color=8E25FF"
                  alt="GitHub stats for Giselle Andrade"
                  width={560}
                  height={220}
                  loading="lazy"
                  unoptimized
                />
                <Image
                  src="https://github-readme-stats.vercel.app/api/top-langs/?username=giselleandrade1&layout=compact&theme=midnight-purple&hide_border=true&bg_color=00000000&title_color=8E25FF"
                  alt="Most used languages on Giselle Andrade GitHub"
                  width={560}
                  height={220}
                  loading="lazy"
                  unoptimized
                />
              </div>
              <div className={styles.repoCloud}>
                {repositories.map((repo) => (
                  <a key={repo} href={`${profile.github}/${repo}`} target="_blank" rel="noreferrer">
                    {repo}
                  </a>
                ))}
              </div>
              <Button href={profile.github} target="_blank" rel="noreferrer" variant="secondary">
                Visit GitHub
              </Button>
            </section>

            <section className={`${styles.section} ${styles.contactSection}`} id="contact">
              <div>
                <SectionTitle
                  eyebrow="Contact"
                  title="Let's create something amazing together."
                  description="I am open to opportunities, collaborations and projects involving software development, backend systems, web applications and digital experiences."
                />
                <div className={styles.contactLinks}>
                  <a href={`mailto:${profile.email}`}>Email: {profile.email}</a>
                  <a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn: linkedin.com/in/giselleandrades2</a>
                  <a href={profile.github} target="_blank" rel="noreferrer">GitHub: github.com/giselleandrade1</a>
                </div>
              </div>
              <ContactForm />
            </section>
          </main>

          <footer className={styles.footer}>
            <span>© {new Date().getFullYear()} Giselle Andrade</span>
            <span>Full Stack Developer • Backend Focus • Digital Product Experience</span>
          </footer>
        </div>
      </div>
    </>
  );
}
