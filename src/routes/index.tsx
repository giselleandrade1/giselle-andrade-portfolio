import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  Briefcase,
  Database,
  FileDown,
  Github,
  GraduationCap,
  Languages,
  LayoutTemplate,
  Linkedin,
  MapPin,
  Send,
  Users,
} from "lucide-react";

import { ProfilePortrait } from "@/components/site/ProfilePortrait";
import { ProjectCard } from "@/components/site/ProjectCard";
import { SectionHeading } from "@/components/site/SectionHeading";
import { Terminal } from "@/components/site/Terminal";
import { Typewriter } from "@/components/site/Typewriter";
import { Tag } from "@/components/site/Tag";
import { Button } from "@/components/ui/button";
import { experiences } from "@/data/experience";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";

const TITLE = "Giselle Andrade — Desenvolvedora Full Stack Júnior";
const DESCRIPTION =
  "Desenvolvedora Full Stack Júnior em São Paulo: JavaScript, Node.js, Java e SQL. Projetos reais com demos online.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const marqueeStack = [
  "JavaScript",
  "Node.js",
  "Java",
  "SQL",
  "TypeScript",
  "React",
  "Next.js",
  "Spring Boot",
  "Express",
  "HTML5",
  "CSS3",
  "Tailwind CSS",
  "PostgreSQL",
  "Git & GitHub",
];

const pillars = [
  {
    Icon: LayoutTemplate,
    title: "Interfaces responsivas e acessíveis",
    text: "HTML semântico, responsividade, acessibilidade e SEO aplicados em sites reais, como o da Control Consultoria.",
  },
  {
    Icon: Database,
    title: "Backend e dados",
    text: "APIs com Node.js e Express, sistemas em Java com Spring Boot e modelagem com SQL e bancos relacionais.",
  },
  {
    Icon: Users,
    title: "Processos e pessoas",
    text: "Vivência em administração, recrutamento e departamento pessoal para entender o problema de negócio antes do código.",
  },
];

