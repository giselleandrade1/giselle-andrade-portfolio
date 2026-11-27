export const LOCALES = ["pt-BR", "en", "es"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "pt-BR";
export const LOCALE_COOKIE = "lang";

/** Flag emoji shown in the language switcher, plus accessible names in each language. */
export const LOCALE_META: Record<Locale, { flag: string; name: string; ogLocale: string }> = {
  "pt-BR": { flag: "🇧🇷", name: "Português (Brasil)", ogLocale: "pt_BR" },
  en: { flag: "🇺🇸", name: "English", ogLocale: "en_US" },
  es: { flag: "🇪🇸", name: "Español", ogLocale: "es_ES" },
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}

export function readLocaleFromCookieHeader(cookie: string | null | undefined): Locale {
  const match = cookie?.match(new RegExp(`(?:^|;\\s*)${LOCALE_COOKIE}=([^;]+)`));
  const value = match?.[1] ? decodeURIComponent(match[1]) : null;
  return isLocale(value) ? value : DEFAULT_LOCALE;
}
