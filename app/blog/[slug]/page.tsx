import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPublishedPost, getPublishedSlugs } from "@/lib/posts";
import { jsonLd } from "@/lib/json-ld";
import { BlogPostView } from "./BlogPostView";

// Same contract as the index: instant on save via revalidatePath, hourly
// otherwise. See the note in app/blog/page.tsx.
export const revalidate = 3600;

/**
 * Prerenders the posts that exist at build time; anything published afterwards
 * is rendered on first request and then cached.
 *
 * The route no longer needs the slug repair that the Sanity version carried.
 * Slugs are produced by slugify() and validated against /^[a-z0-9-]+$/ before
 * they are stored, so a stored slug can never contain a space and the incoming
 * param never arrives percent-encoded.
 */
export async function generateStaticParams() {
  const posts = await getPublishedSlugs();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPost(slug);

  if (!post) return {};

  const description = post.excerpt.slice(0, 160);
  const ogImage = post.coverImage?.url ?? "/og-image.jpg";

  return {
    title: post.title,
    description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description,
      type: "article",
      url: `https://slic.agency/blog/${post.slug}`,
      publishedTime: post.publishedAt ?? undefined,
      authors: post.authorName ? [post.authorName] : undefined,
      images: [{ url: ogImage, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images: [ogImage],
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPublishedPost(slug);

  if (!post) notFound();

  const ogImage = post.coverImage?.url ?? "https://slic.agency/og-image.jpg";

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    datePublished: post.publishedAt,
    url: `https://slic.agency/blog/${post.slug}`,
    image: ogImage,
    author: {
      "@type": "Person",
      name: post.authorName || "SLIC",
    },
    publisher: {
      "@type": "Organization",
      name: "SLIC",
      logo: {
        "@type": "ImageObject",
        url: "https://slic.agency/icons/sm_logo.png",
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(articleSchema) }}
      />
      <BlogPostView post={post} />
    </>
  );
}
