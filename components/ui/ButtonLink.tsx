import type { ReactNode } from "react";
import styles from "./ui.module.css";

export type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  external?: boolean;
  download?: boolean;
  className?: string;
  ariaLabel?: string;
};

export function ButtonLink({
  href,
  children,
  variant = "primary",
  external = false,
  download = false,
  className,
  ariaLabel,
}: ButtonLinkProps) {
  const classes = [styles.button, styles[variant], className].filter(Boolean).join(" ");
  const externalDescription = "opens in a new tab";
  const accessibleLabel = ariaLabel
    ? `${ariaLabel}${external ? ` (${externalDescription})` : ""}`
    : undefined;

  return (
    <a
      aria-label={accessibleLabel}
      className={classes}
      data-ui-button
      download={download || undefined}
      href={href}
      rel={external ? "noopener noreferrer" : undefined}
      target={external ? "_blank" : undefined}
    >
      {children}
      {external && !ariaLabel ? (
        <span className={styles.srOnly}> ({externalDescription})</span>
      ) : null}
    </a>
  );
}
