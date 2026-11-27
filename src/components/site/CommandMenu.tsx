import { useNavigate } from "@tanstack/react-router";
import { Copy, FileDown, FolderGit2, Github, Linkedin, Mail, Navigation } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";

import { dictionaries } from "@/i18n/ui";

import { navItems } from "./nav";

const OPEN_EVENT = "open-command-menu";

export function openCommandMenu() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

export async function copyEmail() {
  try {
    await navigator.clipboard.writeText(profile.email);
    toast.success("E-mail copiado", { description: profile.email });
  } catch {
    toast.error("Não foi possível copiar", { description: profile.email });
  }
}

export function CommandMenu() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_EVENT, onOpen);
    };
  }, []);

  const run = (fn: () => void) => {
    setOpen(false);
    fn();
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Buscar páginas, projetos ou ações…" />
      <CommandList>
        <CommandEmpty>Nada encontrado.</CommandEmpty>
        <CommandGroup heading="Páginas">
          {navItems.map((item) => (
            <CommandItem
              key={item.to}
              value={`pagina ${dictionaries["pt-BR"].nav[item.to]}`}
              onSelect={() => run(() => navigate({ to: item.to }))}
            >
              <Navigation aria-hidden /> {dictionaries["pt-BR"].nav[item.to]}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Projetos">
          {projects.map((p) => (
            <CommandItem
              key={p.slug}
              value={`projeto ${p.name} ${p.stack.join(" ")}`}
              onSelect={() =>
                run(() => navigate({ to: "/projetos/$slug", params: { slug: p.slug } }))
              }
            >
              <FolderGit2 aria-hidden /> {p.name}
              <CommandShortcut>
                {p.demo.status === "online"
                  ? "demo"
                  : p.demo.status === "unavailable"
                    ? "demo fora do ar"
                    : "código"}
              </CommandShortcut>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Ações">
          <CommandItem value="copiar email" onSelect={() => run(() => void copyEmail())}>
            <Copy aria-hidden /> Copiar e-mail
          </CommandItem>
          <CommandItem
            value="enviar email"
            onSelect={() => run(() => (window.location.href = `mailto:${profile.email}`))}
          >
            <Mail aria-hidden /> Enviar e-mail
          </CommandItem>
          <CommandItem
            value="baixar curriculo cv"
            onSelect={() =>
              run(() => {
                const a = document.createElement("a");
                a.href = profile.cvUrl;
                a.download = profile.cvFileName;
                a.click();
              })
            }
          >
            <FileDown aria-hidden /> Baixar currículo
          </CommandItem>
          <CommandItem
            value="github"
            onSelect={() => run(() => window.open(profile.github, "_blank", "noopener"))}
          >
            <Github aria-hidden /> Abrir GitHub
          </CommandItem>
          <CommandItem
            value="linkedin"
            onSelect={() => run(() => window.open(profile.linkedin, "_blank", "noopener"))}
          >
            <Linkedin aria-hidden /> Abrir LinkedIn
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
