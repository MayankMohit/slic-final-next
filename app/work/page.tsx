import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/site";
import { WorkPageContent } from "./work-content";

export const metadata: Metadata = {
  title: "Our Work",
  description: "Explore SLIC's portfolio of viral video content, ad creatives, and brand films that drive results for DTC brands.",
  alternates: {
    canonical: "/work",
  },
  openGraph: {
    title: "Our Work | SLIC Performance Video Ads Portfolio",
    description: "Browse performance video ads created by SLIC for DTC brands on Meta, TikTok, and YouTube. See the creative that drives results.",
    url: absoluteUrl("/work"),
  },
};

export default function WorkPage() {
  return <WorkPageContent />;
}
