import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { sanityFetch } from "@/lib/sanity.live";
import { urlFor } from "@/lib/sanity";
import { BlogPostView } from "./BlogPostView";

const POST_QUERY = `*[_type == "post" && slug.current == $slug][0]{
  title,
  slug,
  body,
  publishedAt,
  author->{ name },
  mainImage,
  categories[]->{ title }
}`;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { data: post } = await sanityFetch({ query: POST_QUERY, params: { slug } });

  if (!post) return {};

  const description =
    post.body?.[0]?.children?.[0]?.text?.slice(0, 160) ?? "";
  const ogImage = post.mainImage
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
  const { slug } = await params;

  const { data: post } = await sanityFetch({ query: POST_QUERY, params: { slug } });

  if (!post) notFound();

  const formattedDate = new Date(post.publishedAt).toISOString().split("T")[0];
  const ogImage = post.mainImage
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <BlogPostView post={post} formattedDate={formattedDate} />
    </>
  );
}
