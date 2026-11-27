import { Link } from "@tanstack/react-router";
import { ArrowUpRight, ExternalLink, Github, Lock, TriangleAlert } from "lucide-react";

import { demoUrl, type Project } from "@/data/projects";

import { Tag } from "./Tag";

export function ProjectVisual({
  project,
  className,
  priority = false,
}: {
  project: Project;
  className?: string;
  priority?: boolean;
}) {
  if (project.image) {
    return (
      <img
        src={project.image}
        alt={`Tela real da aplicação ${project.name} em funcionamento`}
        width={1280}
        height={800}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        className={className}
      />
    );
  }
  // No screenshot available: a code-window visual instead of a fake screenshot.
  return (
    <div
      role="img"
      aria-label={`${project.name}: representação visual da stack do projeto`}
      className={`bg-surface-2 relative flex flex-col overflow-hidden font-mono ${className ?? ""}`}
    >
      <div aria-hidden className="bg-aurora absolute inset-0 opacity-80" />
      <div
        aria-hidden
        className="relative flex items-center gap-1.5 border-b border-border bg-background/40 px-4 py-2.5"
      >
        <span className="size-2.5 rounded-full bg-imperial" />
        <span className="size-2.5 rounded-full bg-primary" />
        <span className="size-2.5 rounded-full bg-vibrant" />
        <span className="ml-3 truncate text-[0.7rem] text-muted-foreground">
          {project.slug}/stack.ts
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

export function DemoStatusTag({ project, className }: { project: Project; className?: string }) {
  const { demo } = project;
  if (demo.status === "online")
    return (
      <Tag tone="success" className={className}>
        <span className="animate-pulse-dot size-1.5 rounded-full bg-success" aria-hidden /> Demo
        online
      </Tag>
    );
  if (demo.status === "unavailable")
    return (
      <Tag tone="warning" className={className}>
        <TriangleAlert className="size-3" aria-hidden /> Demo indisponível
      </Tag>
    );
  return (
    <Tag tone="muted" className={className}>
      Somente código
    </Tag>
  );
}

const MAX_TAGS = 4;

export function ProjectCard({ project }: { project: Project }) {
  const live = demoUrl(project.demo);
  return (
    <article
      data-reveal
      className="glass card-interactive group relative flex h-full min-w-0 flex-col overflow-hidden rounded-2xl"
    >
      <div className="relative aspect-[16/10] overflow-hidden border-b border-border">
        <ProjectVisual
          project={project}
          className="h-full w-full object-cover object-top transition-transform duration-700 ease-[var(--ease-smooth)] group-hover:scale-[1.04]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-background/80 to-transparent"
        />
        <div className="absolute bottom-3 left-3">
          <DemoStatusTag project={project} className="bg-background/85 backdrop-blur" />
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="eyebrow">{project.categories.join(" · ")}</p>
        <h3 className="mt-2 text-xl font-semibold leading-tight">
          <Link
            to="/projetos/$slug"
            params={{ slug: project.slug }}
            className="after:absolute after:inset-0 after:z-[2] after:content-[''] focus-visible:outline-none"
          >
            {project.name}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{project.tagline}</p>
        <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Tecnologias">
          {project.stack.slice(0, MAX_TAGS).map((s) => (
            <li key={s}>
              <Tag>{s}</Tag>
            </li>
          ))}
          {project.stack.length > MAX_TAGS ? (
            <li>
              <Tag tone="muted">+{project.stack.length - MAX_TAGS}</Tag>
            </li>
          ) : null}
        </ul>
        <div className="relative z-[3] mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border pt-4 text-sm">
          <span className="pointer-events-none inline-flex items-center gap-1 font-medium text-lilac">
            Detalhes
            <ArrowUpRight
              className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              aria-hidden
            />
          </span>
          <div className="-mr-3 ml-auto flex flex-wrap items-center justify-end gap-1">
            {live ? (
              <a
                href={live}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-9 items-center gap-1.5 rounded-full px-3 text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
              >
                <ExternalLink className="size-4" aria-hidden /> Demo
                <span className="sr-only"> de {project.name} (abre em nova aba)</span>
              </a>
            ) : null}
            {project.repo ? (
              <a
                href={project.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-9 items-center gap-1.5 rounded-full px-3 text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
              >
                <Github className="size-4" aria-hidden /> Código
                <span className="sr-only"> de {project.name} (abre em nova aba)</span>
              </a>
            ) : (
              <span className="inline-flex min-h-9 items-center gap-1.5 px-3 text-xs text-muted-foreground">
                <Lock className="size-3.5" aria-hidden /> Código privado
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
