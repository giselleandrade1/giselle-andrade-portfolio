import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { flushSync } from "react-dom";

import { ProjectCard } from "@/components/site/ProjectCard";
import { PageHero } from "@/components/site/SectionHeading";
import { projectCategories, projects, type ProjectCategory } from "@/data/projects";

export const Route = createFileRoute("/projetos/")({
  head: () => ({
    meta: [
      { title: "Projetos — Giselle Andrade" },
      {
        name: "description",
        content:
          "Projetos verificados de Giselle Andrade: Full Stack, Frontend, Backend e Sistemas, com demos online.",
      },
      { property: "og:title", content: "Projetos — Giselle Andrade" },
      {
        property: "og:description",
        content:
          "Projetos verificados de Giselle Andrade: Full Stack, Frontend, Backend e Sistemas, com demos online.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProjectsPage,
});

function ProjectsPage() {
  const [filter, setFilter] = useState<ProjectCategory | "Todos">("Todos");
  const changeFilter = (c: ProjectCategory | "Todos") => {
    const doc = document as Document & { startViewTransition?: (cb: () => void) => unknown };
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (doc.startViewTransition && !reduce)
      doc.startViewTransition(() => flushSync(() => setFilter(c)));
    else setFilter(c);
  };
  const list =
    filter === "Todos" ? projects : projects.filter((p) => p.categories.includes(filter));
  return (
    <>
      <PageHero
        eyebrow="projetos"
        title="Projetos"
        description="Tecnologias conferidas no código-fonte de cada repositório."
      />
      <section className="container-page">
        <div role="group" aria-label="Filtrar por categoria" className="flex flex-wrap gap-2">
          {(["Todos", ...projectCategories] as const).map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={filter === c}
              onClick={() => changeFilter(c)}
              className="rounded-full border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground aria-pressed:border-lavender/60 aria-pressed:bg-imperial/40 aria-pressed:text-foreground"
            >
              {c}{" "}
              <span className="ml-1 font-mono text-xs text-lavender">
                {c === "Todos"
                  ? projects.length
                  : projects.filter((p) => p.categories.includes(c)).length}
              </span>
            </button>
          ))}
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => (
            <div key={p.slug} style={{ viewTransitionName: `projeto-${p.slug}` }}>
              <ProjectCard project={p} />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
