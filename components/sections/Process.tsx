import { processSteps } from "@/data/process";
import type { ProcessIcon } from "@/data/types";
import { Icon, type IconName } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";

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

export function Process() {
  return (
    <section className="section" id="process" aria-label="Software development process">
      <div className="container">
        <div className={sectionStyles.sectionHeaderRow} data-reveal>
          <SectionHeading
            description="A practical path from an uncertain idea to a tested, documented product — with feedback built into every stage."
            eyebrow="How I build"
            title="Structure first. Then thoughtful execution."
          />
          <p className={sectionStyles.sectionNote}>Discover · Plan · Design · Develop · Test · Deploy</p>
        </div>

        <ol className={styles.processGrid} data-process-grid>
          {processSteps.map((step, index) => (
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
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
