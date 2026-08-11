"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { navItems, profile, socialLinks } from "@/data/profile";
import { useActiveSection } from "@/hooks/useActiveSection";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Icon } from "@/components/ui/Icon";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

import styles from "./layout.module.css";

const sectionIds = navItems.map((item) => item.href.slice(1));
const sectionAliases = {
  services: "skills",
  process: "experience",
  github: "projects",
} as const;

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const activeSection = useActiveSection(sectionIds, sectionAliases);
  const numberedItems = useMemo(
    () => navItems.map((item, index) => ({ ...item, number: String(index + 1).padStart(2, "0") })),
    [],
  );

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 16);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const desktopQuery = window.matchMedia("(min-width: 73.75rem)");
    const closeOnDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) setIsOpen(false);
    };

    desktopQuery.addEventListener("change", closeOnDesktop);
    return () => desktopQuery.removeEventListener("change", closeOnDesktop);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const menuButton = menuButtonRef.current;
    const animationFrame = window.requestAnimationFrame(() => closeButtonRef.current?.focus());
    document.body.dataset.menuOpen = "true";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setIsOpen(false);
        return;
      }

      if (event.key !== "Tab" || !drawerRef.current) return;

      const focusable = Array.from(
        drawerRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );
      const first = focusable[0];
      const last = focusable.at(-1);

      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      document.removeEventListener("keydown", handleKeyDown);
      delete document.body.dataset.menuOpen;
      menuButton?.focus();
    };
  }, [isOpen]);

  const closeMenu = () => setIsOpen(false);

  return (
    <header className={styles.header} data-scrolled={isScrolled}>
      <div className={styles.headerBar}>
        <a className={styles.brand} href="#home">
          <span className={styles.brandGlyph} aria-hidden="true">
            <span className={styles.brandMark}>&lt;</span>
            GA
            <span className={styles.brandMark}>/&gt;</span>
          </span>
          <span className="srOnly">Giselle.dev, home</span>
        </a>

        <nav className={styles.desktopNav} aria-label="Primary navigation">
          <ul className={styles.navList}>
            {navItems.map((item) => {
              const id = item.href.slice(1);
              const isActive = activeSection === id;
              return (
                <li key={item.href}>
                  <a
                    aria-current={isActive ? "location" : undefined}
                    className={styles.navLink}
                    data-active={isActive}
                    href={item.href}
                  >
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className={styles.headerActions}>
          {socialLinks.slice(0, 2).map((link) => (
            <a
              aria-label={`${link.label} profile (opens in a new tab)`}
              className={`${styles.iconLink} ${styles.desktopSocial}`}
              href={link.href}
              key={link.platform}
              rel="noopener noreferrer"
              target="_blank"
            >
              <Icon name={link.platform === "github" ? "github" : "linkedin"} size="md" />
            </a>
          ))}
          <ThemeToggle />
          <ButtonLink className={styles.desktopResume} download href={profile.resumeUrl} variant="secondary">
            <Icon name="download" size="sm" />
            Resume
          </ButtonLink>
          <button
            aria-controls="mobile-navigation"
            aria-expanded={isOpen}
            aria-label="Open navigation menu"
            className={styles.menuButton}
            onClick={() => setIsOpen(true)}
            ref={menuButtonRef}
            type="button"
          >
            <Icon name="menu" />
          </button>
        </div>
      </div>

      <div
        aria-hidden={!isOpen}
        className={styles.mobileLayer}
        data-open={isOpen}
        inert={!isOpen}
      >
        <button aria-label="Close navigation menu" className={styles.backdrop} onClick={closeMenu} tabIndex={-1} type="button" />
        <div
          aria-label="Navigation menu"
          aria-modal="true"
          className={styles.drawer}
          id="mobile-navigation"
          ref={drawerRef}
          role="dialog"
        >
          <div className={styles.drawerHeader}>
            <span className={styles.drawerLabel}>Navigation</span>
            <button aria-label="Close navigation menu" className={styles.closeButton} onClick={closeMenu} ref={closeButtonRef} type="button">
              <Icon name="close" />
            </button>
          </div>

          <nav aria-label="Mobile navigation">
            <ul className={styles.mobileNavList}>
              {numberedItems.map((item) => {
                const id = item.href.slice(1);
                const isActive = activeSection === id;
                return (
                  <li key={item.href}>
                    <a
                      aria-current={isActive ? "location" : undefined}
                      className={styles.mobileNavLink}
                      data-active={isActive}
                      href={item.href}
                      onClick={closeMenu}
                    >
                      <span>{item.label}</span>
                      <span aria-hidden="true">{item.number}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className={styles.drawerFooter}>
            <div className={styles.drawerActions}>
              {socialLinks.slice(0, 2).map((link) => (
                <a
                  className={styles.drawerSocial}
                  href={link.href}
                  key={link.platform}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <Icon name={link.platform === "github" ? "github" : "linkedin"} size="md" />
                  {link.label}
                  <span className="srOnly"> (opens in a new tab)</span>
                </a>
              ))}
            </div>
            <ButtonLink className={styles.drawerResume} download href={profile.resumeUrl} variant="primary">
              <Icon name="download" size="sm" />
              Download resume
            </ButtonLink>
          </div>
        </div>
      </div>
    </header>
  );
}
