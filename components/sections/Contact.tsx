import { profile, socialLinks } from "@/data/profile";
import { CopyEmail } from "@/components/ui/CopyEmail";
import { Icon, type IconName } from "@/components/ui/Icon";
import type { Messages } from "@/i18n";

import { ContactForm } from "./ContactForm";
import styles from "./sections.module.css";

const contactIcons: Record<(typeof socialLinks)[number]["platform"], IconName> = {
  github: "github",
  linkedin: "linkedin",
  email: "mail",
};

type ContactProps = Readonly<{
  common: Messages["common"];
  messages: Messages["contact"];
}>;

export function Contact({ common, messages }: ContactProps) {
  return (
    <section className="section" id="contact" aria-label={messages.sectionLabel}>
      <div className="container">
        <div className={`${styles.contactCard} ${styles.surfaceCard}`} data-contact-layout data-reveal>
          <div className={styles.contactCopy}>
            <p className={styles.contactEyebrow}>{messages.eyebrow}</p>
            <h2>{messages.title}</h2>
            <p>{messages.description}</p>
          </div>

          <div className={styles.contactDetails}>
            {socialLinks.map((link) => (
              <a
                className={styles.contactLink}
                href={link.href}
                key={link.platform}
                rel={link.external ? "noopener noreferrer" : undefined}
                target={link.external ? "_blank" : undefined}
              >
                <span className={styles.contactLinkIcon} aria-hidden="true">
                  <Icon name={contactIcons[link.platform]} size="md" />
                </span>
                <span className={styles.contactLinkText}>
                  <strong>{link.platform === "email" ? common.email : link.label}</strong>
                  <span>{link.handle}</span>
                </span>
                {link.external ? <Icon name="arrowUpRight" size="sm" /> : null}
                {link.external ? <span className="srOnly"> ({common.externalTab})</span> : null}
              </a>
            ))}
            <div className={styles.copyRow}>
              <CopyEmail email={profile.email} messages={messages.copyEmail} />
              <p className={styles.contactNote}>{messages.copyNote}</p>
            </div>
          </div>
        </div>
        <ContactForm email={profile.email} messages={messages.form} />
      </div>
    </section>
  );
}
