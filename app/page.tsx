import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Experience } from "@/components/sections/Experience";
import { Github } from "@/components/sections/Github";
import { Projects } from "@/components/sections/Projects";
import { Process } from "@/components/sections/Process";
import { Services } from "@/components/sections/Services";
import { Skills } from "@/components/sections/Skills";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { PointerGlow } from "@/components/layout/PointerGlow";
import { RevealController } from "@/components/layout/RevealController";
import { Hero } from "@/components/hero/Hero";
import { profile } from "@/data/profile";
import { skills } from "@/data/skills";
import { siteConfig } from "@/lib/seo";

const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    url: siteConfig.url,
    image: new URL(profile.avatar, siteConfig.url).toString(),
    email: `mailto:${profile.email}`,
    jobTitle: profile.role,
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
    url: siteConfig.url,
    description: siteConfig.description,
    inLanguage: siteConfig.language,
    author: {
      "@type": "Person",
      name: profile.name,
    },
  },
] as const;

const safeStructuredData = JSON.stringify(structuredData).replaceAll("<", "\\u003c");

export default function HomePage() {
  return (
    <div className="siteShell">
      <script
        dangerouslySetInnerHTML={{ __html: safeStructuredData }}
        type="application/ld+json"
      />
      <a className="skipLink" href="#main-content">Skip to main content</a>
      <div className="ambient" aria-hidden="true" />
      <PointerGlow />
      <Header />
      <main id="main-content">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Services />
        <Process />
        <Experience />
        <Github />
        <Contact />
      </main>
      <Footer />
      <RevealController />
    </div>
  );
}
