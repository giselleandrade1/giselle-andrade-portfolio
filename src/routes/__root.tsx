import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { type ReactNode } from "react";

import appCss from "../styles.css?url";
import { SiteFooter } from "../components/site/SiteFooter";
import { SiteHeader } from "../components/site/SiteHeader";
import { BackToTop } from "../components/site/BackToTop";
import { CommandMenu } from "../components/site/CommandMenu";
import { useInteractiveEffects } from "../components/site/useInteractiveEffects";
import { Toaster } from "../components/ui/sonner";
import { LocaleProvider, useLocale, useT } from "../i18n/LocaleProvider";
import { getInitialLocale } from "../i18n/locale.server-fn";

function NotFoundComponent() {
  const t = useT().notFound;
  return (
    <div className="relative flex min-h-[70vh] items-center justify-center overflow-hidden px-4">
      <div aria-hidden className="bg-aurora pointer-events-none absolute inset-0" />
      <div className="relative max-w-md text-center">
        <p className="eyebrow">{t.eyebrow}</p>
        <h1 className="text-gradient mt-3 text-7xl font-bold">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">{t.title}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{t.text}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            to="/"
            className="inline-flex h-10 items-center justify-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {t.home}
          </Link>
          <Link
            to="/projetos"
            className="inline-flex h-10 items-center justify-center rounded-full border border-border px-5 text-sm font-medium text-foreground transition-colors hover:border-lavender/40"
          >
            {t.projects}
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const t = useT().error;
  const router = useRouter();

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">{t.title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{t.text}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex h-10 items-center justify-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {t.retry}
          </button>
          <a
            href="/"
            className="inline-flex h-10 items-center justify-center rounded-full border border-border px-5 text-sm font-medium text-foreground transition-colors hover:border-lavender/40"
          >
            {t.home}
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    // Sitewide defaults only. Each content route sets its own title, description and canonical.
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Giselle Andrade — Full Stack Developer | Java & TypeScript" },
      {
        name: "description",
        content:
          "Portfólio de Giselle Andrade, Full Stack Developer com foco em backend, Java e TypeScript, em São Paulo.",
      },
      { name: "author", content: "Giselle Andrade" },
      { name: "theme-color", content: "#08080D" },
      { name: "color-scheme", content: "dark" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Giselle Andrade — Portfólio" },
      { property: "og:locale", content: "pt_BR" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", type: "image/png", href: "/favicon.png" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
    ],
  }),
  // Saved language (cookie) so the server renders the page already translated.
  beforeLoad: () => ({ locale: getInitialLocale() }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  const { locale } = Route.useRouteContext();
  return (
    <html lang={locale}>
      <head>
        <HeadContent />
      </head>
      <body>
        <LocaleProvider initial={locale}>{children}</LocaleProvider>
        <Scripts />
      </body>
    </html>
  );
}

function SkipLink() {
  const t = useT();
  return (
    <a
      href="#conteudo"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
    >
      {t.common.skipToContent}
    </a>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { locale } = useLocale();
  useInteractiveEffects();

  return (
    <QueryClientProvider client={queryClient}>
      <SkipLink />
      <div aria-hidden className="scroll-progress" />
      <div aria-hidden className="cursor-glow" />
      <SiteHeader />
      <main id="conteudo">
        {/* Keyed by path so each page enters with a soft transition. */}
        <div key={`${locale}:${pathname}`} className="animate-page">
          {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
          <Outlet />
        </div>
      </main>
      <SiteFooter />
      <BackToTop />
      <CommandMenu />
      <Toaster position="bottom-center" />
    </QueryClientProvider>
  );
}
