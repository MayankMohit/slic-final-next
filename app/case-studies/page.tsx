import type { Metadata } from "next";
import { CaseStudiesPageContent } from "./case-studies-content";

export const metadata: Metadata = {
  title: "Case Studies",
  description: "Explore real results from SLIC's work with DTC brands. See how we've helped brands achieve 3x conversion rates, 150K+ followers, and 7-figure revenue.",
  alternates: {
    canonical: "/case-studies",
  },
  openGraph: {
    title: "Case Studies | SLIC Performance Creative Results",
    description: "See how SLIC generated $50M+ for DTC brands like Loop Labs, NeuroBrocc, and LOKT. 2x to 3x ROAS. Performance video ads that convert.",
    url: "https://slic.agency/case-studies",
  },
};

export default function CaseStudiesPage() {
  return <CaseStudiesPageContent />;
}
