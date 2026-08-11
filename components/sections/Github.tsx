import { profile, socialLinks } from "@/data/profile";
import { projects } from "@/data/projects";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";

import styles from "./sections.module.css";

const selectedRepositories = projects.slice(0, 4);

export function Github() {
  return (
    <section className="section" id="github" aria-label="GitHub repositories">
      <div className="container">
        <div className={styles.sectionHeaderRow} data-reveal>
          <SectionHeading
            description="Selected public repositories with source, documentation, and the decisions behind each project."
            eyebrow="Open work"
            title="The code tells the fuller story."
          />
          <p className={styles.sectionNote}>Curated HTML content · No third-party stats image · No token required to render.</p>
        </div>

        <div className={styles.githubPanel}>
          <article className={`${styles.githubProfile} ${styles.surfaceCard}`} data-reveal>
            <div>
              <div className={styles.githubIdentity}>
                <span className={styles.githubMark} aria-hidden="true">
                  <Icon name="github" size="lg" />
                </span>
                <div>
                  <h3>{profile.name}</h3>
                  <p>{socialLinks[0].handle}</p>
                </div>
              </div>
              <p className={styles.githubCopy}>
                Explore implementation details, project documentation, current limitations, and the
                progression of each application directly in the repositories.
              </p>
            </div>
            <div className={styles.projectActions}>
              <ButtonLink
                ariaLabel="Visit GitHub profile for Giselle Andrade"
                external
                href="https://github.com/giselleandrade1"
                variant="secondary"
              >
                Visit GitHub
                <Icon name="arrowUpRight" size="sm" />
              </ButtonLink>
            </div>
          </article>

          <div className={styles.repoList}>
            {selectedRepositories.map((repository) => (
              <a
                aria-label={`Open ${repository.name} repository on GitHub (opens in a new tab)`}
                className={styles.repoCard}
                data-reveal
                href={repository.repositoryUrl}
                key={repository.slug}
                rel="noopener noreferrer"
                target="_blank"
              >
                <div className={styles.repoCardHeader}>
                  <h3>{repository.repositoryUrl.split("/").at(-1)}</h3>
                  <Icon name="arrowUpRight" size="sm" />
                </div>
                <p>{repository.description}</p>
                <div className={styles.repoTags} aria-hidden="true">
                  {repository.technologies.slice(0, 3).map((technology) => <span key={technology}>#{technology.replaceAll(" ", "-").toLowerCase()}</span>)}
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
