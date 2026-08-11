import Image from "next/image";

import { profile } from "@/data/profile";

import styles from "./hero.module.css";

export function ProfileVisual() {
  return (
    <div className={styles.visual}>
      <div className={styles.gridPanel} aria-hidden="true" />
      <div className={styles.portraitFrame} data-portrait>
        <Image
          src={profile.avatar}
          alt={profile.avatarAlt}
          fill
          priority
          sizes="(max-width: 479px) 76vw, (max-width: 991px) 400px, (max-width: 1279px) 380px, (max-width: 1599px) 30vw, 464px"
        />
      </div>

      <div className={styles.terminal} data-float="true" aria-hidden="true">
        <div className={styles.terminalHeader}>
          <i />
          <i />
          <i />
          <span>profile.ts</span>
        </div>
        <code>
          <span>const</span> focus = [&quot;backend&quot;, &quot;quality&quot;];
          <br />
          build(&quot;thoughtful products&quot;);
        </code>
      </div>

      <span className={`${styles.floatingBadge} ${styles.badgeOne}`} data-float="true" aria-hidden="true">
        Java / APIs
      </span>
      <span className={`${styles.floatingBadge} ${styles.badgeTwo}`} data-float="true" aria-hidden="true">
        React / Next.js
      </span>
      <span className={`${styles.floatingBadge} ${styles.badgeThree}`} data-float="true" aria-hidden="true">
        TypeScript
      </span>
    </div>
  );
}
