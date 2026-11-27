import { createFileRoute } from "@tanstack/react-router";

import { PageHero, SectionHeading } from "@/components/site/SectionHeading";
import { Tag } from "@/components/site/Tag";
import { Timeline } from "@/components/site/Timeline";
import { courses, education } from "@/data/education";

export const Route = createFileRoute("/formacao")({
  head: () => ({
    meta: [
      { title: "Formação — Giselle Andrade" },
      {
        name: "description",
        content: "Formação acadêmica, cursos e certificações de Giselle Andrade.",
      },
      { property: "og:title", content: "Formação — Giselle Andrade" },
      {
        property: "og:description",
        content: "Formação acadêmica, cursos e certificações de Giselle Andrade.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/formacao" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/formacao" }],
  }),
  component: EducationPage,
});

function EducationPage() {
  return (
    <>
      <PageHero eyebrow="formação" title="Formação acadêmica e cursos" />
      <section className="container-page max-w-3xl">
        <Timeline
          items={education.map((e) => ({
            id: e.id,
            title: e.course,
            subtitle: `${e.institution} · ${e.level}`,
            period: e.period,
            current: e.status === "Em andamento",
            badge: <Tag tone={e.status === "Concluído" ? "strong" : "success"}>{e.status}</Tag>,
          }))}
        />
      </section>
      <section className="container-page mt-20">
        <SectionHeading eyebrow="cursos" title="Cursos e certificações" />
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((c) => (
            <li key={c.id} data-reveal className="glass rounded-2xl p-5">
              <Tag tone={c.status === "Concluído" ? "strong" : "success"}>{c.status}</Tag>
              <h3 className="mt-3 font-semibold">{c.title}</h3>
              <p className="text-sm text-muted-foreground">{c.institution}</p>
              <p className="mt-2 font-mono text-xs text-lavender">
                {c.hours} · {c.year}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
