import { useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";

import { courses, education } from "@/data/education";
import { experiences } from "@/data/experience";
import { languages, profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { skillGroups } from "@/data/skills";

type Line = { id: number; kind: "in" | "out"; content: ReactNode };

const PAGES = {
  inicio: "/",
  sobre: "/sobre",
  experiencia: "/experiencia",
  projetos: "/projetos",
  formacao: "/formacao",
  contato: "/contato",
} as const;

const QUICK = ["help", "sobre", "stack", "projetos", "contato", "sudo contratar"];

const normalize = (s: string) =>
  s
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

export function Terminal() {
  const navigate = useNavigate();
  const idRef = useRef(1);
  const [lines, setLines] = useState<Line[]>([
    {
      id: 0,
      kind: "out",
      content: (
        <>
          Bem-vindo(a) ao terminal da Giselle. Digite <Cmd>help</Cmd> ou toque em um comando abaixo.
        </>
      ),
    },
  ]);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [cursor, setCursor] = useState(-1);
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  const respond = (raw: string): ReactNode | "clear" => {
    const cmd = normalize(raw);
    const [head, ...rest] = cmd.split(/\s+/);
    switch (head) {
      case "help":
      case "ajuda":
        return (
          <ul className="grid gap-0.5 sm:grid-cols-2">
            {[
              ["sobre", "quem sou eu"],
              ["stack", "tecnologias principais"],
              ["projetos", "projetos verificados"],
              ["experiencia", "trajetória profissional"],
              ["formacao", "cursos e graduação"],
              ["idiomas", "níveis de idioma"],
              ["contato", "como falar comigo"],
              ["cv", "baixar currículo"],
              ["ir <pagina>", "navegar pelo site"],
              ["clear", "limpar o terminal"],
            ].map(([c, d]) => (
              <li key={c}>
                <Cmd>{c}</Cmd> <span className="text-muted-foreground">— {d}</span>
              </li>
            ))}
          </ul>
        );
      case "sobre":
      case "whoami":
        return `${profile.name} · ${profile.role} · ${profile.location}. ${profile.intro}`;
      case "stack":
        return (
          <div className="space-y-1">
            {skillGroups.slice(0, 3).map((g) => (
              <p key={g.id}>
                <span className="text-lavender">{g.title}:</span>{" "}
                {g.skills
                  .filter((s) => s.level !== "aprendendo")
                  .map((s) => s.name)
                  .join(", ")}
              </p>
            ))}
          </div>
        );
      case "projetos":
      case "ls":
        return (
          <ul className="space-y-0.5">
            {projects.map((p) => (
              <li key={p.slug}>
                <span
                  className={p.demo.status === "online" ? "text-success" : "text-muted-foreground"}
                >
                  {p.demo.status === "online"
                    ? "● demo"
                    : p.demo.status === "unavailable"
                      ? "◌ demo fora do ar"
                      : "○ código"}
                </span>{" "}
                <span className="text-foreground">{p.name}</span>{" "}
                <span className="text-muted-foreground">— {p.stack.slice(0, 3).join(", ")}</span>
              </li>
            ))}
          </ul>
        );
      case "experiencia":
        return (
          <ul className="space-y-0.5">
            {experiences.map((e) => (
              <li key={e.id}>
                <span className="text-lavender">{e.period}</span> {e.role} · {e.company}
              </li>
            ))}
          </ul>
        );
      case "formacao":
        return (
          <ul className="space-y-0.5">
            {education.map((e) => (
              <li key={e.id}>
                {e.course} · {e.institution} <span className="text-lavender">({e.status})</span>
              </li>
            ))}
            <li className="text-muted-foreground">+ {courses.length} cursos complementares</li>
          </ul>
        );
      case "idiomas":
        return languages.map((l) => `${l.name}: ${l.level}`).join(" · ");
      case "contato":
        return (
          <div className="space-y-0.5">
            <p>
              e-mail:{" "}
              <a className="text-lilac underline" href={`mailto:${profile.email}`}>
                {profile.email}
              </a>
            </p>
            <p>
              github:{" "}
              <a
                className="text-lilac underline"
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                {profile.githubHandle}
              </a>
            </p>
            <p>
              linkedin:{" "}
              <a
                className="text-lilac underline"
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                {profile.linkedinHandle}
              </a>
            </p>
          </div>
        );
      case "cv":
      case "curriculo": {
        const a = document.createElement("a");
        a.href = profile.cvUrl;
        a.download = profile.cvFileName;
        a.click();
        return "Baixando currículo…";
      }
      case "ir":
      case "cd": {
        const page = rest[0] as keyof typeof PAGES | undefined;
        if (page && page in PAGES) {
          window.setTimeout(() => navigate({ to: PAGES[page] }), 350);
          return `Abrindo /${page === "inicio" ? "" : page}…`;
        }
        return `Páginas: ${Object.keys(PAGES).join(", ")}`;
      }
      case "sudo":
        if (rest.join(" ").startsWith("contratar")) {
          window.setTimeout(() => navigate({ to: "/contato" }), 900);
          return (
            <span className="text-success">Permissão concedida ✨ Levando você até o contato…</span>
          );
        }
        return "Tente: sudo contratar";
      case "clear":
      case "limpar":
        return "clear";
      case "":
        return null;
      default:
        return (
          <>
            Comando não encontrado: <span className="text-destructive">{raw}</span>. Digite{" "}
            <Cmd>help</Cmd>.
          </>
        );
    }
  };

  const execute = (raw: string) => {
    const out = respond(raw);
    if (out === "clear") {
      setLines([]);
    } else {
      const next: Line[] = [{ id: idRef.current++, kind: "in", content: raw }];
      if (out !== null) next.push({ id: idRef.current++, kind: "out", content: out });
      setLines((l) => [...l, ...next]);
    }
    if (raw.trim()) setHistory((h) => [raw, ...h].slice(0, 30));
    setCursor(-1);
    setValue("");
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") execute(value);
    else if (e.key === "ArrowUp") {
      e.preventDefault();
      const c = Math.min(cursor + 1, history.length - 1);
      if (history[c] !== undefined) {
        setCursor(c);
        setValue(history[c]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const c = cursor - 1;
      setCursor(Math.max(c, -1));
      setValue(c >= 0 ? (history[c] ?? "") : "");
    }
  };

  return (
    <div className="glass overflow-hidden rounded-2xl font-mono text-[0.8rem] shadow-glow sm:text-sm">
      <div className="flex items-center gap-1.5 border-b border-border bg-background/50 px-4 py-3">
        <span className="size-3 rounded-full bg-imperial" aria-hidden />
        <span className="size-3 rounded-full bg-primary" aria-hidden />
        <span className="size-3 rounded-full bg-lavender" aria-hidden />
        <span className="ml-3 text-xs text-muted-foreground">giselle@portfolio: ~</span>
      </div>
      <div
        ref={bodyRef}
        onClick={() => inputRef.current?.focus()}
        className="h-80 space-y-2 overflow-y-auto p-4 sm:p-5"
        role="log"
        aria-live="polite"
        aria-label="Saída do terminal"
      >
        {lines.map((l) =>
          l.kind === "in" ? (
            <p key={l.id}>
              <Prompt /> <span className="text-foreground">{l.content}</span>
            </p>
          ) : (
            <div key={l.id} className="animate-reveal text-lilac/90">
              {l.content}
            </div>
          ),
        )}
        <label className="flex items-center gap-2">
          <Prompt />
          <span className="sr-only">Digite um comando</span>
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onKeyDown}
            spellCheck={false}
            autoComplete="off"
            autoCapitalize="off"
            enterKeyHint="send"
            className="min-w-0 flex-1 bg-transparent text-base text-foreground caret-lavender outline-none sm:text-sm"
            placeholder="digite help"
          />
        </label>
      </div>
      <div className="flex flex-wrap gap-2 border-t border-border bg-background/40 px-4 py-3">
        {QUICK.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => execute(c)}
            className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-lavender/50 hover:text-lilac"
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}

function Prompt() {
  return (
    <span aria-hidden className="shrink-0 text-success">
      ❯
    </span>
  );
}

function Cmd({ children }: { children: ReactNode }) {
  return <span className="rounded bg-imperial/50 px-1.5 py-0.5 text-lilac">{children}</span>;
}