function Index() {
  const featured = projects.filter((p) => p.featured);
  const currentTech = experiences.filter((e) => e.kind === "tecnologia");

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div aria-hidden className="bg-aurora pointer-events-none absolute inset-0" />
        <div aria-hidden className="bg-grid pointer-events-none absolute inset-0" />
        <div aria-hidden className="orb animate-drift left-[-6rem] top-24 size-72 bg-imperial/40" />
        <div
          aria-hidden
          className="orb animate-drift right-[-4rem] top-10 size-80 bg-primary/20"
          style={{ animationDelay: "-6s" }}
        />
        <div
          aria-hidden
          className="orb animate-drift bottom-0 left-1/3 size-64 bg-lavender/10"
          style={{ animationDelay: "-12s" }}
        />
        <div className="container-page relative grid items-center gap-14 pb-16 pt-12 sm:pt-20 lg:grid-cols-[1.2fr_1fr] lg:pb-24">
          <div className="animate-reveal order-2 lg:order-1">
            <Tag tone="success">
              <span className="animate-pulse-dot size-1.5 rounded-full bg-success" aria-hidden />
              {profile.availability}
            </Tag>
            <h1 className="mt-6 text-5xl font-bold leading-[1.02] sm:text-6xl lg:text-7xl">
              <span className="text-gradient animate-shimmer">{profile.name}</span>
            </h1>
            <p className="mt-5 font-display text-xl font-medium text-lilac sm:text-2xl">
              {profile.role}
            </p>
            <p className="mt-3 font-mono text-sm text-muted-foreground sm:text-base">
              <span className="text-success">❯</span> construindo com{" "}
              <Typewriter
                words={[
                  "JavaScript",
                  "Node.js",
                  "Java",
                  "SQL",
                  "TypeScript",
                  "React",
                  "Spring Boot",
                ]}
                className="text-lavender"
              />
            </p>
            <p className="mt-6 max-w-xl text-base text-muted-foreground sm:text-lg">
              {profile.intro}
            </p>
            <p className="mt-5 inline-flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="size-4 text-lavender" aria-hidden /> {profile.location} ·{" "}
              {profile.workModes}
            </p>
            <div className="mt-8 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
              <Button
                asChild
                variant="hero"
                size="lg"
                className="col-span-2 sm:col-span-1"
                data-magnetic
              >
                <Link to="/projetos">
                  Ver projetos <ArrowRight aria-hidden />
                </Link>
              </Button>
              <Button asChild variant="glass" size="lg" data-magnetic>
                <a href={profile.cvUrl} download={profile.cvFileName}>
                  <FileDown aria-hidden /> Currículo
                </a>
              </Button>
              <Button asChild variant="glass" size="lg" data-magnetic>
                <Link to="/contato">
                  <Send aria-hidden /> Contato
                </Link>
              </Button>
            </div>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm">
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-lilac"
              >
                <Github className="size-4" aria-hidden /> github.com/{profile.githubHandle}
              </a>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-lilac"
              >
                <Linkedin className="size-4" aria-hidden /> in/{profile.linkedinHandle}
              </a>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <ProfilePortrait />
          </div>
        </div>
      </section>

      {/* Stack marquee */}
      <section aria-label="Tecnologias" className="border-y border-border/60 bg-surface-2/40 py-5">
        <div className="mask-fade-x overflow-hidden">
          <ul className="animate-marquee flex w-max gap-3 hover:[animation-play-state:paused]">
            {[...marqueeStack, ...marqueeStack].map((t, i) => (
              <li key={`${t}-${i}`} aria-hidden={i >= marqueeStack.length}>
                <Tag className="px-3.5 py-2 text-xs">{t}</Tag>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Snapshot */}
      <section className="container-page py-16 sm:py-20">
        <ul className="grid gap-4 md:grid-cols-3">
          {[
            {
              Icon: Briefcase,
              label: "Atualmente",
              title: "Desenvolvedora Web",
              text: "Control Consultoria · desde jan/2026",
            },
            {
              Icon: GraduationCap,
              label: "Formação",
              title: "Ciência da Computação e ADS",
              text: "São Judas e UNG · em andamento",
            },
            {
              Icon: Languages,
              label: "Idiomas",
              title: "Português e Inglês",
              text: "Nativo · Inglês profissional · Espanhol iniciante",
            },
          ].map(({ Icon, label, title, text }) => (
            <li key={label} data-reveal className="glass card-interactive rounded-2xl p-6">
              <span className="grid size-10 place-items-center rounded-xl bg-imperial/50 text-lilac">
                <Icon className="size-5" aria-hidden />
              </span>
              <p className="eyebrow mt-5">{label}</p>
              <p className="mt-1 font-display text-lg font-semibold">{title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{text}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Pillars */}
      <section className="container-page">
        <SectionHeading
          eyebrow="como eu trabalho"
          title={
            <>
              Código com <span className="text-gradient">leitura de negócio</span>
            </>
          }
          description="Uno a base técnica com a experiência em processos administrativos para construir soluções que fazem sentido para quem usa."
        />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {pillars.map(({ Icon, title, text }, i) => (
            <article
              key={title}
              data-reveal
              className="glass card-interactive overflow-hidden rounded-2xl p-6"
            >
              <span
                aria-hidden
                className="absolute right-5 top-4 font-mono text-4xl font-semibold text-imperial/60"
              >
                0{i + 1}
              </span>
              <Icon className="size-6 text-lavender" aria-hidden />
              <h3 className="mt-5 text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Interactive terminal */}
      <section className="container-page pt-20">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.3fr]">
          <SectionHeading
            eyebrow="modo dev"
            title={
              <>
                Explore pelo <span className="text-gradient">terminal</span>
              </>
            }
            description="Digite comandos como help, stack ou projetos — ou use Ctrl + K para buscar qualquer página do portfólio."
          />
          <div data-reveal>
            <Terminal />
          </div>
        </div>
      </section>

      {/* Featured projects */}
      <section className="container-page py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            eyebrow="projetos em destaque"
            title="Trabalhos reais, com código aberto"
          />
          <Button asChild variant="link">
            <Link to="/projetos">
              Todos os projetos <ArrowRight aria-hidden />
            </Link>
          </Button>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
      </section>

      {/* Experience preview */}
      <section className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading eyebrow="experiência" title="Desenvolvimento na prática" />
          <Button asChild variant="link">
            <Link to="/experiencia">
              Trajetória completa <ArrowRight aria-hidden />
            </Link>
          </Button>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {currentTech.map((e) => (
            <article key={e.id} data-reveal className="glass card-interactive rounded-2xl p-6">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-mono text-xs text-lavender">{e.period}</p>
                {e.end === null ? <Tag tone="success">Atual</Tag> : null}
              </div>
              <h3 className="mt-3 text-xl font-semibold">{e.role}</h3>
              <p className="text-sm text-muted-foreground">{e.company}</p>
              <p className="mt-4 text-sm text-muted-foreground">{e.summary}</p>
              <ul className="mt-4 flex flex-wrap gap-1.5">
                {e.tags.map((t) => (
                  <li key={t}>
                    <Tag>{t}</Tag>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container-page pt-20">
        <div
          data-reveal
          className="relative overflow-hidden rounded-3xl border border-border p-8 sm:p-12"
        >
          <div aria-hidden className="bg-brand absolute inset-0 opacity-25" />
          <div aria-hidden className="bg-grid absolute inset-0" />
          <div className="relative max-w-2xl">
            <p className="eyebrow">{"// próximos passos"}</p>
            <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">
              Vamos construir algo juntos?
            </h2>
            <p className="mt-4 text-muted-foreground sm:text-lg">
              Estou aberta a estágio, vagas júnior e novos projetos. Respondo pelo e-mail ou
              WhatsApp.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="hero" size="lg" data-magnetic>
                <Link to="/contato">
                  <Send aria-hidden /> Entrar em contato
                </Link>
              </Button>
              <Button asChild variant="glass" size="lg" data-magnetic>
                <a href={profile.cvUrl} download={profile.cvFileName}>
                  <FileDown aria-hidden /> Baixar currículo
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
