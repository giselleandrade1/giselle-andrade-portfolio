import { Link } from "@tanstack/react-router";
import { Github, Linkedin, Mail } from "lucide-react";

import logo from "@/assets/branding/logo-ga.webp";
import { profile } from "@/data/profile";

import { useT } from "@/i18n/LocaleProvider";

import { navItems } from "./nav";

export function SiteFooter() {
  const t = useT();
  return (
    <footer className="mt-24 border-t border-border/60">
      <div className="container-page grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <img src={logo} alt="" width={40} height={40} loading="lazy" className="size-10" />
            <p className="font-display text-lg font-semibold">{profile.name}</p>
          </div>
          <p className="mt-2 font-mono text-xs text-lavender">{profile.headline.join(" · ")}</p>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            {profile.role} · {profile.location}. {profile.availability}.
          </p>
        </div>
        <nav aria-label="Rodapé">
          <p className="eyebrow mb-3">Navegação</p>
          <ul className="grid grid-cols-2 gap-2 text-sm">
            {navItems.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className="inline-flex min-h-8 items-center text-muted-foreground transition-colors hover:text-lilac"
                >
                  {t.nav[item.to]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <p className="eyebrow mb-3">Conecte-se</p>
          <ul className="flex flex-col gap-2 text-sm">
            <li>
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-lilac"
              >
                <Github className="size-4" aria-hidden /> GitHub
              </a>
            </li>
            <li>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-lilac"
              >
                <Linkedin className="size-4" aria-hidden /> LinkedIn
              </a>
            </li>
            <li>
              <a
                href={`mailto:${profile.email}`}
                className="inline-flex items-center gap-2 break-all text-muted-foreground hover:text-lilac"
              >
                <Mail className="size-4 shrink-0" aria-hidden /> {profile.email}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60">
        <p className="container-page py-5 font-mono text-xs text-muted-foreground">
          © {new Date().getFullYear()} {profile.name} · Desenvolvido por Giselle Andrade
        </p>
      </div>
    </footer>
  );
}
