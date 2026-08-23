import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPublishedPost, getPublishedSlugs } from "@/lib/posts";
import { jsonLd } from "@/lib/json-ld";
import { absoluteUrl } from "@/lib/site";
import { postSocialImage } from "@/lib/post-types";
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

  // The post's own cover when it has one, the site card otherwise. Relative
  // paths are resolved against metadataBase, so the fallback still emits an
  // absolute URL — which is the only kind a crawler on another host can fetch.
  const social = postSocialImage(post);

  return {
    title: post.title,
    description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description,
      type: "article",
      url: absoluteUrl(`/blog/${post.slug}`),
      publishedTime: post.publishedAt ?? undefined,
      modifiedTime: post.updatedAt,
      authors: post.authorName ? [post.authorName] : undefined,
      images: [social],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images: [social.url],
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

  // Same image the link preview uses, so a share and a search result cannot
  // show different pictures of the same post. Blob URLs are already absolute;
  // only the local fallback needs the host prefixing, and JSON-LD has no
  // metadataBase to resolve it for us.
  const social = postSocialImage(post);
  const socialImageUrl = social.url.startsWith("http")
    ? social.url
    : absoluteUrl(social.url);

  /**
   * Article is the one schema type on this site that still earns rich
   * results, which is why it gets the attention FAQPage no longer deserves.
   *
   * dateModified matters more than it looks. Without it Google has only the
   * publish date to go on and treats an updated post as stale; with it, an
   * edit is visible as an edit. It comes from the same updatedAt the sitemap
   * uses for lastModified, so the two can never disagree.
   */
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    url: absoluteUrl(`/blog/${post.slug}`),
    image: {
      "@type": "ImageObject",
      url: socialImageUrl,
      width: social.width,
      height: social.height,
    },
    author: {
      "@type": "Person",
      name: post.authorName || "SLIC",
    },
    publisher: {
      "@type": "Organization",
      name: "SLIC",
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/icons/sm_logo.png"),
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
