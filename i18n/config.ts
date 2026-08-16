export const locales = ["en-US", "pt-BR", "es-ES"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en-US";
export const localeCookieName = "locale";
export const localeStorageKey = "locale";

export const localeOptions = [
  {
    locale: "en-US",
    label: "English (USA)",
    accessibleLabel: "English (United States)",
    flag: "/icons/flags/us.svg",
  },
  {
    locale: "pt-BR",
    label: "Português (PT-BR)",
    accessibleLabel: "Português (Brasil)",
    flag: "/icons/flags/br.svg",
  },
  {
    locale: "es-ES",
    label: "Español (España)",
    accessibleLabel: "Español (España)",
    flag: "/icons/flags/es.svg",
  },
] as const satisfies readonly {
  locale: Locale;
  label: string;
  accessibleLabel: string;
  flag: `/icons/flags/${string}.svg`;
}[];

export function isLocale(value: string | null | undefined): value is Locale {
  return locales.some((locale) => locale === value);
}
