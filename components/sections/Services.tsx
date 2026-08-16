import { services } from "@/data/services";
import type { ServiceIcon } from "@/data/types";
import { Icon, type IconName } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Messages } from "@/i18n";

import styles from "./sections.module.css";

const serviceIcons: Record<ServiceIcon, IconName> = {
  code: "code",
  server: "server",
  layout: "layers",
  palette: "palette",
  globe: "globe",
  cloud: "cloud",
};

type ServicesProps = {
  messages: Messages["services"];
};

export function Services({ messages }: ServicesProps) {
  return (
    <section className="section" id="services" aria-label={messages.sectionLabel}>
      <div className="container">
        <div className={styles.sectionHeaderRow} data-reveal>
          <SectionHeading
            description={messages.description}
            eyebrow={messages.eyebrow}
            title={messages.title}
          />
          <p className={styles.sectionNote}>{messages.note}</p>
        </div>

        <div className={styles.serviceGrid}>
          {services.map((service, index) => {
            const content = messages.items[service.id];

            return (
              <article className={styles.serviceCard} data-reveal key={service.id}>
                <div className={styles.serviceTop}>
                  <span className={styles.serviceIcon} aria-hidden="true">
                    <Icon name={serviceIcons[service.icon]} size="md" />
                  </span>
                  <span className={styles.serviceNumber} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                </div>
                <h3>{content.title}</h3>
                <p>{content.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
