"use client";

import { useEffect, useId, useRef, useState } from "react";

import { Icon } from "./Icon";
import styles from "./ui.module.css";

export type LanguageLocale = "en-US" | "pt-BR" | "es-ES";

export type LanguageSelectorLabels = Readonly<{
  changeLanguage: string;
  currentLanguage: string;
  languageMenu: string;
}>;

export type LanguageSelectorProps = Readonly<{
  className?: string;
  labels?: LanguageSelectorLabels;
  locale: LanguageLocale;
  onLocaleChange: (locale: LanguageLocale) => void;
}>;

type LanguageOption = Readonly<{
  accessibleName: string;
  flag: string;
  label: string;
  locale: LanguageLocale;
}>;

const languageOptions: readonly LanguageOption[] = [
  {
    accessibleName: "English (United States)",
    flag: "/icons/flags/us.svg",
    label: "English (USA)",
    locale: "en-US",
  },
  {
    accessibleName: "Português (Brasil)",
    flag: "/icons/flags/br.svg",
    label: "Português (PT-BR)",
    locale: "pt-BR",
  },
  {
    accessibleName: "Español (España)",
    flag: "/icons/flags/es.svg",
    label: "Español (España)",
    locale: "es-ES",
  },
] as const;

const defaultLabels: Readonly<Record<LanguageLocale, LanguageSelectorLabels>> = {
  "en-US": {
    changeLanguage: "Change language",
    currentLanguage: "Current language",
    languageMenu: "Languages",
  },
  "pt-BR": {
    changeLanguage: "Alterar idioma",
    currentLanguage: "Idioma atual",
    languageMenu: "Idiomas",
  },
  "es-ES": {
    changeLanguage: "Cambiar idioma",
    currentLanguage: "Idioma actual",
    languageMenu: "Idiomas",
  },
};

function Flag({ option }: Readonly<{ option: LanguageOption }>) {
  return (
    // Local SVGs intentionally avoid platform-dependent flag emoji rendering.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt=""
      aria-hidden="true"
      className={styles.languageFlag}
      draggable="false"
      height="16"
      src={option.flag}
      width="24"
    />
  );
}

export function LanguageSelector({
  className,
  labels,
  locale,
  onLocaleChange,
}: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(() =>
    languageOptions.findIndex((option) => option.locale === locale),
  );
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const generatedId = useId();
  const menuId = `language-menu-${generatedId}`;
  const resolvedLabels = labels ?? defaultLabels[locale];
  const currentIndex = Math.max(
    0,
    languageOptions.findIndex((option) => option.locale === locale),
  );
  const currentOption = languageOptions[currentIndex];
  const triggerLabel = `${resolvedLabels.changeLanguage}. ${resolvedLabels.currentLanguage}: ${currentOption.accessibleName}.`;

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setIsOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const animationFrame = window.requestAnimationFrame(() => {
      optionRefs.current[activeIndex]?.focus();
    });

    return () => window.cancelAnimationFrame(animationFrame);
  }, [activeIndex, isOpen]);

  function openMenu(initialIndex = currentIndex) {
    setActiveIndex(initialIndex);
    setIsOpen(true);
  }

  function closeMenu({ restoreFocus = false } = {}) {
    setIsOpen(false);
    if (restoreFocus) triggerRef.current?.focus();
  }

  function focusOption(index: number) {
    const normalizedIndex =
      (index + languageOptions.length) % languageOptions.length;
    setActiveIndex(normalizedIndex);
    optionRefs.current[normalizedIndex]?.focus();
  }

  function handleTriggerKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      openMenu(0);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      openMenu(languageOptions.length - 1);
    }
  }

  function handleMenuKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        focusOption(activeIndex + 1);
        break;
      case "ArrowUp":
        event.preventDefault();
        focusOption(activeIndex - 1);
        break;
      case "Home":
        event.preventDefault();
        focusOption(0);
        break;
      case "End":
        event.preventDefault();
        focusOption(languageOptions.length - 1);
        break;
      case "Escape":
        event.preventDefault();
        event.stopPropagation();
        closeMenu({ restoreFocus: true });
        break;
      case "Tab":
        closeMenu();
        break;
      default:
        break;
    }
  }

  function selectLanguage(nextLocale: LanguageLocale) {
    if (nextLocale !== locale) onLocaleChange(nextLocale);
    closeMenu({ restoreFocus: true });
  }

  return (
    <div
      className={[styles.languageSelector, className].filter(Boolean).join(" ")}
      ref={rootRef}
    >
      <button
        aria-controls={menuId}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label={triggerLabel}
        className={styles.languageButton}
        data-language-toggle
        onClick={() => (isOpen ? closeMenu() : openMenu())}
        onKeyDown={handleTriggerKeyDown}
        ref={triggerRef}
        title={resolvedLabels.changeLanguage}
        type="button"
      >
        <Flag option={currentOption} />
      </button>

      {isOpen ? (
        <div
          aria-label={resolvedLabels.languageMenu}
          className={styles.languageMenu}
          id={menuId}
          onKeyDown={handleMenuKeyDown}
          role="menu"
        >
          {languageOptions.map((option, index) => {
            const isSelected = option.locale === locale;

            return (
              <button
                aria-checked={isSelected}
                aria-label={option.accessibleName}
                className={styles.languageOption}
                data-selected={isSelected}
                key={option.locale}
                lang={option.locale}
                onClick={() => selectLanguage(option.locale)}
                ref={(element) => {
                  optionRefs.current[index] = element;
                }}
                role="menuitemradio"
                tabIndex={index === activeIndex ? 0 : -1}
                type="button"
              >
                <Flag option={option} />
                <span className={styles.languageOptionLabel}>{option.label}</span>
                <span
                  aria-hidden="true"
                  className={styles.languageOptionIndicator}
                  data-visible={isSelected}
                >
                  <Icon name="check" size="sm" />
                </span>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
