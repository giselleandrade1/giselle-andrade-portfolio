import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Giselle Andrade — Full Stack Developer",
    short_name: "Giselle.dev",
    description: siteConfig.description,
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
