import { skills } from "@/data/skills";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Messages } from "@/i18n";

import styles from "./sections.module.css";

const technologyMarks: Record<string, string> = {
  java: "JV",
  javascript: "JS",
  typescript: "TS",
  python: "PY",
  php: "PHP",
  html5: "H5",
  css3: "C3",
  react: "RE",
  nextjs: "NX",
  tailwindcss: "TW",
  nodejs: "NO",
  express: "EX",
  nestjs: "NS",
  spring: "SP",
  jwt: "JW",
  mysql: "MY",
  postgresql: "PG",
  mongodb: "MG",
  "sql-server": "SQ",
  aws: "AWS",
  azure: "AZ",
  vercel: "VC",
  docker: "DK",
  git: "GT",
  github: "GH",
  postman: "PM",
  figma: "FG",
  notion: "NT",
};

type SkillsProps = {
  messages: Messages["skills"];
};

export function Skills({ messages }: SkillsProps) {
  return (
    <section className="section" id="skills" aria-label={messages.sectionLabel}>
      <div className="container">
        <div className={styles.sectionHeaderRow} data-reveal>
          <SectionHeading
            description={messages.description}
            eyebrow={messages.eyebrow}
            title={messages.title}
          />
          <p className={styles.sectionNote}>{messages.note}</p>
        </div>

        <div className={styles.stackGrid}>
          {skills.map((group, index) => (
            <article className={styles.stackCard} data-reveal key={group.category}>
              <div className={styles.stackCardHeader}>
                <h3>{messages.categories[group.category]}</h3>
                <span className={styles.stackIndex} aria-hidden="true">/{String(index + 1).padStart(2, "0")}</span>
              </div>
              <ul className={styles.technologyList}>
                {group.technologies.map((technology) => (
                  <li className={styles.technology} key={technology.name}>
                    <span className={styles.technologyMark} aria-hidden="true">
                      {technologyMarks[technology.slug] ?? technology.name.slice(0, 2)}
                    </span>
                    <span>{technology.name}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
