import React from "react";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import EtheralBackground from "@/components/etheral-background";
import Script from "next/script";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import PageTransitionProvider from "@/components/PageTransitionProvider";
import RouteLoader from "@/components/RouteLoader";
import localFont from 'next/font/local';

// const inter = Inter({ subsets: ['latin'], display: 'swap' });

const SFProDisplay = localFont({
  src: [
    { path: '../fonts/SFProDisplay-Semibold.otf', weight: '600', style: 'normal' },
    { path: '../fonts/SFProDisplay-Bold.otf', weight: '700', style: 'normal' },
  ],
  variable: '--font-sfpro',
  display: 'swap',
  fallback: ['Inter', 'sans-serif'],
});

export const metadata: Metadata = {
  title: {
    default: "SLIC Media | Viral Video Content Agency - TikTok & Meta Ads",
    template: "%s | SLIC Media",
  },
  description:
    "SLIC Media is a performance-first video content agency helping DTC brands scale with viral TikTok ads, Meta ads, and high-converting video content. $50M+ revenue generated for clients.",
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
  authors: [{ name: "SLIC Media" }],
  creator: "SLIC Media",
  publisher: "SLIC Media",
  metadataBase: new URL("https://slicmedia.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://slicmedia.com",
    siteName: "SLIC Media",
    title: "SLIC Media | Viral Video Content Agency - TikTok & Meta Ads",
    description:
      "Performance-first video content agency helping DTC brands scale with viral content. $50M+ revenue generated.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "SLIC Media - Viral Video Content Agency",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SLIC Media | Viral Video Content Agency",
    description:
      "Performance-first video content agency helping DTC brands scale with viral content.",
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
  generator: "v0.app",
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
    <html lang="en" className={`${SFProDisplay.variable}`}>
      <head>
        {/* Calendly CSS */}
        <link
          href="https://assets.calendly.com/assets/external/widget.css"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased">
        <SmoothScrollProvider>
          <RouteLoader />
          <PageTransitionProvider>
            <TooltipProvider>
              {/* Global animated background */}
              <EtheralBackground />

              {/* Foreground app content */}
              <div className="relative z-10 font-sfpro">{children}</div>

              <Toaster />
              <SonnerToaster />
            </TooltipProvider>
          </PageTransitionProvider>
        </SmoothScrollProvider>
        {/* Calendly Script */}
        <Script
          src="https://assets.calendly.com/assets/external/widget.js"
          strategy="lazyOnload"
        />

        <Analytics />
      </body>
    </html>
  );
}
