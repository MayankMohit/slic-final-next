import type { Metadata } from "next";
import { WorkPageContent } from "./work-content";

export const metadata: Metadata = {
  title: "Our Work",
  description: "Explore SLIC Media's portfolio of viral video content, ad creatives, and brand films that drive results for DTC brands.",
  openGraph: {
    title: "Our Work | SLIC Media",
    description: "Explore our portfolio of viral video content, ad creatives, and brand films that drive results.",
    url: "https://slicmedia.com/work",
  },
};

export default function WorkPage() {
  return <WorkPageContent />;
}
