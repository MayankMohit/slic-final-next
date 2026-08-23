/**
 * Post types and the pure helpers derived from them.
 *
 * Deliberately free of `server-only` and of any database import: the admin
 * editor is a client component and needs slugify, EMPTY_DOC and the shared
 * types. Everything that touches Mongo lives in lib/posts.ts instead, so
 * importing a type never drags the driver into a browser bundle.
 */

/* -------------------------------------------------------------------------- */
/* TipTap document shape                                                      */
/* -------------------------------------------------------------------------- */

export interface TipTapMark {
  type: string;
  attrs?: Record<string, unknown>;
}

export interface TipTapNode {
  type: string;
  attrs?: Record<string, unknown>;
  content?: TipTapNode[];
  marks?: TipTapMark[];
  text?: string;
}

export interface TipTapDoc {
  type: "doc";
  content?: TipTapNode[];
}

export const EMPTY_DOC: TipTapDoc = { type: "doc", content: [] };

/* -------------------------------------------------------------------------- */
/* Post shape                                                                 */
/* -------------------------------------------------------------------------- */

export interface PostImage {
  url: string;
  /** Captured at upload time. Blob URLs, unlike Sanity's, carry no dimensions
   *  in the path, and next/image needs the true ratio to reserve layout space. */
  width: number;
  height: number;
  alt: string;
}

export type PostStatus = "draft" | "published";

/**
 * A post as it crosses into a client component.
 *
 * ObjectId and Date are not serializable across the server/client boundary, so
 * every read path in lib/posts.ts converts to this shape rather than leaving it
 * to each call site.
 */
export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: TipTapDoc;
  coverImage: PostImage | null;
  authorName: string;
  categories: string[];
  featured: boolean;
  status: PostStatus;
  publishedAt: string | null;
  updatedAt: string;
  readTime: string;
}

/** Authors and categories already in use, offered as pickers in the editor. */
export interface PostFacets {
  authors: string[];
  categories: string[];
}

/** Stand-in for posts published without a cover image. */
export const BLOG_PLACEHOLDER_IMAGE = "/blog/placeholder.jpg";

export function postImageUrl(image: PostImage | null | undefined) {
  return image?.url || BLOG_PLACEHOLDER_IMAGE;
}

/** Link preview shown when a post has no cover of its own. */
export const SOCIAL_FALLBACK_IMAGE = {
  url: "/og-image.jpg",
  width: 1200,
  height: 630,
};

/**
 * The image a post presents to link-preview crawlers, and to Article schema.
 *
 * The dimensions travel with it deliberately. LinkedIn and X read width and
 * height off the tag to decide whether a share renders as a large card or a
 * small thumbnail, so a post whose cover is portrait or square has to say so.
 * Declaring a flat 1200x630 for every post, which is what this used to do,
 * describes the site card rather than the image actually being served, and a
 * crawler that finds the mismatch downgrades the card.
 *
 * A cover uploaded through the editor already carries its true dimensions —
 * they are captured at upload time because Blob URLs, unlike Sanity's, do not
 * encode them in the path.
 */
export function postSocialImage(post: Pick<Post, "coverImage" | "title">) {
  const cover = post.coverImage;

  if (!cover) return { ...SOCIAL_FALLBACK_IMAGE, alt: post.title };

  return {
    url: cover.url,
    width: cover.width,
    height: cover.height,
    // The author wrote alt text for this image; the title is the last resort,
    // not the default.
    alt: cover.alt || post.title,
  };
}

/* -------------------------------------------------------------------------- */
/* Derived text                                                               */
/* -------------------------------------------------------------------------- */

/** Flattens every text leaf in the document into one string. */
export function plainText(doc: TipTapDoc | null | undefined): string {
  const out: string[] = [];

  const walk = (nodes: TipTapNode[] | undefined) => {
    for (const node of nodes ?? []) {
      if (typeof node.text === "string") out.push(node.text);
      if (node.content) walk(node.content);
      // Blocks are separate sentences; without this the last word of one
      // paragraph and the first of the next would fuse into a single "word".
      if (node.type !== "text") out.push(" ");
    }
  };

  walk(doc?.content);
  return out.join("").replace(/\s+/g, " ").trim();
}

export function readTime(doc: TipTapDoc | null | undefined): string {
  const words = plainText(doc).split(" ").filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / 200))} min read`;
}

export function deriveExcerpt(doc: TipTapDoc | null | undefined, max = 180) {
  const text = plainText(doc);
  if (text.length <= max) return text;
  // Cut on a word boundary so the ellipsis never lands mid-word.
  return `${text.slice(0, max).replace(/\s+\S*$/, "")}...`;
}

// Written via the RegExp constructor so this file stays pure ASCII, matching
// the guard style in lib/join-schema.ts.
const COMBINING_MARKS = new RegExp("[\u0300-\u036f]", "g");

/**
 * Title to URL slug.
 *
 * Deliberately strict: lowercase, ASCII alphanumerics and single hyphens only.
 * Sanity stored whatever the editor typed, which is how a post ended up with a
 * leading space in its slug and became unreachable at its own URL. There is no
 * cleanSlug equivalent any more because nothing unclean can be stored.
 */
export function slugify(input: string) {
  return input
    .normalize("NFKD")
    // Drops the combining accents NFKD just split off, so an accented title
    // slugs to its plain-ASCII form instead of losing the letter entirely.
    .replace(COMBINING_MARKS, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
}
