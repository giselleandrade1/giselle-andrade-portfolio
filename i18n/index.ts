import { isLocale, type Locale } from "./config";
import { enUS } from "./messages/en-US";
import type { Messages } from "./types";

export { defaultLocale, isLocale, localeCookieName, locales, localeOptions, localeStorageKey } from "./config";
export type { Locale } from "./config";
export { formatMessage } from "./types";
export type { Messages } from "./types";

const messageLoaders: Record<Locale, () => Promise<{ default: Messages }>> = {
  "en-US": async () => ({ default: enUS }),
  "pt-BR": async () => ({ default: (await import("./messages/pt-BR")).ptBR }),
  "es-ES": async () => ({ default: (await import("./messages/es-ES")).esES }),
};

export async function getMessages(locale: Locale): Promise<Messages> {
  return (await messageLoaders[locale]()).default;
}

export async function getMessagesFor(value: string): Promise<Messages | null> {
  return isLocale(value) ? getMessages(value) : null;
}
