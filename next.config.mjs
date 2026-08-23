/** @type {import('next').NextConfig} */

// Kept in step with lib/site.ts by reading the same variable and defaulting to
// the same value. next.config.mjs cannot import the TypeScript module, so this
// is the one place the canonical host is restated — if you change it, change
// both.
const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://slic.agency"
).replace(/\/+$/, "");
const CANONICAL_HOST = new URL(SITE_URL).host;

// The hostname that has to fold into the canonical one: the www variant when
// the canonical is the apex, and the apex when it is the other way round.
// Deriving it rather than hardcoding it means the two can never be the same
// string, so the redirect below cannot point a host at itself.
const REDIRECT_HOST = CANONICAL_HOST.startsWith("www.")
  ? CANONICAL_HOST.slice(4)
  : `www.${CANONICAL_HOST}`;

// Applied to every response. Deliberately excludes a script-src CSP: the app
// relies on Next's inline bootstrap, styled-components' injected <style> tags,
// and the Calendly widget, all of which would need 'unsafe-inline' — which
// removes most of the protection a CSP buys. frame-ancestors is set on its own
// so clickjacking is still covered.
const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: "frame-ancestors 'self'; base-uri 'self'; form-action 'self'",
  },
  // Stops MIME sniffing turning an uploaded asset into executable script.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Send the full URL same-origin, origin only when crossing to https.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // No page on this site needs these; deny by default.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig = {
  images: {
    // Logos and avatars never change, so keep optimized variants cached for a
    // month instead of re-running the optimizer when the default TTL lapses.
    minimumCacheTTL: 2678400,
    // AVIF first — typically 20-30% smaller than WebP at equal quality, with
    // WebP kept as the fallback for older clients.
    formats: ["image/avif", "image/webp"],
    // Blog images live in Vercel Blob, whose public host is
    // <store-id>.public.blob.vercel-storage.com. The single `*` matches that
    // one label and nothing deeper, so the pattern still pins the domain.
    //
    // Unlike Sanity's CDN, Blob does no resizing of its own — every variant
    // here is produced by Next's own image optimizer, which is why the stored
    // width and height on each image matter.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
  },
  compiler: {
    styledComponents: true,
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },

  /**
   * Folds www.slic.agency into the apex permanently, so the host every
   * canonical tag names is also the only host that serves a 200.
   *
   * The `has` condition means this only fires when the request actually
   * arrives on the non-canonical host. localhost, *.vercel.app previews and
   * the canonical host itself never match, so development and preview
   * deployments are untouched. `:path*` preserves the path and Next carries
   * the query string across a redirect, so /work?utm_source=x survives whole.
   *
   * 301 rather than `permanent: true`: Next emits 308 for `permanent`, and the
   * brief's own verification step curls for 301. Google treats the two
   * identically, and on a site that only ever serves GET the method-preserving
   * behaviour 308 buys is worth nothing, so the acceptance check wins.
   *
   * Note this only applies to traffic that reaches the app. If www is not
   * attached to the project at the DNS/hosting layer, requests to it never get
   * here. Vercel can also do this as a domain setting, in which case its edge
   * redirect fires first and this rule never runs.
   */
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: REDIRECT_HOST }],
        destination: `${SITE_URL}/:path*`,
        statusCode: 301,
      },
    ];
  },
};

export default nextConfig;
