"use client";

import { useSyncExternalStore } from "react";

import type { Messages } from "@/i18n";

import { Icon } from "./Icon";
import styles from "./ui.module.css";

type Theme = "dark" | "light";

const THEME_STORAGE_KEY = "theme";

function isTheme(value: string | null | undefined): value is Theme {
  return value === "dark" || value === "light";
}

function getSystemTheme(mediaQuery?: MediaQueryList): Theme {
  const prefersDark = mediaQuery
    ? mediaQuery.matches
    : window.matchMedia("(prefers-color-scheme: dark)").matches;

  return prefersDark ? "dark" : "light";
}

function getStoredTheme(): Theme | null {
  try {
    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    return isTheme(storedTheme) ? storedTheme : null;
  } catch {
    return null;
  }
}

function updateThemeColor(theme: Theme) {
  const color = theme === "dark" ? "#030711" : "#f6f8fc";
  document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]').forEach((meta) => {
    meta.content = color;
  });
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.dataset.resolvedTheme = theme;
  root.style.colorScheme = theme;
  updateThemeColor(theme);
}

function announceThemeChange() {
  window.dispatchEvent(new Event("themechange"));
}

function getThemeSnapshot(): Theme {
  const documentTheme = document.documentElement.dataset.theme;
  return isTheme(documentTheme) ? documentTheme : getStoredTheme() ?? getSystemTheme();
}

function getServerThemeSnapshot(): Theme {
  return "dark";
}

function subscribeToTheme(listener: () => void) {
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  updateThemeColor(getThemeSnapshot());

  function handleThemeChange() {
    listener();
  }

  function handleSystemThemeChange() {
    if (getStoredTheme()) return;
    applyTheme(getSystemTheme(mediaQuery));
    announceThemeChange();
  }

  function handleStorageChange(event: StorageEvent) {
    if (event.key !== THEME_STORAGE_KEY && event.key !== null) return;
    applyTheme(isTheme(event.newValue) ? event.newValue : getSystemTheme(mediaQuery));
    announceThemeChange();
  }

  window.addEventListener("themechange", handleThemeChange);
  window.addEventListener("storage", handleStorageChange);
  mediaQuery.addEventListener("change", handleSystemThemeChange);

  return () => {
    window.removeEventListener("themechange", handleThemeChange);
    window.removeEventListener("storage", handleStorageChange);
    mediaQuery.removeEventListener("change", handleSystemThemeChange);
  };
}

export function ThemeToggle({ messages }: { messages: Messages["theme"] }) {
  const theme = useSyncExternalStore(
    subscribeToTheme,
    getThemeSnapshot,
    getServerThemeSnapshot,
  );
  const nextTheme: Theme = theme === "dark" ? "light" : "dark";
  const accessibleLabel =
    nextTheme === "light" ? messages.switchToLight : messages.switchToDark;

  function toggleTheme() {
    applyTheme(nextTheme);

    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    } catch {
      // The selected theme still applies for this page when storage is unavailable.
    }

    announceThemeChange();
  }

  return (
    <button
      aria-label={accessibleLabel}
      className={styles.themeToggle}
      data-theme-toggle
      onClick={toggleTheme}
      title={accessibleLabel}
      type="button"
    >
      <span className={styles.themeIconStack} aria-hidden="true">
        <span className={`${styles.themeIcon} ${styles.themeIconSun}`}>
          <Icon name="sun" size="md" />
        </span>
        <span className={`${styles.themeIcon} ${styles.themeIconMoon}`}>
          <Icon name="moon" size="md" />
        </span>
      </span>
    </button>
  );
}
