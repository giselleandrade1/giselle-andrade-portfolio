import type { MetadataRoute } from "next";
import { cookies } from "next/headers";

import { defaultLocale, getMessages, isLocale, localeCookieName } from "@/i18n";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const storedLocale = (await cookies()).get(localeCookieName)?.value;
  const locale = isLocale(storedLocale) ? storedLocale : defaultLocale;
  const messages = await getMessages(locale);

  return {
    name: messages.manifest.name,
    short_name: messages.manifest.shortName,
    description: messages.metadata.description,
    start_url: "/",
    display: "standalone",
    background_color: "#030711",
    theme_color: "#145bff",
    icons: [
      {
        src: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
