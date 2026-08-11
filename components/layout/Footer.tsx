import { profile, socialLinks } from "@/data/profile";
import { Icon } from "@/components/ui/Icon";

import styles from "./layout.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.footerGrid}>
          <div>
            <p className={styles.footerBrand}>{profile.name}</p>
            <p className={styles.footerRole}>{profile.role} · Backend focus · {profile.location}</p>
          </div>

          <nav aria-label="Footer navigation">
            <ul className={styles.footerLinks}>
              {socialLinks.map((link) => (
                <li key={link.platform}>
                  <a
                    href={link.href}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    target={link.external ? "_blank" : undefined}
                  >
                    {link.label}
                    {link.external ? <span className="srOnly"> (opens in a new tab)</span> : null}
                  </a>
                </li>
              ))}
              <li>
                <a className={styles.backToTop} href="#home">
                  Back to top
                  <Icon name="arrowUpRight" size="sm" />
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div className={styles.footerBottom}>
          <span>© {new Date().getFullYear()} Giselle Andrade</span>
          <span>Designed and built with care, accessibility, and performance in mind.</span>
        </div>
      </div>
    </footer>
  );
}
