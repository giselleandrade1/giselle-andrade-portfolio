"use client";

import { useSyncExternalStore } from "react";
import { Icon } from "./Icon";
import styles from "./ui.module.css";

type Theme = "dark" | "light";

const THEME_STORAGE_KEY = "theme";

function isTheme(value: string | null | undefined): value is Theme {
  return value === "dark" || value === "light";
}

function getStoredTheme(): Theme | null {
  try {
    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    return isTheme(storedTheme) ? storedTheme : null;
  } catch {
    return null;
  }
}

function getSystemTheme(mediaQuery?: MediaQueryList): Theme {
  const prefersLight = mediaQuery
    ? mediaQuery.matches
    : window.matchMedia("(prefers-color-scheme: light)").matches;

  return prefersLight ? "light" : "dark";
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
}

const themeListeners = new Set<() => void>();

function emitThemeChange() {
  themeListeners.forEach((listener) => listener());
}

function getThemeSnapshot(): Theme {
  const documentTheme = document.documentElement.dataset.theme;
  if (isTheme(documentTheme)) return documentTheme;
  return getStoredTheme() ?? getSystemTheme();
}

function getServerThemeSnapshot(): Theme {
  return "dark";
}

function subscribeToTheme(listener: () => void) {
  const mediaQuery = window.matchMedia("(prefers-color-scheme: light)");

  function handleSystemThemeChange(event: MediaQueryListEvent) {
    if (getStoredTheme() !== null) return;
    applyTheme(event.matches ? "light" : "dark");
    emitThemeChange();
  }

  function handleStorageChange(event: StorageEvent) {
    if (event.key !== THEME_STORAGE_KEY) return;
    applyTheme(isTheme(event.newValue) ? event.newValue : getSystemTheme(mediaQuery));
    emitThemeChange();
  }

  themeListeners.add(listener);
  mediaQuery.addEventListener("change", handleSystemThemeChange);
  window.addEventListener("storage", handleStorageChange);

  return () => {
    themeListeners.delete(listener);
    mediaQuery.removeEventListener("change", handleSystemThemeChange);
    window.removeEventListener("storage", handleStorageChange);
  };
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribeToTheme, getThemeSnapshot, getServerThemeSnapshot);

  function toggleTheme() {
    const nextTheme: Theme = theme === "dark" ? "light" : "dark";

    applyTheme(nextTheme);

    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    } catch {
      // The selected theme still applies for this page when storage is unavailable.
    }
    emitThemeChange();
  }

  const nextTheme = theme === "light" ? "dark" : "light";
  const accessibleLabel = `Switch to ${nextTheme} theme`;

  return (
    <button
      aria-label={accessibleLabel}
      className={styles.themeToggle}
      onClick={toggleTheme}
      title={accessibleLabel}
      type="button"
    >
      <Icon name={theme === "light" ? "moon" : "sun"} size="md" />
    </button>
  );
}
