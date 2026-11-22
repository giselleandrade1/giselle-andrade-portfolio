import { Link } from "@tanstack/react-router";
import { FileDown, Menu, Search } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { profile } from "@/data/profile";

import { openCommandMenu } from "./CommandMenu";
import { navItems } from "./nav";

function Logo() {
  return (
    <Link
      to="/"
      className="group flex items-center gap-2.5 rounded-full"
      aria-label="Giselle Andrade — página inicial"
    >
      <span className="bg-brand grid size-9 place-items-center rounded-xl font-mono text-sm font-semibold text-primary-foreground shadow-glow">
        GA
      </span>
      <span className="font-display text-base font-semibold tracking-tight text-foreground">
        giselle<span className="text-lavender">.dev</span>
      </span>
    </Link>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Logo />

        <nav aria-label="Navegação principal" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {navItems.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  activeOptions={{ exact: item.to === "/" }}
                  className="rounded-full px-3.5 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground data-[status=active]:bg-surface data-[status=active]:text-lilac"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="glass"
            size="sm"
            onClick={openCommandMenu}
            aria-label="Buscar no portfólio (Ctrl + K)"
            className="px-3"
          >
            <Search aria-hidden />
            <kbd className="hidden rounded border border-border px-1.5 font-mono text-[0.65rem] text-muted-foreground md:inline">
              Ctrl K
            </kbd>
          </Button>
          <Button asChild variant="glass" size="sm" className="hidden sm:inline-flex">
            <a href={profile.cvUrl} download={profile.cvFileName}>
              <FileDown aria-hidden /> Currículo
            </a>
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="glass" size="icon" className="lg:hidden" aria-label="Abrir menu">
                <Menu aria-hidden />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[85vw] max-w-xs border-border bg-surface-2">
              <SheetTitle className="font-display text-lg">Menu</SheetTitle>
              <SheetDescription className="sr-only">
                Navegue pelas páginas do portfólio
              </SheetDescription>
              <nav aria-label="Navegação móvel" className="mt-6">
                <ul className="flex flex-col gap-1">
                  {navItems.map((item) => (
                    <li key={item.to}>
                      <Link
                        to={item.to}
                        activeOptions={{ exact: item.to === "/" }}
                        onClick={() => setOpen(false)}
                        className="block rounded-xl px-4 py-3 text-base text-muted-foreground transition-colors hover:bg-surface hover:text-foreground data-[status=active]:bg-surface data-[status=active]:text-lilac"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
              <Button asChild variant="hero" className="mt-8 w-full">
                <a href={profile.cvUrl} download={profile.cvFileName}>
                  <FileDown aria-hidden /> Baixar currículo
                </a>
              </Button>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
