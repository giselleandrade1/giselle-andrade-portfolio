import { experience } from "@/data/experience";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { formatMessage, type Messages } from "@/i18n";

import styles from "./sections.module.css";

type ExperienceProps = {
  messages: Messages["journey"];
};

export function Experience({ messages }: ExperienceProps) {
  return (
    <section className="section" id="experience" aria-label={messages.sectionLabel}>
      <div className="container">
        <div className={styles.sectionHeaderRow} data-reveal>
          <SectionHeading
            description={messages.description}
            eyebrow={messages.eyebrow}
            title={messages.title}
          />
          <p className={styles.sectionNote}>{messages.note}</p>
        </div>

        <div className={styles.journeyLayout}>
          <div className={styles.journeyIntro} data-reveal>
            <p>{messages.intro}</p>
            <p className={styles.journeyAside}>{messages.aside}</p>
          </div>

          <div className={styles.timeline}>
            {experience.map((item) => {
              const content = messages.items[item.id];

              return (
                <article className={styles.timelineItem} data-reveal key={item.id}>
                  <span className={styles.timelineDot} aria-hidden="true" />
                  <div className={styles.timelineCard}>
                    <div className={styles.timelineMeta}>
                      <span>{item.period}</span>
                      <span className={styles.timelineContext}>{content.context}</span>
                    </div>
                    <h3>{content.title}</h3>
                    <p>{content.description}</p>
                    {"technologies" in item && item.technologies ? (
                      <ul
                        className={styles.tagList}
                        aria-label={formatMessage(messages.technologiesLabel, { item: content.title })}
                      >
                        {item.technologies.map((technology) => <li className={styles.tag} key={technology}>{technology}</li>)}
                      </ul>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
