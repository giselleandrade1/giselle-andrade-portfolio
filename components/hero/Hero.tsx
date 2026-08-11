import { profile, socialLinks } from "@/data/profile";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Icon, type IconName } from "@/components/ui/Icon";

import { ProfileVisual } from "./ProfileVisual";
import styles from "./hero.module.css";

const socialIcons: Record<(typeof socialLinks)[number]["platform"], IconName> = {
  github: "github",
  linkedin: "linkedin",
  email: "mail",
};

export function Hero() {
  return (
    <section className={`${styles.hero} section`} id="home" aria-labelledby="hero-title">
      <div className={`${styles.heroGrid} container`} data-hero-grid>
        <div className={styles.copy} data-hero-copy data-reveal>
          <p className={styles.intro}>Hello, I&apos;m</p>
          <h1 className={styles.name} id="hero-title">{profile.name}</h1>
          <p className={styles.headline}>
            {profile.headlineLead} <span className={styles.headlineAccent}>{profile.headlineAccent}</span> {profile.headlineTail}
          </p>
        </div>

        <div className={styles.details} data-hero-details data-reveal>
          <p className={styles.summary}>{profile.summary}</p>
          <p className={styles.availability}>{profile.availability}</p>

          <div className={styles.techList} aria-label="Primary technologies">
            {profile.focus.map((technology) => <span key={technology}>{technology}</span>)}
          </div>

          <div className={styles.actions}>
            <ButtonLink href="#projects">
              View projects
              <Icon name="arrowDown" size="sm" />
            </ButtonLink>
            <ButtonLink href="#contact" variant="secondary">Contact me</ButtonLink>
            <ButtonLink download href={profile.resumeUrl} variant="ghost">
              <Icon name="download" size="sm" />
              Download CV
            </ButtonLink>
          </div>

        </div>

        <div className={styles.visualWrap} data-hero-visual data-reveal>
          <ProfileVisual />
        </div>

        <div className={styles.socials} data-hero-socials data-reveal aria-label="Social links">
            {socialLinks.map((link) => (
              <a
                className={styles.socialLink}
                href={link.href}
                key={link.platform}
                rel={link.external ? "noopener noreferrer" : undefined}
                target={link.external ? "_blank" : undefined}
              >
                <Icon name={socialIcons[link.platform]} size="sm" />
                {link.label}
                {link.external ? <span className="srOnly"> (opens in a new tab)</span> : null}
              </a>
            ))}
        </div>
      </div>
    </section>
  );
}
