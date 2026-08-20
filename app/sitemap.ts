import type { MetadataRoute } from "next";
import { getPublishedSlugs } from "@/lib/posts";

// Regenerated on the same cadence as the blog, and immediately when a post is
// saved: savePost calls revalidatePath("/sitemap.xml").
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPublishedSlugs();

  const blogPosts: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `https://slic.agency/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [
    { url: "https://slic.agency",              lastModified: new Date(), changeFrequency: "weekly",  priority: 1.0 },
    { url: "https://slic.agency/work",         lastModified: new Date(), changeFrequency: "weekly",  priority: 0.9 },
    { url: "https://slic.agency/case-studies", lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: "https://slic.agency/about",        lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: "https://slic.agency/blog",         lastModified: new Date(), changeFrequency: "weekly",  priority: 0.7 },
    { url: "https://slic.agency/join",         lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    ...blogPosts,
  ];
}
