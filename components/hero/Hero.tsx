import { profile, socialLinks } from "@/data/profile";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Icon, type IconName } from "@/components/ui/Icon";
import type { Messages } from "@/i18n";

import { ProfileVisual } from "./ProfileVisual";
import styles from "./hero.module.css";

const socialIcons: Record<(typeof socialLinks)[number]["platform"], IconName> = {
  github: "github",
  linkedin: "linkedin",
  email: "mail",
};

type HeroProps = Readonly<{
  common: Messages["common"];
  messages: Messages["hero"];
}>;

export function Hero({ common, messages }: HeroProps) {
  return (
    <section className={`${styles.hero} section`} id="home" aria-labelledby="hero-title">
      <div className={`${styles.heroGrid} container`} data-hero-grid>
        <div className={styles.copy} data-hero-copy data-reveal>
          <p className={styles.intro}>{messages.greeting}</p>
          <h1 className={styles.name} id="hero-title">{profile.name}</h1>
          <p className={styles.headline}>
            {messages.headlineLead} <span className={styles.headlineAccent}>{messages.headlineAccent}</span> {messages.headlineTail}
          </p>
        </div>

        <div className={styles.visualWrap} data-hero-visual data-reveal>
          <ProfileVisual portraitAlt={messages.portraitAlt} />
        </div>

        <div className={styles.details} data-hero-details data-reveal>
          <p className={styles.summary}>{messages.summary}</p>
          <p className={styles.availability}>{messages.availability}</p>

          <ul className={styles.techList} aria-label={messages.technologiesLabel}>
            {profile.focus.map((technology) => <li key={technology}>{technology}</li>)}
          </ul>

          <div className={styles.actions}>
            <ButtonLink href="#projects">
              {messages.viewProjects}
              <Icon name="arrowDown" size="sm" />
            </ButtonLink>
            <ButtonLink href="#contact" variant="secondary">{messages.contactMe}</ButtonLink>
            <ButtonLink download href={profile.resumeUrl} variant="ghost">
              <Icon name="download" size="sm" />
              {messages.downloadResume}
            </ButtonLink>
          </div>
        </div>

        <nav className={styles.socials} data-hero-socials data-reveal aria-label={messages.socialLinksLabel}>
          {socialLinks.map((link) => (
            <a
              className={styles.socialLink}
              href={link.href}
              key={link.platform}
              rel={link.external ? "noopener noreferrer" : undefined}
              target={link.external ? "_blank" : undefined}
            >
              <Icon name={socialIcons[link.platform]} size="sm" />
              {link.platform === "email" ? common.email : link.label}
              {link.external ? <span className="srOnly"> ({common.externalTab})</span> : null}
            </a>
          ))}
        </nav>
      </div>
    </section>
  );
}
