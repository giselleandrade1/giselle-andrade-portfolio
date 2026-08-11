import { skills } from "@/data/skills";
import { SectionHeading } from "@/components/ui/SectionHeading";

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

export function Skills() {
  return (
    <section className="section" id="skills" aria-label="Technical skills">
      <div className="container">
        <div className={styles.sectionHeaderRow} data-reveal>
          <SectionHeading
            description="A growing toolkit for interfaces, APIs, data, delivery, and the engineering work that connects them."
            eyebrow="Technical toolkit"
            title="Tools chosen for the problem, not for the trend."
          />
          <p className={styles.sectionNote}>Six practical areas · No remote icon requests · Lightweight, local interface marks.</p>
        </div>

        <div className={styles.stackGrid}>
          {skills.map((group, index) => (
            <article className={styles.stackCard} data-reveal key={group.category}>
              <div className={styles.stackCardHeader}>
                <h3>{group.category}</h3>
                <span className={styles.stackIndex} aria-hidden="true">/{String(index + 1).padStart(2, "0")}</span>
              </div>
              <div className={styles.technologyList}>
                {group.technologies.map((technology) => (
                  <span className={styles.technology} key={technology.name}>
                    <span className={styles.technologyMark} aria-hidden="true">
                      {technologyMarks[technology.slug] ?? technology.name.slice(0, 2)}
                    </span>
                    <span>{technology.name}</span>
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
