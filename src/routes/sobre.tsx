import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  Database,
  LayoutTemplate,
  MapPin,
  Server,
  Workflow,
  Wrench,
  type LucideIcon,
} from "lucide-react";

import { PageHero, SectionHeading } from "@/components/site/SectionHeading";
import { Tag } from "@/components/site/Tag";
import { Button } from "@/components/ui/button";
import { languages, profile } from "@/data/profile";
import {
  skillGroups,
  skillLevelLabel,
  softSkills,
  type SkillGroup,
  type SkillLevel,
} from "@/data/skills";

const TITLE = "Sobre — Giselle Andrade";
const DESCRIPTION =
  "Trajetória, competências técnicas e idiomas de Giselle Andrade, Full Stack Developer com foco em backend, Java e TypeScript, em São Paulo.";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "profile" },
      { property: "og:url", content: "/sobre" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/sobre" }],
  }),
  component: About,
});

const icons: Record<SkillGroup["icon"], LucideIcon> = {
  layout: LayoutTemplate,
  server: Server,
  database: Database,
  wrench: Wrench,
  workflow: Workflow,
};

const tone = (l: SkillLevel) =>
  l === "principal" ? "strong" : l === "projetos" ? "default" : "muted";

function About() {
  return (
    <>
      <PageHero eyebrow="sobre mim" title="Tecnologia com visão de negócio" />

      <section className="container-page grid gap-10 lg:grid-cols-[20rem_1fr]">
        <aside data-reveal className="glass h-fit rounded-3xl p-6 lg:sticky lg:top-24">
          <img
            src={profile.photoSmallUrl}
            alt={profile.photoAlt}
            width={240}
            height={240}
            loading="lazy"
            decoding="async"
            className="mx-auto size-40 rounded-full border border-border object-cover shadow-glow"
          />
          <p className="mt-5 text-center font-display text-xl font-semibold">{profile.fullName}</p>
          <p className="text-center text-sm text-muted-foreground">{profile.role}</p>
          <p className="mt-1 text-center font-mono text-xs text-lavender">
            {profile.headline.join(" · ")}
          </p>
          <p className="mt-6 flex items-start gap-2 border-t border-border pt-5 text-sm">
            <MapPin className="mt-0.5 size-4 shrink-0 text-lavender" aria-hidden />
            <span>
              {profile.location}
              <span className="block text-muted-foreground">{profile.workModes}</span>
            </span>
          </p>
          <dl className="mt-4 space-y-3 text-sm">
            {languages.map((l) => (
              <div key={l.name} className="flex justify-between gap-4">
                <dt className="text-muted-foreground">{l.name}</dt>
                <dd className="font-mono text-xs text-lavender">{l.level}</dd>
              </div>
            ))}
          </dl>
        </aside>

        <div className="space-y-6 text-base text-muted-foreground sm:text-lg">
          <p data-reveal>
            Estudo <strong className="font-medium text-foreground">Ciência da Computação</strong> e{" "}
            <strong className="font-medium text-foreground">
              Análise e Desenvolvimento de Sistemas
            </strong>{" "}
            e, desde 2024, desenvolvo sites como freelancer — do levantamento de requisitos e da
            conversa com o cliente até a organização e a entrega do projeto.
          </p>
          <p data-reveal>
            Hoje desenvolvo e evoluo o site institucional da{" "}
            <strong className="font-medium text-foreground">Control Consultoria</strong>, com tema
            claro e escuro, menu responsivo, FAQ interativo, validação de formulários com integração
            ao WhatsApp e atenção a acessibilidade, SEO e versionamento com Git e GitHub.
          </p>
          <p data-reveal>
            Também atuei em administração, recrutamento e departamento pessoal. Essa vivência me
            ensinou a organizar processos, tratar informações com responsabilidade e entender o
            problema de negócio antes de escrever a primeira linha de código.
          </p>
          <p data-reveal>
            Meu foco agora é crescer como desenvolvedora Full Stack com ênfase em{" "}
            <strong className="font-medium text-foreground">backend</strong>: Java e Spring Boot,
            JavaScript e TypeScript com Node.js, APIs REST e integração de sistemas, bancos de dados
            SQL e arquitetura de software. Também me interesso por dados e por soluções inteligentes
            que ajudem pessoas a decidir melhor.
          </p>
          <div data-reveal className="glass rounded-2xl p-6">
            <p className="eyebrow">Oportunidades que busco</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {profile.lookingFor.map((r) => (
                <li key={r}>
                  <Tag tone="strong" className="px-3 py-1.5 text-xs">
                    {r}
                  </Tag>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="container-page mt-24">
        <SectionHeading
          eyebrow="competências"
          title="Stack e ferramentas"
          description="Sem porcentagens: cada tecnologia está classificada pelo uso real."
        />
        <ul className="mt-6 flex flex-wrap gap-2" aria-label="Legenda">
          {(Object.entries(skillLevelLabel) as [SkillLevel, string][]).map(([k, v]) => (
            <li key={k}>
              <Tag tone={tone(k)}>{v}</Tag>
            </li>
          ))}
        </ul>
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-6">
          {skillGroups.map((g, i) => {
            const Icon = icons[g.icon];
            return (
              <article
                key={g.id}
                data-reveal
                className={`glass card-interactive rounded-2xl p-6 ${i < 3 ? "lg:col-span-2" : "lg:col-span-3"}`}
              >
                <div className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-xl bg-imperial/50 text-lilac">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <h3 className="text-lg font-semibold">{g.title}</h3>
                </div>
                <ul className="mt-5 flex flex-wrap gap-1.5">
                  {g.skills.map((s) => (
                    <li key={s.name}>
                      <Tag tone={tone(s.level)}>{s.name}</Tag>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </section>

      <section className="container-page mt-24">
        <SectionHeading eyebrow="comportamentais" title="Como colaboro em equipe" />
        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {softSkills.map((s) => (
            <li key={s} data-reveal className="glass rounded-xl px-5 py-4 text-sm">
              <span aria-hidden className="mr-2 font-mono text-lavender">
                ›
              </span>
              {s}
            </li>
          ))}
        </ul>
        <div className="mt-12 flex flex-wrap gap-3">
          <Button asChild variant="hero">
            <Link to="/projetos">
              Ver projetos <ArrowRight aria-hidden />
            </Link>
          </Button>
          <Button asChild variant="glass">
            <Link to="/formacao">Formação e cursos</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
