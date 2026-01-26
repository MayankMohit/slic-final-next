import type { Metadata } from "next";
import { CaseStudiesPageContent } from "./case-studies-content";

export const metadata: Metadata = {
  title: "Case Studies",
  description: "Explore real results from SLIC Media's work with DTC brands. See how we've helped brands achieve 3x conversion rates, 150K+ followers, and 7-figure revenue.",
  openGraph: {
    title: "Case Studies | SLIC Media",
    description: "Explore real results from our work with DTC brands. See how we've helped brands achieve explosive growth.",
    url: "https://slicmedia.com/case-studies",
  },
};

export default function CaseStudiesPage() {
  return <CaseStudiesPageContent />;
}
