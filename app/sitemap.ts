import type { MetadataRoute } from "next";
import { client } from "@/lib/sanity";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await client.fetch<{ slug: string; publishedAt: string }[]>(
    `*[_type == "post" && defined(slug.current) && defined(publishedAt)] | order(publishedAt desc) {
      "slug": slug.current,
      publishedAt
    }`
  );

  const blogPosts: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `https://slic.agency/blog/${post.slug}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [
    { url: "https://slic.agency",              lastModified: new Date(), changeFrequency: "weekly",  priority: 1.0 },
    { url: "https://slic.agency/work",         lastModified: new Date(), changeFrequency: "weekly",  priority: 0.9 },
    { url: "https://slic.agency/case-studies", lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: "https://slic.agency/about",        lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: "https://slic.agency/blog",         lastModified: new Date(), changeFrequency: "weekly",  priority: 0.7 },
    ...blogPosts,
  ];
}
