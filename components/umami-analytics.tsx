"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import {
  UMAMI_ALLOWED_DOMAINS,
  UMAMI_SCRIPT_URL,
  UMAMI_WEBSITE_ID,
} from "@/lib/analytics";

/**
 * The Umami tracker, kept off /admin.
 *
 * A Client Component purely so it can read the pathname. Whether analytics runs
 * at all is decided on the server in app/layout.tsx, which is the only place
 * VERCEL_ENV is readable; this component only decides *where*.
 *
 * The /admin exclusion matters for two reasons. It keeps the CMS out of the
 * traffic numbers, which would otherwise be dominated by whoever writes the
 * blog. And it stops draft post titles and IDs leaving the site inside a URL:
 * /admin/edit/[id] is a page path, and page paths are the one thing an
 * analytics tool is guaranteed to record.
 *
 * The gate is on first render of each route, so a full page load of /admin
 * never loads the tracker at all. It is not airtight in one direction: if
 * someone client-side navigates from a public page into /admin, the script is
 * already in the document and its history hook will catch the change. Nothing
 * public links to /admin, so in practice that path requires typing the URL —
 * which is a fresh document load, which is gated. Worth knowing rather than
 * worth solving with a manual-tracking rewrite.
 */
export default function UmamiAnalytics() {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) return null;

  return (
    <Script
      src={UMAMI_SCRIPT_URL}
      data-website-id={UMAMI_WEBSITE_ID}
      data-domains={UMAMI_ALLOWED_DOMAINS}
      /*
       * Umami's own snippet uses `defer`, which fetches during parse and runs
       * before DOMContentLoaded. afterInteractive is the closer fit here: it
       * injects after hydration, so the tracker never competes with the bundle
       * for bandwidth on a page whose LCP is a hero video. Nothing is lost —
       * the initial pageview fires on script load whenever that happens, and
       * next/script guarantees it is injected once rather than on every
       * client-side navigation.
       *
       * Route changes need no help from us. The tracker wraps
       * history.pushState and history.replaceState, which is exactly what the
       * App Router calls to navigate, so client-side transitions are counted
       * automatically. This is also why manual tracking was avoided: doing it
       * by hand means reading useSearchParams, and an unsuspended
       * useSearchParams opts every page into client-side rendering — an SEO
       * regression on a site whose whole brief was SEO.
       */
      strategy="afterInteractive"
    />
  );
}

/*
 * On ad blockers, since the numbers will raise the question.
 *
 * The tracker loads from cloud.umami.is and reports to gateway.umami.is, and
 * umami.is is on EasyPrivacy, so uBlock Origin and friends block both outright.
 * Expect Umami to report meaningfully fewer sessions than the server sees,
 * weighted toward exactly the technical audience a marketing site cares least
 * about. That is a reporting gap, not a bug, and it is consistent month to
 * month, so trends stay trustworthy even where absolute counts run low.
 *
 * It can be closed by proxying both hops through this domain. Two rewrites in
 * next.config.mjs:
 *
 *   { source: "/u/script.js", destination: "https://cloud.umami.is/script.js" }
 *   { source: "/u/api/send",  destination: "https://gateway.umami.is/api/send" }
 *
 * then NEXT_PUBLIC_UMAMI_SCRIPT_URL=/u/script.js plus data-host-url="/u" on the
 * tag. Both are needed: the tracker does not derive its endpoint from its own
 * src, it defaults to https://gateway.umami.is/api/send unless data-host-url
 * says otherwise, so proxying only the script would leave every collect request
 * going straight to the blocked origin.
 *
 * That was left undone deliberately. Umami reads the visitor IP from
 * x-forwarded-for to do geolocation and to build its daily visitor hash, and a
 * proxy that drops or rewrites that header collapses every visitor into one
 * visitor in a datacenter. It is a change worth making, but only with the
 * dashboard open to confirm countries still resolve.
 */
