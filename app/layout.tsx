import React from "react";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import EtheralBackground from "@/components/etheral-background";
import MobileBackground from "@/components/mobile-background";
import Script from "next/script";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import localFont from "next/font/local";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { SanityLive } from "@/lib/sanity.live";

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
    "Performance video ads for DTC brands on Facebook, TikTok, and YouTube. We research, script, and produce creative that drives ROAS. $50M+ revenue generated.",
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
  metadataBase: new URL("https://slic.agency"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://slic.agency",
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
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
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
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "SLIC",
              url: "https://slic.agency",
              logo: "https://slic.agency/icons/sm_logo.png",
              description:
                "Performance video ads for DTC brands on Facebook, TikTok, and YouTube. $50M+ revenue generated.",
              sameAs: [
                "https://www.linkedin.com/company/slic-media/",
                "https://x.com/slic_media",
              ],
            }),
          }}
        />
        <link
          href="https://assets.calendly.com/assets/external/widget.css"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans">
        <EtheralBackground />
        <SmoothScrollProvider>
          <TooltipProvider>
            <MobileBackground />
            <div className="relative z-10">{children}</div>
            <SpeedInsights />
            <SanityLive />
            <Toaster />
            <SonnerToaster />
          </TooltipProvider>
        </SmoothScrollProvider>
        <Script
          src="https://assets.calendly.com/assets/external/widget.js"
          strategy="lazyOnload"
        />

        <Analytics />
      </body>
    </html>
  );
}
