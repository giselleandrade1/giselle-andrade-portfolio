import { profile } from "@/data/profile";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";

import styles from "./sections.module.css";

const principles = [
  {
    title: "Engineering foundations",
    description: "Business rules, data, APIs, and architecture shape the product from the inside out.",
  },
  {
    title: "Thoughtful interfaces",
    description: "Clear hierarchy, responsive behavior, and accessible interaction are part of software quality.",
  },
  {
    title: "Continuous practice",
    description: "Real projects turn study into documented decisions, working features, and better judgment.",
  },
] as const;

const highlights = [
  "Backend Development",
  "Scalable Applications",
  "Clean Code",
  "UI/UX Awareness",
  "Real Projects",
  "Continuous Learning",
] as const;

export function About() {
  return (
    <section className="section" id="about" aria-label="About Giselle Andrade">
      <div className="container">
        <div className={styles.sectionHeaderRow} data-reveal>
          <SectionHeading
            description="I connect backend thinking, interface craft, and product awareness to build software that is useful, understandable, and ready to evolve."
            eyebrow="About me"
            title="Technology with intent, from system logic to the final interaction."
          />
          <p className={styles.sectionNote}>Based in {profile.location} · Building in public through documented, deployed projects.</p>
        </div>

        <div className={styles.aboutLayout}>
          <article className={`${styles.aboutStory} ${styles.surfaceCard}`} data-reveal>
            <p className={styles.storyLabel}>
              <Icon name="terminal" size="sm" />
              How I work
            </p>
            <h3>Reliable foundations. Clear experiences.</h3>
            <p>{profile.bio}</p>
            <div className={styles.highlights} aria-label="Areas of focus">
              {highlights.map((highlight) => <span key={highlight}>{highlight}</span>)}
            </div>
          </article>

          <div className={styles.principles} aria-label="Development principles">
            {principles.map((principle, index) => (
              <article className={styles.principle} data-reveal key={principle.title}>
                <span className={styles.principleNumber} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{principle.title}</h3>
                  <p>{principle.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
