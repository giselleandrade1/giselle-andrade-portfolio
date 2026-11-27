import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { LOCALE_COOKIE, type Locale } from "./config";
import { getContent } from "./content";
import { dictionaries, type Dictionary } from "./ui";

type LocaleContextValue = { locale: Locale; setLocale: (locale: Locale) => void };

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ initial, children }: { initial: Locale; children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(initial);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    // One year; read back on the server so the next visit renders in this language.
    document.cookie = `${LOCALE_COOKIE}=${encodeURIComponent(next)}; path=/; max-age=31536000; samesite=lax`;
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const value = useMemo(() => ({ locale, setLocale }), [locale, setLocale]);
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used inside <LocaleProvider>");
  return ctx;
}

/** UI strings for the active language. */
export function useT(): Dictionary {
  return dictionaries[useLocale().locale];
}

/** Portfolio content (profile, projects, experience…) in the active language. */
export function useContent() {
  return getContent(useLocale().locale);
}
