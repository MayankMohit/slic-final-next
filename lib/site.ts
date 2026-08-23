/**
 * The one hostname this site is canonical at.
 *
 * The canonical host is the apex, slic.agency. www.slic.agency 301s to it (see
 * the redirect in next.config.mjs). Picking one and declaring it consistently
 * is the whole point: a canonical tag naming a host that redirects tells
 * Google the page it is looking at is a duplicate of a URL that does not
 * resolve, which splits ranking signals across two hostnames.
 *
 * Everything that has to name the site absolutely — metadataBase, sitemap.xml,
 * robots.txt, the Organization and Article JSON-LD, transactional email —
 * imports this. That is deliberate: the failure mode being fixed here was four
 * separate hardcoded copies drifting apart, and one constant makes that
 * impossible rather than merely unlikely. It is also why reversing the
 * apex/www decision costs one line here instead of an audit of the codebase.
 *
 * Relative URLs are preferred where Next resolves them for us. Every page's
 * `alternates.canonical` is a path like "/work", resolved against
 * `metadataBase` in app/layout.tsx — so the host is stated exactly once for
 * all of them.
 *
 * NEXT_PUBLIC_SITE_URL overrides it, which is what preview deployments want.
 * An invalid value fails the build at `new URL(...)` rather than shipping a
 * broken canonical, which is the right way round. Note that setting it to the
 * www host in production silently inverts the redirect too — that is
 * intentional, the two are meant to move together.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://slic.agency"
).replace(/\/+$/, "");

/** Host only, no protocol — "slic.agency". */
export const SITE_HOST = new URL(SITE_URL).host;

/** Absolute URL for a site-relative path: absoluteUrl("/work"). */
export function absoluteUrl(path: string) {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
