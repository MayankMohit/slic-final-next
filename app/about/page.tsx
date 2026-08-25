import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/site";
import { AboutPageContent } from "./about-content";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about SLIC - a performance-first video content agency helping DTC brands scale with performance video ads. Meet our team and discover our story.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About SLIC | Performance Creative Agency for DTC",
    description:
      "SLIC is a performance creative agency producing video ads for DTC brands. $50M+ revenue generated. Up to 3x ROAS. Meet the team behind the results.",
    url: absoluteUrl("/about"),
  },
};

export default function AboutPage() {
  return <AboutPageContent />;
}
