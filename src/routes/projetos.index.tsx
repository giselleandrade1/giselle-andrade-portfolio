import { createFileRoute } from "@tanstack/react-router";
import { Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { flushSync } from "react-dom";

import { ProjectCard } from "@/components/site/ProjectCard";
import { PageHero } from "@/components/site/SectionHeading";
import {
  projectCategories,
  projectTechnologies,
  projects,
  type ProjectCategory,
} from "@/data/projects";
import { filterProjects } from "@/lib/project-filters";

const TITLE = "Projetos — Giselle Andrade";
const DESCRIPTION =
  "Projetos de Giselle Andrade: Full Stack, Frontend, Backend e Sistemas com Java, TypeScript, Node.js e React — código aberto e demos online.";

export const Route = createFileRoute("/projetos/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: "/projetos" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/projetos" }],
  }),
  component: ProjectsPage,
});

type CategoryFilter = ProjectCategory | "Todos";

const chip =
  "inline-flex min-h-10 items-center rounded-full border border-border px-4 text-sm text-muted-foreground transition-colors hover:border-lavender/40 hover:text-foreground aria-pressed:border-lavender/60 aria-pressed:bg-imperial/30 aria-pressed:text-foreground";

function withTransition(update: () => void) {
  const doc = document as Document & { startViewTransition?: (cb: () => void) => unknown };
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (doc.startViewTransition && !reduce) doc.startViewTransition(() => flushSync(update));
  else update();
}

function ProjectsPage() {
  const [category, setCategory] = useState<CategoryFilter>("Todos");
  const [tech, setTech] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const list = useMemo(
    () => filterProjects(projects, { category, tech, query }),
    [category, tech, query],
  );
  const hasFilters = category !== "Todos" || tech !== null || query.trim() !== "";
  const clear = () =>
    withTransition(() => {
      setCategory("Todos");
      setTech(null);
      setQuery("");
    });

  return (
    <>
      <PageHero
        eyebrow="projetos"
        title="Projetos"
        description="Aplicações reais, com tecnologias conferidas no código-fonte de cada repositório."
      />
      <section className="container-page" aria-labelledby="filtros-titulo">
        <h2 id="filtros-titulo" className="sr-only">
          Filtros de projetos
        </h2>
        <div className="glass rounded-2xl p-4 sm:p-5">
          <label className="relative block">
            <span className="sr-only">Buscar projeto por nome ou tecnologia</span>
            <Search
              className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por nome ou tecnologia (ex.: Java, React)"
              className="h-11 w-full rounded-full border border-input bg-background/60 pl-11 pr-4 text-base text-foreground placeholder:text-muted-foreground/80 focus-visible:border-lavender/60 md:text-sm"
            />
          </label>

          <div className="mt-4">
            <p className="eyebrow mb-2">Categoria</p>
            <div role="group" aria-label="Filtrar por categoria" className="flex flex-wrap gap-2">
              {(["Todos", ...projectCategories] as const).map((c) => (
                <button
                  key={c}
                  type="button"
                  aria-pressed={category === c}
                  onClick={() => withTransition(() => setCategory(c))}
                  className={chip}
                >
                  {c}
                  <span className="ml-2 font-mono text-xs text-lavender">
                    {c === "Todos"
                      ? projects.length
                      : projects.filter((p) => p.categories.includes(c)).length}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <p className="eyebrow mb-2">Tecnologia</p>
            <div
              role="group"
              aria-label="Filtrar por tecnologia"
              className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 sm:flex-wrap sm:overflow-visible"
            >
              {projectTechnologies.map((t) => (
                <button
                  key={t}
                  type="button"
                  aria-pressed={tech === t}
                  onClick={() => withTransition(() => setTech(tech === t ? null : t))}
                  className={`${chip} shrink-0 font-mono text-xs`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground" aria-live="polite">
            {list.length === 1 ? "1 projeto encontrado" : `${list.length} projetos encontrados`}
          </p>
          {hasFilters ? (
            <button
              type="button"
              onClick={clear}
              className="inline-flex min-h-9 items-center gap-1.5 rounded-full px-3 text-sm text-lavender transition-colors hover:bg-surface"
            >
              <X className="size-4" aria-hidden /> Limpar filtros
            </button>
          ) : null}
        </div>

        {list.length ? (
          <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {list.map((p) => (
              <div
                key={p.slug}
                className="min-w-0"
                style={{ viewTransitionName: `projeto-${p.slug}` }}
              >
                <ProjectCard project={p} />
              </div>
            ))}
          </div>
        ) : (
          <div className="glass mt-4 rounded-2xl p-10 text-center">
            <p className="font-display text-lg font-semibold">Nenhum projeto com esses filtros</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Tente outra tecnologia ou limpe os filtros para ver todos os projetos.
            </p>
            <button
              type="button"
              onClick={clear}
              className="mt-5 inline-flex min-h-10 items-center rounded-full border border-border px-4 text-sm hover:border-lavender/40"
            >
              Ver todos
            </button>
          </div>
        )}
      </section>
    </>
  );
}
