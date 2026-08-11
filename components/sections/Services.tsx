import { services } from "@/data/services";
import type { ServiceIcon } from "@/data/types";
import { Icon, type IconName } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";

import styles from "./sections.module.css";

const serviceIcons: Record<ServiceIcon, IconName> = {
  code: "code",
  server: "server",
  layout: "layers",
  palette: "palette",
  globe: "globe",
  cloud: "cloud",
};

export function Services() {
  return (
    <section className="section" id="services" aria-label="Services and expertise">
      <div className="container">
        <div className={styles.sectionHeaderRow} data-reveal>
          <SectionHeading
            description="Focused capabilities across software delivery, with backend engineering at the center and interface quality built in."
            eyebrow="Services / Expertise"
            title="From the system underneath to the experience on screen."
          />
          <p className={styles.sectionNote}>Scope is shaped around the product, its users, and the technical constraints that matter.</p>
        </div>

        <div className={styles.serviceGrid}>
          {services.map((service, index) => (
            <article className={styles.serviceCard} data-reveal key={service.id}>
              <div className={styles.serviceTop}>
                <span className={styles.serviceIcon} aria-hidden="true">
                  <Icon name={serviceIcons[service.icon]} size="md" />
                </span>
                <span className={styles.serviceNumber} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              </div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
