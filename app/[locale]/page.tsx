import { notFound } from "next/navigation";

import { Hero } from "@/components/hero/Hero";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { PointerGlow } from "@/components/layout/PointerGlow";
import { RevealController } from "@/components/layout/RevealController";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Experience } from "@/components/sections/Experience";
import { Github } from "@/components/sections/Github";
import { Process } from "@/components/sections/Process";
import { Projects } from "@/components/sections/Projects";
import { Services } from "@/components/sections/Services";
import { Skills } from "@/components/sections/Skills";
import { profile } from "@/data/profile";
import { skills } from "@/data/skills";
import { getMessages, isLocale } from "@/i18n";
import { siteConfig } from "@/lib/seo";

type HomePageProps = Readonly<{
  params: Promise<{ locale: string }>;
}>;

export default async function HomePage({ params }: HomePageProps) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();

  const messages = await getMessages(localeParam);
  const localizedUrl = new URL(`/${localeParam}`, siteConfig.url).toString();
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Person",
      name: profile.name,
      url: localizedUrl,
      image: new URL(profile.avatar, siteConfig.url).toString(),
      email: `mailto:${profile.email}`,
      jobTitle: messages.hero.role,
      address: {
        "@type": "PostalAddress",
        addressLocality: "São Paulo",
        addressRegion: "SP",
        addressCountry: "BR",
      },
      sameAs: [siteConfig.links.github, siteConfig.links.linkedin],
      knowsAbout: skills.flatMap((group) => group.technologies.map((technology) => technology.name)),
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: siteConfig.name,
      url: localizedUrl,
      description: messages.metadata.description,
      inLanguage: localeParam,
      author: {
        "@type": "Person",
        name: profile.name,
      },
    },
  ] as const;
  const safeStructuredData = JSON.stringify(structuredData).replaceAll("<", "\\u003c");

  return (
    <div className="siteShell">
      <script
        dangerouslySetInnerHTML={{ __html: safeStructuredData }}
        type="application/ld+json"
      />
      <a className="skipLink" href="#main-content">{messages.navigation.skipToContent}</a>
      <div className="ambient" aria-hidden="true" />
      <PointerGlow />
      <Header
        key={localeParam}
        locale={localeParam}
        messages={{
          common: messages.common,
          language: messages.language,
          navigation: messages.navigation,
          theme: messages.theme,
        }}
      />
      <main id="main-content" tabIndex={-1}>
        <Hero common={messages.common} messages={messages.hero} />
        <About messages={messages.about} />
        <Skills messages={messages.skills} />
        <Projects messages={messages.projects} />
        <Services messages={messages.services} />
        <Process messages={messages.process} />
        <Experience messages={messages.journey} />
        <Github
          common={messages.common}
          messages={messages.github}
          projectMessages={messages.projects}
        />
        <Contact common={messages.common} messages={messages.contact} />
      </main>
      <Footer common={messages.common} messages={messages.footer} />
      <RevealController />
    </div>
  );
}
