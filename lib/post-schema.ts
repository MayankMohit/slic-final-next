import { z } from "zod";
import type { TipTapNode } from "./post-types";

export const POST_STATUSES = ["draft", "published"] as const;

// Same guard as lib/join-schema.ts: control characters have no business in a
// title that ends up in a <title> tag, a slug, or a JSON-LD headline.
const CONTROL_CHARS = new RegExp("[\u0000-\u001f\u007f]");
const noControlChars = (value: string) => !CONTROL_CHARS.test(value);

/**
 * Blob URLs are the only image source we accept.
 *
 * The editor writes image nodes from whatever the upload route returns, but the
 * document is posted back from the browser and could carry any URL. Pinning the
 * host means a compromised or curious admin session cannot turn a post body
 * into a beacon pointing at a third-party server, and it keeps every src inside
 * the one remotePattern next.config.mjs allows.
 */
// Case-insensitive because hostnames are. Vercel only ever mints lowercase
// store ids, but rejecting an uppercase one would be a silent, baffling failure.
const BLOB_HOST = /^https:\/\/[a-z0-9-]+\.public\.blob\.vercel-storage\.com\//i;

export const isBlobUrl = (value: string) => BLOB_HOST.test(value);

export const postImageSchema = z.object({
  url: z.string().max(500).refine(isBlobUrl, "Image must be an uploaded file"),
  width: z.number().int().positive().max(20000),
  height: z.number().int().positive().max(20000),
  alt: z.string().trim().max(200).refine(noControlChars, "Invalid alt text"),
});

/**
 * The body document, validated structurally rather than by node type.
 *
 * The renderer in lib/tiptap-render.tsx whitelists the node and mark types it
 * knows and drops the rest, so an unexpected type here is inert. What this
 * schema is actually for is bounding the shape and depth so a malformed or
 * hand-crafted payload cannot be stored at all.
 */
const markSchema = z.object({
  type: z.string().min(1).max(50),
  attrs: z.record(z.unknown()).optional(),
});

const nodeSchema: z.ZodType<TipTapNode> = z.lazy(() =>
  z.object({
    type: z.string().min(1).max(50),
    attrs: z.record(z.unknown()).optional(),
    content: z.array(nodeSchema).optional(),
    marks: z.array(markSchema).max(10).optional(),
    text: z.string().max(20000).optional(),
  }),
);

export const bodySchema = z.object({
  type: z.literal("doc"),
  content: z.array(nodeSchema).max(2000).optional(),
});

export const postFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Give the post a title")
    .max(160, "Titles longer than 160 characters get truncated in search results")
    .refine(noControlChars, "Please enter a valid title"),
  // Blank is allowed and means "derive it from the title" — see savePost.
  slug: z
    .string()
    .trim()
    .max(96)
    .regex(
      /^[a-z0-9-]*$/,
      "Slugs can only contain lowercase letters, numbers and hyphens",
    ),
  excerpt: z
    .string()
    .trim()
    .max(300, "Keep the excerpt under 300 characters")
    .refine(noControlChars, "Please enter a valid excerpt"),
  authorName: z
    .string()
    .trim()
    .min(2, "Add an author name")
    .max(100)
    .refine(noControlChars, "Please enter a valid author name"),
  categories: z.array(z.string().trim().min(1).max(40)).max(6),
  featured: z.boolean(),
  status: z.enum(POST_STATUSES),
  // Empty string means "use now" when publishing. Datetime-local inputs emit
  // "2026-08-20T14:30" with no zone, so this is parsed as local time on save.
  publishedAt: z.string().trim().max(40),
  coverImage: postImageSchema.nullable(),
  body: bodySchema,
});

export type PostForm = z.infer<typeof postFormSchema>;
