import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // /studio is gone with Sanity; /admin replaced it and is also marked
      // noindex in its own layout metadata.
      disallow: ["/admin/", "/api/"],
    },
    sitemap: "https://slic.agency/sitemap.xml",
  };
}
