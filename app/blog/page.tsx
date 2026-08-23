import type { Metadata } from "next";
import { getPublishedPosts } from "@/lib/posts";
import { absoluteUrl } from "@/lib/site";
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
    url: absoluteUrl("/blog"),
  },
};

/**
 * Rebuilt hourly, and immediately whenever a post is saved.
 *
 * Sanity's live subscription used to keep this fresh on its own. Now that the
 * data is ours, savePost calls revalidatePath("/blog"), so an edit is visible
 * at once. The hourly window is the safety net that also picks up posts whose
 * publish date was set in the future and has since passed.
 */
export const revalidate = 3600;

export default async function BlogPage() {
  const posts = await getPublishedPosts();
  return <BlogPageContent posts={posts} />;
}
