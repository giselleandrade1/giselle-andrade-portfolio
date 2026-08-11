import { experience } from "@/data/experience";
import { SectionHeading } from "@/components/ui/SectionHeading";

import styles from "./sections.module.css";

export function Experience() {
  return (
    <section className="section" id="experience" aria-label="Development experience and journey">
      <div className="container">
        <div className={styles.sectionHeaderRow} data-reveal>
          <SectionHeading
            description="A project-led path through software engineering, backend systems, interfaces, and professional communication."
            eyebrow="Experience / Journey"
            title="Learning in public, one deliberate build at a time."
          />
          <p className={styles.sectionNote}>This timeline records study and project milestones, not fictional employment or inflated seniority.</p>
        </div>

        <div className={styles.journeyLayout}>
          <div className={styles.journeyIntro} data-reveal>
            <p>
              My current experience is grounded in independent study and hands-on projects. Each build
              is an opportunity to work through product requirements, architecture, implementation,
              documentation, testing, accessibility, and deployment.
            </p>
            <p className={styles.journeyAside}>
              I value honest scope: the work shown here reflects what is implemented and documented in
              public repositories.
            </p>
          </div>

          <div className={styles.timeline}>
            {experience.map((item) => (
              <article className={styles.timelineItem} data-reveal key={item.id}>
                <span className={styles.timelineDot} aria-hidden="true" />
                <div className={styles.timelineCard}>
                  <div className={styles.timelineMeta}>
                    <span>{item.period}</span>
                    <span className={styles.timelineContext}>{item.context}</span>
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  {"technologies" in item && item.technologies ? (
                    <div className={styles.tagList} aria-label={`Technologies for ${item.title}`}>
                      {item.technologies.map((technology) => <span className={styles.tag} key={technology}>{technology}</span>)}
                    </div>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
