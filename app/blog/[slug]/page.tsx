import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { sanityFetch } from "@/lib/sanity.live";
import { urlFor, cleanSlug } from "@/lib/sanity";
import { jsonLd } from "@/lib/json-ld";
import { BlogPostView } from "./BlogPostView";

// slug.current is compared with its spaces removed, mirroring cleanSlug on the
// incoming param. Sanity stores whatever the editor typed, so one stray leading
// space is enough to make a published post unreachable at its own URL.
const POST_QUERY = `*[_type == "post" && array::join(string::split(slug.current, " "), "") == $slug][0]{
  title,
  slug,
  body,
  publishedAt,
  author->{ name },
  mainImage,
  categories[]->{ title }
}`;

/**
 * Page params arrive percent-encoded. The App Router decodes route-handler
 * params but hands page components the raw segment, so a slug stored with a
 * leading space reaches us as "%20why-..." rather than " why-...", matches
 * nothing, and 404s a post that plainly exists.
 *
 * decodeURIComponent throws on malformed input such as "%zz", which would turn
 * a bad URL into a 500 instead of a 404, so that case falls back to the raw
 * segment.
 */
function slugFromParam(segment: string) {
  try {
    return cleanSlug(decodeURIComponent(segment));
  } catch {
    return cleanSlug(segment);
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const slug = slugFromParam((await params).slug);
  const { data: post } = await sanityFetch({ query: POST_QUERY, params: { slug } });

  if (!post) return {};

  const description =
    post.body?.[0]?.children?.[0]?.text?.slice(0, 160) ?? "";
  const ogImage = post.mainImage?.asset
    ? urlFor(post.mainImage).width(1200).height(630).url()
    : "/og-image.jpg";

  return {
    title: post.title,
    description,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title: post.title,
      description,
      type: "article",
      url: `https://slic.agency/blog/${slug}`,
      publishedTime: post.publishedAt,
      authors: post.author?.name ? [post.author.name] : undefined,
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
  const slug = slugFromParam((await params).slug);

  const { data: post } = await sanityFetch({ query: POST_QUERY, params: { slug } });

  if (!post) notFound();

  const formattedDate = new Date(post.publishedAt).toISOString().split("T")[0];
  const ogImage = post.mainImage?.asset
    ? urlFor(post.mainImage).width(1200).height(630).url()
    : "https://slic.agency/og-image.jpg";

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    datePublished: post.publishedAt,
    url: `https://slic.agency/blog/${slug}`,
    image: ogImage,
    author: {
      "@type": "Person",
      name: post.author?.name ?? "SLIC",
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
      <BlogPostView post={post} formattedDate={formattedDate} />
    </>
  );
}
