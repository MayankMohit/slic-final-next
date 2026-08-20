import "server-only";
import { ObjectId, type Collection } from "mongodb";
import { getDb, isDbConfigured } from "./mongodb";
import {
  deriveExcerpt,
  readTime,
  type Post,
  type PostFacets,
  type PostImage,
  type PostStatus,
  type TipTapDoc,
} from "./post-types";

/**
 * Database access for blog posts.
 *
 * The types and pure helpers live in lib/post-types.ts, which carries no
 * `server-only` marker, so the admin editor can import slugify and the shared
 * shapes without pulling the Mongo driver into a client bundle.
 */

export * from "./post-types";

/** A post as it sits in Mongo. */
export interface PostDoc {
  _id: ObjectId;
  title: string;
  slug: string;
  /** Author-written summary. Blank means "derive it from the body". */
  excerpt: string;
  body: TipTapDoc;
  coverImage: PostImage | null;
  authorName: string;
  categories: string[];
  featured: boolean;
  status: PostStatus;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

let indexesReady: Promise<void> | undefined;

export async function postsCollection(): Promise<Collection<PostDoc>> {
  const db = await getDb();
  const collection = db.collection<PostDoc>("posts");

  // Runs once per process, not once per query.
  indexesReady ??= (async () => {
    await collection.createIndex({ slug: 1 }, { unique: true });
    await collection.createIndex({ status: 1, publishedAt: -1 });
  })();
  await indexesReady;

  return collection;
}

function serialize(doc: PostDoc): Post {
  return {
    id: doc._id.toHexString(),
    title: doc.title,
    slug: doc.slug,
    excerpt: doc.excerpt || deriveExcerpt(doc.body),
    body: doc.body ?? { type: "doc", content: [] },
    coverImage: doc.coverImage ?? null,
    authorName: doc.authorName,
    categories: doc.categories ?? [],
    featured: Boolean(doc.featured),
    status: doc.status,
    publishedAt: doc.publishedAt ? doc.publishedAt.toISOString() : null,
    updatedAt: doc.updatedAt.toISOString(),
    readTime: readTime(doc.body),
  };
}

/**
 * Everything a live visitor may see.
 *
 * The `publishedAt <= now` half is what makes scheduling work: a post dated
 * forward is stored as published but stays out of every public query until its
 * date passes.
 */
const publicFilter = () => ({
  status: "published" as const,
  publishedAt: { $ne: null, $lte: new Date() },
});

export async function getPublishedPosts(): Promise<Post[]> {
  // Returning empty rather than throwing keeps `next build` working on a
  // checkout with no MONGODB_URI: /blog prerenders as "no posts yet" instead of
  // failing the whole build.
  if (!isDbConfigured) return [];
  const collection = await postsCollection();
  const docs = await collection
    .find(publicFilter())
    .sort({ publishedAt: -1 })
    .toArray();
  return docs.map(serialize);
}

export async function getPublishedPost(slug: string): Promise<Post | null> {
  if (!isDbConfigured) return null;
  const collection = await postsCollection();
  const doc = await collection.findOne({ ...publicFilter(), slug });
  return doc ? serialize(doc) : null;
}

export async function getPublishedSlugs() {
  if (!isDbConfigured) return [];
  const collection = await postsCollection();
  const docs = await collection
    .find(publicFilter(), { projection: { slug: 1, updatedAt: 1 } })
    .sort({ publishedAt: -1 })
    .toArray();
  return docs.map((doc) => ({ slug: doc.slug, updatedAt: doc.updatedAt }));
}

/** Admin list: drafts included, most recently touched first. */
export async function getAllPosts(): Promise<Post[]> {
  const collection = await postsCollection();
  const docs = await collection.find({}).sort({ updatedAt: -1 }).toArray();
  return docs.map(serialize);
}

/**
 * Every author and category already in use, for the editor's pickers.
 *
 * Derived from the posts themselves rather than kept in their own collections.
 * That means there is no second source of truth to keep in step, no orphan rows
 * when the last post using a category is deleted, and no write path to get
 * wrong — a name exists exactly as long as something references it.
 *
 * Drafts count, so a category invented on an unpublished post is still offered
 * on the next one.
 */
export async function getPostFacets(): Promise<PostFacets> {
  if (!isDbConfigured) return { authors: [], categories: [] };

  const collection = await postsCollection();
  const [authors, categories] = await Promise.all([
    collection.distinct("authorName"),
    collection.distinct("categories"),
  ]);

  const clean = (values: unknown[]) =>
    values
      .filter((value): value is string => typeof value === "string" && value.length > 0)
      .sort((a, b) => a.localeCompare(b));

  return { authors: clean(authors), categories: clean(categories) };
}

export async function getPostById(id: string): Promise<Post | null> {
  if (!ObjectId.isValid(id)) return null;
  const collection = await postsCollection();
  const doc = await collection.findOne({ _id: new ObjectId(id) });
  return doc ? serialize(doc) : null;
}
