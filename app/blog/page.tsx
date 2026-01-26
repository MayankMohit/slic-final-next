import type { Metadata } from "next";
import { BlogPageContent } from "./blog-content";

export const metadata: Metadata = {
  title: "Blog & Insights",
  description: "Learn video marketing strategies, TikTok ad trends, and content tips from SLIC Media's team of performance marketers and creative strategists.",
  openGraph: {
    title: "Blog & Insights | SLIC Media",
    description: "Learn video marketing strategies, TikTok ad trends, and content tips from our team.",
    url: "https://slicmedia.com/blog",
  },
};

export default function BlogPage() {
  return <BlogPageContent />;
}
