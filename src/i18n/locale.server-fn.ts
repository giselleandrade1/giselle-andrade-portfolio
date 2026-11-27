import { createIsomorphicFn } from "@tanstack/react-start";
import { getCookie } from "@tanstack/react-start/server";

import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  isLocale,
  readLocaleFromCookieHeader,
  type Locale,
} from "./config";

/** Reads the visitor's saved language: request cookie on the server, document.cookie in the browser. */
export const getInitialLocale = createIsomorphicFn()
  .server((): Locale => {
    const value = getCookie(LOCALE_COOKIE);
    return isLocale(value) ? value : DEFAULT_LOCALE;
  })
  .client((): Locale => readLocaleFromCookieHeader(document.cookie));
