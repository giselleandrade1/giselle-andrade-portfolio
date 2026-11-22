import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Code2, Github } from "lucide-react";

import type { Project } from "@/data/projects";

import { Tag } from "./Tag";

export function ProjectVisual({ project, className }: { project: Project; className?: string }) {
  if (project.image) {
    return (
      <img
        src={project.image}
        alt={`Tela real da aplicação ${project.name} em funcionamento`}
        width={1280}
        height={800}
        loading="lazy"
        decoding="async"
        className={className}
      />
    );
  }
  // No public deployment: a code-window visual instead of a fake screenshot.
  return (
    <div
      role="img"
      aria-label={`${project.name}: projeto sem demonstração publicada, veja o código-fonte`}
      className={`bg-surface-2 relative flex flex-col overflow-hidden font-mono ${className ?? ""}`}
    >
      <div aria-hidden className="bg-aurora absolute inset-0 opacity-80" />
      <div
        aria-hidden
        className="relative flex items-center gap-1.5 border-b border-border bg-background/40 px-4 py-2.5"
      >
        <span className="size-2.5 rounded-full bg-imperial" />
        <span className="size-2.5 rounded-full bg-primary" />
        <span className="size-2.5 rounded-full bg-lavender" />
        <span className="ml-3 truncate text-[0.7rem] text-muted-foreground">
          {project.repo.split("/").pop()}/README.md
        </span>
      </div>
      <div
        aria-hidden
        className="relative flex flex-1 flex-col justify-center gap-1.5 px-6 text-xs sm:text-sm"
      >
        <p className="text-muted-foreground">{"// stack verificada no código"}</p>
        <p>
          <span className="text-lavender">const</span>{" "}
          <span className="text-foreground">stack</span> = [
        </p>
        {project.stack.slice(0, 4).map((s) => (
          <p key={s} className="pl-5 text-lilac">
            "{s}",
          </p>
        ))}
        <p>];</p>
      </div>
    </div>
  );
}

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article
      data-reveal
      className="glass card-interactive group relative flex h-full flex-col overflow-hidden rounded-2xl"
    >
      <div className="relative aspect-[16/10] overflow-hidden border-b border-border">
        <ProjectVisual
          project={project}
          className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
        />
        <div className="absolute bottom-3 right-3 flex flex-wrap gap-1.5">
          {project.demo.status === "online" ? (
            <Tag tone="success" className="bg-background/85 backdrop-blur">
              <span className="animate-pulse-dot size-1.5 rounded-full bg-success" aria-hidden />{" "}
              Demo online
            </Tag>
          ) : (
            <Tag tone="muted" className="bg-background/85 backdrop-blur">
              Somente código
            </Tag>
          )}
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="eyebrow">{project.categories.join(" · ")}</p>
        <h3 className="mt-2 text-xl font-semibold">
          <Link
            to="/projetos/$slug"
            params={{ slug: project.slug }}
            className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
          >
            {project.name}
          </Link>
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">{project.tagline}</p>
        <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Tecnologias">
          {project.stack.slice(0, 5).map((s) => (
            <li key={s}>
              <Tag>{s}</Tag>
            </li>
          ))}
          {project.stack.length > 5 ? (
            <li>
              <Tag tone="muted">+{project.stack.length - 5}</Tag>
            </li>
          ) : null}
        </ul>
        <div className="relative z-10 mt-auto flex flex-wrap items-center gap-4 pt-6 text-sm">
          <span className="inline-flex items-center gap-1 font-medium text-lilac">
            Ver detalhes{" "}
            <ArrowUpRight
              className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              aria-hidden
            />
          </span>
          <a
            href={project.repo}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground"
          >
            <Github className="size-4" aria-hidden /> Código
            <span className="sr-only"> de {project.name} (abre em nova aba)</span>
          </a>
        </div>
      </div>
    </article>
  );
}
