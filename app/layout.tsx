import React from "react";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { jsonLd } from "@/lib/json-ld";
import { SITE_URL, absoluteUrl } from "@/lib/site";
import EtheralBackground from "@/components/etheral-background";
import MobileBackground from "@/components/mobile-background";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import localFont from "next/font/local";
import { SpeedInsights } from "@vercel/speed-insights/next";
import UmamiAnalytics from "@/components/umami-analytics";
import { UMAMI_ENABLED } from "@/lib/analytics";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

const sfPro = localFont({
  src: [
    {
      path: "../fonts/sf-pro-display-medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/sf-pro-display-bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../fonts/SF-Pro-Display-Semibold.woff2",
      weight: "600",
      style: "normal",
    },
  ],
  variable: "--font-sfpro",
  display: "swap",
  fallback: ["Inter", "sans-serif"],
});

export const metadata: Metadata = {
  title: {
    default: "SLIC | Performance Creative Agency for DTC Brands",
    template: "%s | SLIC",
  },
  description:
    "Performance video ads for DTC brands on Meta, TikTok, and YouTube. We research, script, and produce creative that drives ROAS. $50M+ revenue generated.",
  keywords: [
    "video content agency",
    "TikTok ads",
    "Meta ads",
    "viral video",
    "DTC marketing",
    "video production",
    "ad creative",
    "social media marketing",
    "performance marketing",
  ],
  authors: [{ name: "SLIC" }],
  creator: "SLIC",
  publisher: "SLIC",
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "SLIC",
    title: "Performance Creative Agency for DTC Brands | SLIC",
    description:
      "Performance-first video content agency helping DTC brands scale with performance video ads. $50M+ revenue generated.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "SLIC - Performance Creative Agency for DTC Brands",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SLIC | Performance Creative Agency for DTC Brands",
    description:
      "Performance-first video content agency helping DTC brands scale with performance video ads.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  /*
    No icons block, deliberately.

    These two lines used to name /favicon.ico and /apple-touch-icon.png, and
    neither file has ever existed in public/ - so every page shipped two <link>
    tags pointing at a 404 and the site had no favicon at all.

    Icons now come from Next's file conventions instead: app/favicon.ico and
    app/apple-icon.png, with the Android sizes declared in app/manifest.ts. That
    way the tags are generated from files that demonstrably exist, and they get
    fingerprinted for cache busting, which a hardcoded path does not. Declaring
    them here as well would emit a second, competing set.

    All four files are produced by scripts/generate-icons.mjs from one source
    image. See the header there.
  */
};

export const viewport: Viewport = {
  themeColor: "#0a0f1a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sfPro.variable} ${inter.className}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jsonLd({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "SLIC",
              url: SITE_URL,
              logo: absoluteUrl("/icons/sm_logo.png"),
              description:
                "Performance video ad creative for DTC brands scaling on Meta, TikTok, and YouTube.",
              email: "hello@slic.agency",
              // The field that does the real work here. It is how Google ties
              // the site, the LinkedIn page and the X account together as one
              // entity rather than three unrelated things with a similar name.
              // Both URLs are the ones the footer links to; a sameAs pointing
              // somewhere the site does not link is a contradiction, not a hint.
              sameAs: [
                "https://www.linkedin.com/company/slic-media/",
                "https://x.com/slic_media",
              ],
              knowsAbout: [
                "Performance marketing",
                "Video ad creative",
                "Meta Ads",
                "TikTok Ads",
                "YouTube Ads",
              ],
            }),
          }}
        />
        {/*
          Warms the connection to Calendly on every page, because the booking
          CTA is on every page.

          A preconnect does the DNS lookup, TCP handshake and TLS negotiation
          up front, so when someone clicks through to /book the iframe request
          starts on an open socket instead of paying ~3 round trips first. On a
          slow connection that is most of the wait.

          What used to be here was a render-blocking <link rel="stylesheet"> to
          assets.calendly.com — a third-party stylesheet in the critical path of
          every page on the site, for a widget that is no longer loaded at all.
          The popup it dressed has been replaced by the inline embed on /book,
          which needs no Calendly CSS or JavaScript.
        */}
        {/*
          No crossOrigin attribute, deliberately. Browsers key connection reuse
          on credentials mode, so a `crossorigin` preconnect opens an anonymous
          CORS socket — the right thing for fonts and scripts, and the wrong
          thing here. What follows is an iframe document load, which uses the
          ordinary pool, so an anonymous preconnect would sit unused and the
          frame would pay for its own handshake anyway.
        */}
        <link rel="preconnect" href="https://calendly.com" />
        <link rel="dns-prefetch" href="https://calendly.com" />
      </head>
      <body className="font-sans">
        <EtheralBackground />
        <SmoothScrollProvider>
          <MobileBackground />
          <div className="relative z-10">{children}</div>
          <SpeedInsights />
          <SonnerToaster />
        </SmoothScrollProvider>
        <Analytics />
        {/*
          Umami, running alongside Vercel Web Analytics rather than replacing
          it. The two overlap on pageviews; what Umami adds is retention
          measured in years instead of the plan's window, custom events, and a
          dashboard that can be shared with the client without handing out a
          Vercel seat. Drop @vercel/analytics above if that overlap stops
          earning its bundle size.

          UMAMI_ENABLED is evaluated here rather than inside the component
          because it reads VERCEL_ENV, which has no NEXT_PUBLIC_ prefix and so
          only exists on the server.
        */}
        {UMAMI_ENABLED && <UmamiAnalytics />}
      </body>
    </html>
  );
}
