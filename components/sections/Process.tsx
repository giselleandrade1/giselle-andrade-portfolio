import { processSteps } from "@/data/process";
import type { ProcessIcon } from "@/data/types";
import { Icon, type IconName } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Messages } from "@/i18n";

import sectionStyles from "./sections.module.css";
import styles from "./process.module.css";

const processIcons: Record<ProcessIcon, IconName> = {
  spark: "spark",
  layers: "layers",
  palette: "palette",
  code: "code",
  check: "check",
  cloud: "cloud",
};

type ProcessProps = {
  messages: Messages["process"];
};

export function Process({ messages }: ProcessProps) {
  return (
    <section className="section" id="process" aria-label={messages.sectionLabel}>
      <div className="container">
        <div className={sectionStyles.sectionHeaderRow} data-reveal>
          <SectionHeading
            description={messages.description}
            eyebrow={messages.eyebrow}
            title={messages.title}
          />
          <p className={sectionStyles.sectionNote}>{messages.note}</p>
        </div>

        <ol className={styles.processGrid} data-process-grid>
          {processSteps.map((step, index) => {
            const content = messages.items[step.id];

            return (
              <li className={styles.step} data-reveal key={step.id}>
                <div className={styles.stepTop}>
                  <span className={styles.stepIcon} aria-hidden="true">
                    <Icon name={processIcons[step.icon]} size="md" />
                  </span>
                  <span className={styles.stepNumber} aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <div>
                  <h3>{content.title}</h3>
                  <p>{content.description}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
