import { createClient } from 'next-sanity';
import imageUrlBuilder from "@sanity/image-url";

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.SANITY_API_VERSION || '2024-01-01',
  useCdn: false,
});

const builder = imageUrlBuilder(client);

export function urlFor(source: any) {
  return builder.image(source);
}

/**
 * Strips spaces out of a slug so every URL we emit is clean.
 *
 * Sanity's slug field keeps exactly what the editor typed, so a title pasted
 * with a leading space yields a slug with one too. That links out as
 * /blog/%20foo and drags the same encoded space into canonical tags and the
 * sitemap. A real slug never contains a space, so removing them only ever
 * normalises broken data.
 *
 * POST_QUERY in app/blog/[slug]/page.tsx applies the same removal to the stored
 * value, so the cleaned URL still resolves against an untrimmed record.
 */
export function cleanSlug(slug?: string | null) {
  return (slug ?? "").replace(/ /g, "");
}

/** Stand-in for posts published without a main image. */
export const BLOG_PLACEHOLDER_IMAGE = "/blog/placeholder.jpg";

/**
 * Resolves a post image to an <Image> src.
 *
 * Sanity writes the image object as soon as an editor types alt text, so a post
 * can carry { _type: "image", alt: "..." } with no uploaded asset. urlFor throws
 * on those, and an uncaught throw in a server component takes down the whole
 * route — one asset-less image once blanked the entire /blog list. Checking
 * `.asset` rather than the object itself is what makes this safe.
 */
export function postImageUrl(source: any, width: number) {
  return source?.asset
    ? builder.image(source).width(width).url()
    : BLOG_PLACEHOLDER_IMAGE;
}