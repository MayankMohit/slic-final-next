import { SITE_HOST } from "@/lib/site";

/**
 * Umami Cloud, the site's product analytics.
 *
 * Umami is cookieless: no persistent identifier is written to the browser. A
 * visitor is recognised only for the length of a day, by a hash of IP and user
 * agent against a salt that rotates daily, so yesterday's visitors cannot be
 * matched to today's. That property is what lets app/privacy/page.tsx say the
 * analytics sets no cookies and does not track across sites, and mean it. If
 * this ever moves to a tool that does set an identifier, that page has to
 * change in the same commit.
 *
 * The website ID is not a secret. It ships in a script tag on every page, so
 * anyone can read it with View Source. It lives here as a default rather than
 * a required environment variable for the same reason SITE_URL does in
 * lib/site.ts: the value is public, it is stable, and a missing env var on a
 * fresh deploy should not silently turn analytics off.
 */
export const UMAMI_WEBSITE_ID =
  process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID ||
  "c10dd620-0ad7-4a69-b319-74e5d67d812a";

/**
 * Umami Cloud's tracker. Overridable so the tag can be pointed at a self-hosted
 * instance or a first-party proxy. Note that changing this alone is not enough:
 * the tracker does not infer where to report from where it was loaded, it
 * defaults to gateway.umami.is, so a different backend needs data-host-url set
 * too. The ad blocker note in components/umami-analytics.tsx spells that out.
 */
export const UMAMI_SCRIPT_URL =
  process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL ||
  "https://cloud.umami.is/script.js";

/**
 * The only hostname allowed to report. Passed to the tracker as `data-domains`,
 * which makes it a client-side check: the script can load anywhere, but it
 * refuses to send unless location.hostname matches.
 *
 * This is the backstop, not the primary gate. UMAMI_ENABLED below already
 * keeps the tag off preview and development builds; this catches the case that
 * gate cannot see, which is a production bundle running somewhere unexpected —
 * a local `next build && next start`, a fork, a scraper mirroring the page.
 * Without it, every one of those quietly counts as real traffic.
 *
 * Derived from SITE_HOST so it cannot drift from the canonical host. www is
 * deliberately absent: it 301s to the apex, so no page is ever rendered there.
 */
export const UMAMI_ALLOWED_DOMAINS = SITE_HOST;

/**
 * Whether to render the tag at all. Server-only — VERCEL_ENV is not prefixed
 * with NEXT_PUBLIC_, so reading this from a Client Component would inline
 * `undefined` and evaluate false everywhere. app/layout.tsx is a Server
 * Component, which is where the decision is made.
 *
 * Production deployments only. Preview deploys share the same website ID, so
 * without the VERCEL_ENV check every pull request would fold its own traffic
 * into the client's numbers, and `next dev` would add the developer's refreshes
 * on top. Analytics that counts the people building the site is worse than no
 * analytics, because it looks correct.
 *
 * NEXT_PUBLIC_UMAMI_ENABLED=true forces it on, which is how you verify the
 * integration end to end from a preview URL. Note that UMAMI_ALLOWED_DOMAINS
 * will still refuse to send from a *.vercel.app hostname — to test from one,
 * set NEXT_PUBLIC_SITE_URL to that preview URL as well.
 */
export const UMAMI_ENABLED =
  process.env.NEXT_PUBLIC_UMAMI_ENABLED === "true" ||
  (process.env.NODE_ENV === "production" &&
    process.env.VERCEL_ENV === "production");
