import type { Metadata } from "next";
import { AboutPageContent } from "./about-content";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about SLIC Media - a performance-first video content agency helping DTC brands scale with viral content. Meet our team and discover our story.",
  openGraph: {
    title: "About Us | SLIC Media",
    description: "Learn about SLIC Media - a performance-first video content agency helping DTC brands scale with viral content.",
    url: "https://slicmedia.com/about",
  },
};

export default function AboutPage() {
  return <AboutPageContent />;
}
