import { profile, socialLinks } from "@/data/profile";
import { Icon } from "@/components/ui/Icon";
import type { Messages } from "@/i18n";

import styles from "./layout.module.css";

type FooterProps = Readonly<{
  common: Messages["common"];
  messages: Messages["footer"];
}>;

export function Footer({ common, messages }: FooterProps) {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.footerGrid}>
          <div>
            <p className={styles.footerBrand}>{profile.name}</p>
            <p className={styles.footerRole}>{messages.roleLine}</p>
          </div>

          <nav aria-label={messages.navigationLabel}>
            <ul className={styles.footerLinks}>
              {socialLinks.map((link) => (
                <li key={link.platform}>
                  <a
                    href={link.href}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    target={link.external ? "_blank" : undefined}
                  >
                    {link.platform === "email" ? common.email : link.label}
                    {link.external ? <span className="srOnly"> ({common.externalTab})</span> : null}
                  </a>
                </li>
              ))}
              <li>
                <a className={styles.backToTop} href="#home">
                  {messages.backToTop}
                  <Icon name="arrowUpRight" size="sm" />
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div className={styles.footerBottom}>
          <span>© {new Date().getFullYear()} Giselle Andrade</span>
          <span>{messages.builtWithCare}</span>
        </div>
      </div>
    </footer>
  );
}
