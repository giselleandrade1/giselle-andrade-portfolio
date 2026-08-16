import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { notFound } from "next/navigation";
import Script from "next/script";
import type { ReactNode } from "react";

import { getMessages, isLocale, locales } from "@/i18n";
import { siteConfig } from "@/lib/seo";

import "../globals.css";

const geistSans = localFont({
  src: "../../public/fonts/Geist-Variable.woff2",
  display: "optional",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const themeBootstrap = `
  (() => {
    const root = document.documentElement;
    const systemTheme = () => matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    const updateThemeColor = (theme) => {
      const color = theme === "dark" ? "#030711" : "#f6f8fc";
      document.querySelectorAll('meta[name="theme-color"]').forEach((meta) => {
        meta.setAttribute("content", color);
      });
    };
    const applyTheme = (theme) => {
      root.dataset.theme = theme;
      root.dataset.resolvedTheme = theme;
      root.style.colorScheme = theme;
      updateThemeColor(theme);
    };

    try {
      const stored = localStorage.getItem("theme");
      applyTheme(stored === "light" || stored === "dark" ? stored : systemTheme());
    } catch {
      applyTheme(systemTheme());
    }

    addEventListener("DOMContentLoaded", () => {
      updateThemeColor(root.dataset.theme === "light" ? "light" : "dark");
    }, { once: true });
  })();
`;

type LocaleLayoutProps = Readonly<{
  children: ReactNode;
  params: Promise<{ locale: string }>;
}>;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: Pick<LocaleLayoutProps, "params">): Promise<Metadata> {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();

  const messages = await getMessages(localeParam);
  const canonicalPath = `/${localeParam}`;
  const alternateLocales = locales
    .filter((locale) => locale !== localeParam)
    .map((locale) => ({ "en-US": "en_US", "pt-BR": "pt_BR", "es-ES": "es_ES" })[locale]);

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: messages.metadata.title,
      template: `%s | ${siteConfig.author}`,
    },
    description: messages.metadata.description,
    applicationName: siteConfig.name,
    authors: [{ name: siteConfig.author, url: siteConfig.url }],
    creator: siteConfig.author,
    keywords: [...messages.metadata.keywords],
    alternates: {
      canonical: canonicalPath,
      languages: {
        "en-US": "/en-US",
        "pt-BR": "/pt-BR",
        "es-ES": "/es-ES",
        "x-default": "/en-US",
      },
    },
    openGraph: {
      type: "website",
      locale: messages.metadata.openGraphLocale,
      alternateLocale: alternateLocales,
      url: canonicalPath,
      siteName: siteConfig.name,
      title: messages.metadata.title,
      description: messages.metadata.description,
      images: [{
        url: `/${localeParam}/opengraph-image`,
        width: siteConfig.openGraphImage.width,
        height: siteConfig.openGraphImage.height,
        alt: messages.metadata.openGraphAlt,
      }],
    },
    twitter: {
      card: "summary_large_image",
      title: messages.metadata.title,
      description: messages.metadata.description,
      images: [`/${localeParam}/opengraph-image`],
    },
    icons: {
      icon: [
        { url: "/favicon.svg", type: "image/svg+xml" },
        { url: "/favicon.ico", sizes: "32x32" },
      ],
      apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    },
    manifest: "/manifest.webmanifest",
    category: "technology",
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "dark light",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#030711" },
    { media: "(prefers-color-scheme: light)", color: "#f6f8fc" },
  ],
};

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();

  return (
    <html
      data-locale={localeParam}
      data-resolved-theme="dark"
      data-theme="dark"
      lang={localeParam}
      suppressHydrationWarning
    >
      <head>
        <Script id="theme-bootstrap" strategy="beforeInteractive">
          {themeBootstrap}
        </Script>
      </head>
      <body className={geistSans.variable}>{children}</body>
    </html>
  );
}
