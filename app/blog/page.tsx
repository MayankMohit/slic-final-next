import { sanityFetch } from "@/lib/sanity.live";
import type { Metadata } from "next";
import { BlogPageContent } from "./blog-content";

export const metadata: Metadata = {
  title: "Blog & Insights",
  description:
    "Learn video marketing strategies, TikTok ad trends, and content tips from SLIC's team of performance marketers and creative strategists.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "Blog & Insights | SLIC",
    description:
      "Learn video marketing strategies, TikTok ad trends, and content tips from our team.",
    url: "https://slic.agency/blog",
  },
};

// Make BlogPage async to fetch data
export default async function BlogPage() {
  const {data: posts} = await sanityFetch({
    query: `*[_type == "post" && defined(publishedAt) && publishedAt < now()]
  | order(publishedAt desc) {
    title,
    slug,
    publishedAt,
    body,
    featured,
    mainImage,
    author->{
      name
    },
    categories[]->{
      title
    }
  }`,
  });

  return <BlogPageContent posts={posts} />;
}
