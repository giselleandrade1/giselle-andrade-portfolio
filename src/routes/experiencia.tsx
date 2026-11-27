import { createFileRoute } from "@tanstack/react-router";

import { PageHero } from "@/components/site/SectionHeading";
import { Tag } from "@/components/site/Tag";
import { Timeline } from "@/components/site/Timeline";
import { experiences, otherExperiences, type Experience } from "@/data/experience";

export const Route = createFileRoute("/experiencia")({
  head: () => ({
    meta: [
      { title: "Experiência — Giselle Andrade" },
      {
        name: "description",
        content:
          "Experiência profissional de Giselle Andrade em desenvolvimento web, freelancer e processos administrativos.",
      },
      { property: "og:title", content: "Experiência — Giselle Andrade" },
      {
        property: "og:description",
        content:
          "Experiência profissional de Giselle Andrade em desenvolvimento web, freelancer e processos administrativos.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/experiencia" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/experiencia" }],
  }),
  component: ExperiencePage,
});

const toItem = (e: Experience) => ({
  id: e.id,
  title: e.role,
  subtitle: `${e.company} · ${e.location}`,
  period: e.period,
  current: e.end === null,
  badge: e.end === null ? <Tag tone="success">Atual</Tag> : undefined,
  body: (
    <>
      <p>{e.summary}</p>
      {e.highlights.length ? (
        <ul className="mt-3 list-disc space-y-1 pl-5">
          {e.highlights.map((h) => (
            <li key={h}>{h}</li>
          ))}
        </ul>
      ) : null}
      <div className="mt-4 flex flex-wrap gap-1.5">
        {e.tags.map((t) => (
          <Tag key={t}>{t}</Tag>
        ))}
      </div>
    </>
  ),
});

function ExperiencePage() {
  return (
    <>
      <PageHero eyebrow="experiência" title="Trajetória profissional" />
      <section className="container-page max-w-3xl">
        <Timeline items={experiences.map(toItem)} />
        <details className="glass mt-10 rounded-2xl p-5">
          <summary className="cursor-pointer font-display text-lg font-semibold">
            Outras experiências
          </summary>
          <div className="mt-6">
            <Timeline items={otherExperiences.map(toItem)} />
          </div>
        </details>
      </section>
    </>
  );
}
