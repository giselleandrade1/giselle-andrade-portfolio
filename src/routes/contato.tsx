import { createFileRoute } from "@tanstack/react-router";
import { Github, Linkedin, Mail, MapPin } from "lucide-react";

import { ContactForm } from "@/components/site/ContactForm";
import { CopyEmailButton } from "@/components/site/CopyEmailButton";
import { PageHero } from "@/components/site/SectionHeading";
import { profile } from "@/data/profile";

export const Route = createFileRoute("/contato")({
  head: () => ({
    meta: [
      { title: "Contato — Giselle Andrade" },
      {
        name: "description",
        content: "Fale com Giselle Andrade sobre vagas de estágio, júnior ou projetos.",
      },
      { property: "og:title", content: "Contato — Giselle Andrade" },
      {
        property: "og:description",
        content: "Fale com Giselle Andrade sobre vagas de estágio, júnior ou projetos.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="contato"
        title="Vamos conversar"
        description="Aberta a estágio, vagas júnior e novos projetos."
      />
      <section className="container-page grid gap-8 lg:grid-cols-[1fr_1.4fr]">
        <ul className="space-y-4 text-sm">
          <li>
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex items-center gap-2 break-all hover:text-lilac"
            >
              <Mail className="size-4 shrink-0 text-lavender" aria-hidden /> {profile.email}
            </a>
          </li>
          <li>
            <CopyEmailButton />
          </li>
          <li>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 hover:text-lilac"
            >
              <Linkedin className="size-4 text-lavender" aria-hidden /> linkedin.com/in/
              {profile.linkedinHandle}
            </a>
          </li>
          <li>
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 hover:text-lilac"
            >
              <Github className="size-4 text-lavender" aria-hidden /> github.com/
              {profile.githubHandle}
            </a>
          </li>
          <li className="inline-flex items-center gap-2 text-muted-foreground">
            <MapPin className="size-4 text-lavender" aria-hidden /> {profile.location}
          </li>
        </ul>
        <ContactForm />
      </section>
    </>
  );
}
