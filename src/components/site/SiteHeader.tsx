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
import logo from "@/assets/branding/logo-ga.webp";
import { profile } from "@/data/profile";

import { useT } from "@/i18n/LocaleProvider";

import { openCommandMenu } from "./CommandMenu";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { navItems } from "./nav";

function Logo() {
  const t = useT();
  return (
    <Link
      to="/"
      className="group flex min-w-0 items-center gap-2 rounded-full"
      aria-label={t.header.homeAria}
    >
      <img
        src={logo}
        alt=""
        width={44}
        height={44}
        decoding="async"
        className="size-10 shrink-0 transition-transform duration-500 group-hover:scale-105 group-hover:-rotate-3 sm:size-11"
      />
      <span className="font-display text-base font-semibold tracking-tight text-foreground">
        giselle<span className="text-lavender">.dev</span>
      </span>
    </Link>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const t = useT();

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/75 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Logo />

        <nav aria-label={t.header.mainNav} className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {navItems.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  activeOptions={{ exact: item.to === "/" }}
                  className="relative rounded-full px-3.5 py-2 text-sm text-muted-foreground transition-colors hover:bg-surface/60 hover:text-foreground data-[status=active]:bg-surface data-[status=active]:text-lilac"
                >
                  {t.nav[item.to]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <LanguageSwitcher />
          <Button
            variant="glass"
            size="sm"
            onClick={openCommandMenu}
            aria-label={t.header.search}
            className="px-3"
          >
            <Search aria-hidden />
            <kbd className="hidden rounded border border-border px-1.5 font-mono text-[0.65rem] text-muted-foreground md:inline">
              Ctrl K
            </kbd>
          </Button>
          <Button asChild variant="glass" size="sm" className="hidden sm:inline-flex">
            <a href={profile.cvUrl} download={profile.cvFileName}>
              <FileDown aria-hidden /> {t.header.cv}
              <span className="sr-only"> {t.common.pdf}</span>
            </a>
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="glass"
                size="icon"
                className="lg:hidden"
                aria-label={t.header.openMenu}
              >
                <Menu aria-hidden />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[85vw] max-w-xs border-border bg-surface-2">
              <SheetTitle className="font-display text-lg">{t.header.menu}</SheetTitle>
              <SheetDescription className="sr-only">{t.header.menuDescription}</SheetDescription>
              <nav aria-label={t.header.mobileNav} className="mt-6">
                <ul className="flex flex-col gap-1">
                  {navItems.map((item) => (
                    <li key={item.to}>
                      <Link
                        to={item.to}
                        activeOptions={{ exact: item.to === "/" }}
                        onClick={() => setOpen(false)}
                        className="block rounded-xl px-4 py-3 text-base text-muted-foreground transition-colors hover:bg-surface hover:text-foreground data-[status=active]:bg-surface data-[status=active]:text-lilac"
                      >
                        {t.nav[item.to]}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
              <Button asChild variant="hero" className="mt-8 w-full">
                <a href={profile.cvUrl} download={profile.cvFileName}>
                  <FileDown aria-hidden /> {t.header.downloadCv}
                </a>
              </Button>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
