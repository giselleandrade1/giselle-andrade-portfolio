import { profile, socialLinks } from "@/data/profile";
import { CopyEmail } from "@/components/ui/CopyEmail";
import { Icon, type IconName } from "@/components/ui/Icon";

import { ContactForm } from "./ContactForm";
import styles from "./sections.module.css";

const contactIcons: Record<(typeof socialLinks)[number]["platform"], IconName> = {
  github: "github",
  linkedin: "linkedin",
  email: "mail",
};

export function Contact() {
  return (
    <section className="section" id="contact" aria-label="Contact Giselle Andrade">
      <div className="container">
        <div className={`${styles.contactCard} ${styles.surfaceCard}`} data-contact-layout data-reveal>
          <div className={styles.contactCopy}>
            <p className={styles.contactEyebrow}>Start a conversation</p>
            <h2>Let&apos;s build something meaningful.</h2>
            <p>
              I&apos;m open to software-development opportunities, collaborations, and conversations
              about backend systems, web applications, and thoughtful digital products.
            </p>
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
                  <strong>{link.label}</strong>
                  <span>{link.handle}</span>
                </span>
                {link.external ? <Icon name="arrowUpRight" size="sm" /> : null}
                {link.external ? <span className="srOnly"> (opens in a new tab)</span> : null}
              </a>
            ))}
            <div className={styles.copyRow}>
              <CopyEmail email={profile.email} />
              <p className={styles.contactNote}>
                Copy the address or use the email link. No form pretends to send a message without a backend.
              </p>
            </div>
          </div>
        </div>
        <ContactForm email={profile.email} />
      </div>
    </section>
  );
}
