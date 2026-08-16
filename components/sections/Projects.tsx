import Image from "next/image";

import { projects } from "@/data/projects";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { formatMessage, type Messages } from "@/i18n";

import { ProjectFilters } from "./ProjectFilters";
import styles from "./sections.module.css";

type Project = (typeof projects)[number];

function ProjectCard({
  messages,
  project,
}: Readonly<{ messages: Messages["projects"]; project: Project }>) {
  const copy = messages.items[project.slug];

  return (
    <article
      className={styles.projectCard}
      data-categories={project.categories.join("|")}
      data-featured={project.featured}
      data-project-card
      data-reveal
    >
      <div className={styles.projectMedia}>
        <Image
          alt={copy.previewAlt}
          fill
          sizes="(max-width: 699px) calc(100vw - 2rem), (max-width: 1199px) 48vw, (max-width: 1599px) 31vw, 464px"
          src={project.preview}
        />
        <span className={styles.projectStatus}>{messages.live}</span>
      </div>

      <div className={styles.projectBody}>
        <p className={styles.projectMeta}>{messages.filters[project.category]} · {messages.selectedWork}</p>
        <h3>{project.name}</h3>
        <p className={styles.projectDescription}>{copy.description}</p>

        <ul
          className={styles.tagList}
          aria-label={formatMessage(messages.technologiesLabel, { project: project.name })}
        >
          {project.technologies.map((technology) => (
            <li className={styles.tag} key={technology}>{technology}</li>
          ))}
        </ul>

        {copy.caseStudy ? (
          <details className={styles.caseStudy}>
            <summary>
              {messages.projectNotes}
              <Icon name="arrowDown" size="xs" />
            </summary>
            <dl className={styles.caseContent}>
              <div>
                <dt>{messages.challenge}</dt>
                <dd>{copy.caseStudy.challenge}</dd>
              </div>
              <div>
                <dt>{messages.solution}</dt>
                <dd>{copy.caseStudy.solution}</dd>
              </div>
              <div>
                <dt>{messages.keyDecisions}</dt>
                <dd>
                  <ul className={styles.decisionList}>
                    {copy.caseStudy.keyDecisions.map((decision) => <li key={decision}>{decision}</li>)}
                  </ul>
                </dd>
              </div>
              <div>
                <dt>{messages.result}</dt>
                <dd>{copy.caseStudy.result}</dd>
              </div>
            </dl>
          </details>
        ) : null}

        <div className={styles.projectActions}>
          <a
            aria-label={formatMessage(messages.liveDemoLabel, { project: project.name })}
            className={styles.projectLink}
            href={project.demoUrl}
            rel="noopener noreferrer"
            target="_blank"
          >
            {messages.liveDemo}
            <Icon name="arrowUpRight" size="sm" />
          </a>
          <a
            aria-label={formatMessage(messages.sourceCodeLabel, { project: project.name })}
            className={styles.projectLink}
            href={project.repositoryUrl}
            rel="noopener noreferrer"
            target="_blank"
          >
            {messages.sourceCode}
            <Icon name="github" size="sm" />
          </a>
        </div>
      </div>
    </article>
  );
}

export function Projects({ messages }: Readonly<{ messages: Messages["projects"] }>) {
  return (
    <section className="section" id="projects" aria-label={messages.sectionLabel}>
      <div className="container">
        <div className={styles.sectionHeaderRow} data-reveal>
          <SectionHeading
            description={messages.description}
            eyebrow={messages.eyebrow}
            title={messages.title}
          />
          <p className={styles.sectionNote}>{messages.note}</p>
        </div>

        <ProjectFilters messages={messages} totalProjects={projects.length} />

        <div className={styles.projectGrid} data-project-grid id="project-list">
          {projects.map((project) => (
            <ProjectCard key={project.slug} messages={messages} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
