import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Messages } from "@/i18n";

import styles from "./sections.module.css";

type AboutProps = {
  messages: Messages["about"];
};

export function About({ messages }: AboutProps) {
  return (
    <section className="section" id="about" aria-label={messages.sectionLabel}>
      <div className="container">
        <div className={styles.sectionHeaderRow} data-reveal>
          <SectionHeading
            description={messages.description}
            eyebrow={messages.eyebrow}
            title={messages.title}
          />
          <p className={styles.sectionNote}>{messages.note}</p>
        </div>

        <div className={styles.aboutLayout}>
          <article className={`${styles.aboutStory} ${styles.surfaceCard}`} data-reveal>
            <p className={styles.storyLabel}>
              <Icon name="terminal" size="sm" />
              {messages.storyLabel}
            </p>
            <h3>{messages.storyTitle}</h3>
            <p>{messages.bio}</p>
            <ul className={styles.highlights} aria-label={messages.highlightsLabel}>
              {messages.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}
            </ul>
          </article>

          <ul className={styles.principles} aria-label={messages.principlesLabel}>
            {messages.principles.map((principle, index) => (
              <li className={styles.principle} data-reveal key={principle.title}>
                <span className={styles.principleNumber} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{principle.title}</h3>
                  <p>{principle.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
