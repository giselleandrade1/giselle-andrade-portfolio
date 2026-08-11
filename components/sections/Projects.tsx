import Image from "next/image";

import { projects } from "@/data/projects";
import type { Project } from "@/data/types";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";

import { ProjectFilters } from "./ProjectFilters";
import styles from "./sections.module.css";

function ProjectCard({ project }: { project: Project }) {
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
          alt={project.previewAlt}
          fill
          sizes="(max-width: 699px) calc(100vw - 2rem), (max-width: 1199px) 48vw, (max-width: 1440px) 52vw, 44rem"
          src={project.preview}
        />
        <span className={styles.projectStatus}>{project.status}</span>
      </div>

      <div className={styles.projectBody}>
        <p className={styles.projectMeta}>{project.category} · Selected work</p>
        <h3>{project.name}</h3>
        <p className={styles.projectDescription}>{project.description}</p>

        <div className={styles.tagList} aria-label={`Technologies used in ${project.name}`}>
          {project.technologies.map((technology) => (
            <span className={styles.tag} key={technology}>{technology}</span>
          ))}
        </div>

        {project.caseStudy ? (
          <details className={styles.caseStudy}>
            <summary>
              Project notes
              <Icon name="arrowDown" size="xs" />
            </summary>
            <dl className={styles.caseContent}>
              <div>
                <dt>Challenge</dt>
                <dd>{project.caseStudy.challenge}</dd>
              </div>
              <div>
                <dt>Solution</dt>
                <dd>{project.caseStudy.solution}</dd>
              </div>
              <div>
                <dt>Key decisions</dt>
                <dd>
                  <ul className={styles.decisionList}>
                    {project.caseStudy.keyDecisions.map((decision) => <li key={decision}>{decision}</li>)}
                  </ul>
                </dd>
              </div>
              <div>
                <dt>Result</dt>
                <dd>{project.caseStudy.result}</dd>
              </div>
            </dl>
          </details>
        ) : null}

        <div className={styles.projectActions}>
          <a
            aria-label={`View live demo of ${project.name} (opens in a new tab)`}
            className={styles.projectLink}
            href={project.demoUrl}
            rel="noopener noreferrer"
            target="_blank"
          >
            Live demo
            <Icon name="arrowUpRight" size="sm" />
          </a>
          <a
            aria-label={`View ${project.name} source code on GitHub (opens in a new tab)`}
            className={styles.projectLink}
            href={project.repositoryUrl}
            rel="noopener noreferrer"
            target="_blank"
          >
            Source code
            <Icon name="github" size="sm" />
          </a>
        </div>
      </div>
    </article>
  );
}

export function Projects() {
  return (
    <section className="section" id="projects" aria-label="Selected projects">
      <div className="container">
        <div className={styles.sectionHeaderRow} data-reveal>
          <SectionHeading
            description="Real, deployed work presented with the context behind the interface: problem, implementation choices, and current limitations."
            eyebrow="Selected projects"
            title="Products that turn technical practice into something you can use."
          />
          <p className={styles.sectionNote}>Screenshots captured from live deployments · Repository and demo URLs validated.</p>
        </div>

        <ProjectFilters totalProjects={projects.length} />

        <div className={styles.projectGrid} data-project-grid id="project-list">
          {projects.map((project) => <ProjectCard key={project.slug} project={project} />)}
        </div>
      </div>
    </section>
  );
}
