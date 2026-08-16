"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { navItems, profile, socialLinks } from "@/data/profile";
import { useActiveSection } from "@/hooks/useActiveSection";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Icon } from "@/components/ui/Icon";
import { LanguageSelector } from "@/components/ui/LanguageSelector";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import {
  isLocale,
  localeCookieName,
  localeStorageKey,
  type Locale,
  type Messages,
} from "@/i18n";

import styles from "./layout.module.css";

const sectionIds = navItems.map((item) => item.href.slice(1));
const sectionAliases = {
  services: "skills",
  process: "experience",
  github: "projects",
} as const;
const localeNavigationStateKey = "portfolio:locale-navigation";

type HeaderMessages = Readonly<{
  common: Messages["common"];
  language: Messages["language"];
  navigation: Messages["navigation"];
  theme: Messages["theme"];
}>;

export function Header({
  locale,
  messages,
}: Readonly<{ locale: Locale; messages: HeaderMessages }>) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [displayLocale, setDisplayLocale] = useState(locale);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const headerBarRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const activeSection = useActiveSection(sectionIds, sectionAliases);
  const numberedItems = useMemo(
    () => navItems.map((item, index) => ({ href: item.href, number: String(index + 1).padStart(2, "0") })),
    [],
  );

  useEffect(() => {
    let firstFrame = 0;
    let secondFrame = 0;
    let finalTimer = 0;

    try {
      const serializedState = window.sessionStorage.getItem(localeNavigationStateKey);
      if (!serializedState) return;

      const navigationState = JSON.parse(serializedState) as {
        hash: string;
        locale: Locale;
        x: number;
        y: number;
      };
      if (navigationState.locale !== locale) return;

      const restoreNavigationState = () => {
        if (navigationState.hash) {
          window.history.replaceState(
            window.history.state,
            "",
            `${window.location.pathname}${window.location.search}${navigationState.hash}`,
          );
        }
        window.scrollTo(navigationState.x, navigationState.y);
      };

      restoreNavigationState();
      firstFrame = window.requestAnimationFrame(() => {
        restoreNavigationState();
        secondFrame = window.requestAnimationFrame(restoreNavigationState);
      });
      finalTimer = window.setTimeout(() => {
        restoreNavigationState();
        window.sessionStorage.removeItem(localeNavigationStateKey);
      }, 180);
    } catch {
      // A locale change still works if session storage is unavailable.
    }

    return () => {
      window.cancelAnimationFrame(firstFrame);
      window.cancelAnimationFrame(secondFrame);
      window.clearTimeout(finalTimer);
    };
  }, [locale]);

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
    const backgroundRegions = [
      headerBarRef.current,
      document.querySelector<HTMLElement>("main"),
      document.querySelector<HTMLElement>("footer"),
    ].filter((region): region is HTMLElement => Boolean(region));
    const animationFrame = window.requestAnimationFrame(() => closeButtonRef.current?.focus());
    document.body.dataset.menuOpen = "true";
    backgroundRegions.forEach((region) => {
      region.inert = true;
    });

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
      backgroundRegions.forEach((region) => {
        region.inert = false;
      });
      menuButton?.focus();
    };
  }, [isOpen]);

  const closeMenu = () => setIsOpen(false);

  function changeLocale(nextLocale: Locale) {
    if (nextLocale === displayLocale) return;

    setDisplayLocale(nextLocale);
    document.documentElement.lang = nextLocale;
    document.documentElement.dataset.locale = nextLocale;
    document.cookie = `${localeCookieName}=${nextLocale}; Path=/; Max-Age=31536000; SameSite=Lax`;

    try {
      window.localStorage.setItem(localeStorageKey, nextLocale);
      window.sessionStorage.setItem(localeNavigationStateKey, JSON.stringify({
        hash: window.location.hash,
        locale: nextLocale,
        x: window.scrollX,
        y: window.scrollY,
      }));
    } catch {
      // The locale URL and cookie remain the source of truth when storage is unavailable.
    }

    const segments = (pathname ?? `/${locale}`).split("/");
    if (isLocale(segments[1])) segments[1] = nextLocale;
    else segments.splice(1, 0, nextLocale);

    if (window.location.hash) {
      window.history.replaceState(
        window.history.state,
        "",
        `${window.location.pathname}${window.location.search}`,
      );
    }
    router.replace(segments.join("/"), { scroll: false });
  }

  return (
    <header className={styles.header} data-scrolled={isScrolled}>
      <div className={styles.headerBar} data-header-bar ref={headerBarRef}>
        <a className={styles.brand} href="#home">
          <span className={styles.brandGlyph} aria-hidden="true">
            <span className={styles.brandMark}>&lt;</span>
            GA
            <span className={styles.brandMark}>/&gt;</span>
          </span>
          <span className="srOnly">{messages.navigation.brandHome}</span>
        </a>

        <nav className={styles.desktopNav} aria-label={messages.navigation.primaryLabel}>
          <ul className={styles.navList}>
            {navItems.map((item) => {
              const id = item.href.slice(1);
              const label = messages.navigation.links[id as keyof typeof messages.navigation.links];
              const isActive = activeSection === id;
              return (
                <li key={item.href}>
                  <a
                    aria-current={isActive ? "location" : undefined}
                    className={styles.navLink}
                    data-active={isActive}
                    href={item.href}
                  >
                    {label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className={styles.headerActions}>
          <ThemeToggle messages={messages.theme} />
          <LanguageSelector
            labels={{
              changeLanguage: messages.language.buttonLabel,
              currentLanguage: messages.language.currentLanguage,
              languageMenu: messages.language.menuLabel,
            }}
            locale={displayLocale}
            onLocaleChange={changeLocale}
          />
          <ButtonLink className={styles.desktopResume} download href={profile.resumeUrl} variant="secondary">
            <Icon name="download" size="sm" />
            {messages.navigation.resume}
          </ButtonLink>
          <button
            aria-controls="mobile-navigation"
            aria-expanded={isOpen}
            aria-label={messages.navigation.openMenu}
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
        <button aria-label={messages.navigation.closeMenu} className={styles.backdrop} onClick={closeMenu} tabIndex={-1} type="button" />
        <div
          aria-label={messages.navigation.dialogLabel}
          aria-modal="true"
          className={styles.drawer}
          id="mobile-navigation"
          ref={drawerRef}
          role="dialog"
        >
          <div className={styles.drawerHeader}>
            <span className={styles.drawerLabel}>{messages.navigation.drawerTitle}</span>
            <button aria-label={messages.navigation.closeMenu} className={styles.closeButton} onClick={closeMenu} ref={closeButtonRef} type="button">
              <Icon name="close" />
            </button>
          </div>

          <nav aria-label={messages.navigation.mobileLabel}>
            <ul className={styles.mobileNavList}>
              {numberedItems.map((item) => {
                const id = item.href.slice(1);
                const label = messages.navigation.links[id as keyof typeof messages.navigation.links];
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
                      <span>{label}</span>
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
                  {link.platform === "email" ? messages.common.email : link.label}
                  <span className="srOnly"> ({messages.common.externalTab})</span>
                </a>
              ))}
            </div>
            <ButtonLink className={styles.drawerResume} download href={profile.resumeUrl} variant="primary">
              <Icon name="download" size="sm" />
              {messages.navigation.downloadResume}
            </ButtonLink>
          </div>
        </div>
      </div>
    </header>
  );
}
