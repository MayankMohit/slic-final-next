import type { MetadataRoute } from "next";
import { getPublishedSlugs } from "@/lib/posts";
import { SITE_URL, absoluteUrl } from "@/lib/site";

// Regenerated on the same cadence as the blog, and immediately when a post is
// saved: savePost calls revalidatePath("/sitemap.xml").
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPublishedSlugs();

  const blogPosts: MetadataRoute.Sitemap = posts.map((post) => ({
    url: absoluteUrl(`/blog/${post.slug}`),
    lastModified: post.updatedAt,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [
    { url: SITE_URL,                     lastModified: new Date(), changeFrequency: "weekly",  priority: 1.0 },
    { url: absoluteUrl("/work"),         lastModified: new Date(), changeFrequency: "weekly",  priority: 0.9 },
    { url: absoluteUrl("/book"),         lastModified: new Date(), changeFrequency: "yearly",  priority: 0.9 },
    { url: absoluteUrl("/case-studies"), lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/about"),        lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/blog"),         lastModified: new Date(), changeFrequency: "weekly",  priority: 0.7 },
    { url: absoluteUrl("/join"),         lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    ...blogPosts,
  ];
}
