/** @type {import('next').NextConfig} */

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
};

export default nextConfig;
