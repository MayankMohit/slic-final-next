import { client } from '@/lib/sanity'
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

// Make BlogPage async to fetch data
export default async function BlogPage() {
  const posts = await client.fetch(
    `*[_type == "post" && defined(publishedAt) && publishedAt < now()]{
      title,
      slug,
      publishedAt,
      author->{
        name
      },
      mainImage,
      categories[]->{
        title
      }
    } | order(publishedAt desc)[0...8]`
  );

  return <BlogPageContent posts={posts} />;
}
