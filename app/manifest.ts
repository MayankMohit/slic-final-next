import type { MetadataRoute } from "next";

/**
 * Web app manifest, served at /manifest.webmanifest.
 *
 * Its real job here is Android: "Add to home screen" reads the icons and the
 * name from this file, and without it Chrome screenshots the page and uses that
 * instead. The desktop tab icon comes from app/favicon.ico, and iOS reads
 * app/apple-icon.png, so between the three every surface is covered.
 *
 * display is "browser" on purpose. standalone or minimal-ui is what makes
 * Chrome offer to install the site, and a marketing site that asks to be
 * installed as an app is pretending to be something it is not. The icons still
 * apply either way; only the install prompt is being declined. Switch it to
 * "standalone" if that ever changes.
 *
 * Both icon files come from scripts/generate-icons.mjs. Run that rather than
 * exporting them by hand, so all four sizes stay cut from the same source.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SLIC | Performance Creative Agency for DTC Brands",
    short_name: "SLIC",
    description:
      "Performance video ad creative for DTC brands scaling on Meta, TikTok, and YouTube.",
    start_url: "/",
    display: "browser",
    // Matches the themeColor in app/layout.tsx. Two places, because the viewport
    // export drives the browser chrome and this drives the splash screen.
    background_color: "#0a0f1a",
    theme_color: "#0a0f1a",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
