import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { ArrowLeft, ExternalLink, Github, Play } from "lucide-react";
import { useState } from "react";

import { ProjectVisual } from "@/components/site/ProjectCard";
import { Tag } from "@/components/site/Tag";
import { Button } from "@/components/ui/button";
import { getProject } from "@/data/projects";

export const Route = createFileRoute("/projetos/$slug")({
  loader: ({ params }) => {
    const project = getProject(params.slug);
    if (!project) throw notFound();
    return { slug: project.slug, name: project.name, description: project.description };
  },
  head: ({ loaderData }) => {
    const title = loaderData
      ? `${loaderData.name} — Projetos de Giselle Andrade`
      : "Projeto não encontrado";
    const description = loaderData?.description ?? "Projeto não encontrado.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
        ...(loaderData ? [] : [{ name: "robots", content: "noindex" }]),
      ],
    };
  },
  component: ProjectPage,
});

function ProjectPage() {
  const { slug } = Route.useLoaderData();
  const project = getProject(slug)!;
  const [preview, setPreview] = useState(false);
  const demo = project.demo;

  return (
    <article className="container-page pt-10">
      <Link
        to="/projetos"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-lilac"
      >
        <ArrowLeft className="size-4" aria-hidden /> Projetos
      </Link>
      <p className="eyebrow mt-6">{project.categories.join(" · ")}</p>
      <h1 className="mt-2 text-4xl font-bold sm:text-5xl">{project.name}</h1>
      <p className="mt-4 max-w-2xl text-muted-foreground sm:text-lg">{project.description}</p>
      <div className="mt-6 flex flex-wrap gap-3">
        {demo.status === "online" ? (
          <Button asChild variant="hero">
            <a href={demo.url} target="_blank" rel="noopener noreferrer">
              <ExternalLink aria-hidden /> Live Demo
            </a>
          </Button>
        ) : null}
        <Button asChild variant="glass">
          <a href={project.repo} target="_blank" rel="noopener noreferrer">
            <Github aria-hidden /> Código-fonte
          </a>
        </Button>
      </div>
      {demo.status === "online" && demo.note ? (
        <p className="mt-3 text-sm text-muted-foreground">{demo.note}</p>
      ) : null}
      {demo.status === "offline" ? (
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground">{demo.reason}</p>
      ) : null}

      <div className="glass mt-10 overflow-hidden rounded-2xl">
        {demo.status === "online" && demo.embeddable && preview ? (
          <iframe
            src={demo.url}
            title={`Prévia interativa de ${project.name}`}
            className="aspect-[16/10] w-full bg-background"
            loading="lazy"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          />
        ) : (
          <div className="relative">
            <ProjectVisual
              project={project}
              className={`w-full object-cover object-top ${project.image ? "aspect-[16/10]" : "aspect-[16/10] sm:aspect-[16/7]"}`}
            />
            {demo.status === "online" && demo.embeddable ? (
              <div className="absolute inset-0 grid place-items-center bg-background/40">
                <Button variant="hero" onClick={() => setPreview(true)}>
                  <Play aria-hidden /> Carregar prévia interativa
                </Button>
              </div>
            ) : null}
          </div>
        )}
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        <section className="glass rounded-2xl p-6">
          <h2 className="text-xl font-semibold">Problema</h2>
          <p className="mt-3 text-muted-foreground">{project.problem}</p>
          <h2 className="mt-6 text-xl font-semibold">Tecnologias</h2>
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {project.stack.map((s) => (
              <li key={s}>
                <Tag>{s}</Tag>
              </li>
            ))}
          </ul>
        </section>
        <section className="glass rounded-2xl p-6">
          <h2 className="text-xl font-semibold">Funcionalidades verificadas</h2>
          <ul className="mt-3 list-disc space-y-1.5 pl-5 text-muted-foreground">
            {project.features.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          {project.notes.length ? (
            <>
              <h2 className="mt-6 text-xl font-semibold">Observações</h2>
              <ul className="mt-3 list-disc space-y-1.5 pl-5 text-muted-foreground">
                {project.notes.map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ul>
            </>
          ) : null}
        </section>
      </div>
    </article>
  );
}
