"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import {
  Eye,
  ExternalLink,
  Loader2,
  Pencil,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { Article } from "@/components/blog/article";
import {
  EMPTY_DOC,
  readTime,
  slugify,
  type Post,
  type PostFacets,
  type PostImage,
  type TipTapDoc,
} from "@/lib/post-types";
import { deletePost, savePost } from "./actions";
import { RichTextEditor } from "./rich-text-editor";
import { UPLOAD_ACCEPT_ATTR, uploadImage } from "./upload";
import { AuthorField, CategoryPicker } from "./taxonomy-inputs";

// The shared field skin from app/globals.css, the same one /join uses. The
// string that was here focused with ring-primary, which is --brand at 2.80:1
// against this ground and effectively invisible as a focus indicator, and sat
// at 14px, below the size at which iOS Safari stops zooming the viewport on
// focus. .field fixes both and carries the select chevron and hover state too.
const inputClasses = "field";
const labelClasses = "field-label";
const hintClasses = "field-hint";

/**
 * Formats an ISO timestamp for a datetime-local input, which only accepts
 * "YYYY-MM-DDTHH:mm" with no timezone and reads it as local time. Going through
 * toISOString here would shift the displayed time by the UTC offset.
 */
function toLocalInput(iso: string | null) {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours(),
  )}:${pad(date.getMinutes())}`;
}

export function PostEditor({
  post,
  facets,
}: {
  post: Post | null;
  /** Authors and categories already in use, offered as one-click chips. */
  facets: PostFacets;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const coverInputRef = useRef<HTMLInputElement>(null);
  const [coverUploading, setCoverUploading] = useState(false);

  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [authorName, setAuthorName] = useState(post?.authorName ?? "SLIC");
  const [categories, setCategories] = useState<string[]>(
    post?.categories ?? [],
  );
  const [featured, setFeatured] = useState(post?.featured ?? false);
  const [status, setStatus] = useState<"draft" | "published">(
    post?.status ?? "draft",
  );
  const [publishedAt, setPublishedAt] = useState(
    toLocalInput(post?.publishedAt ?? null),
  );
  const [coverImage, setCoverImage] = useState<PostImage | null>(
    post?.coverImage ?? null,
  );
  const [body, setBody] = useState<TipTapDoc>(post?.body ?? EMPTY_DOC);

  // Only mirror the title into the slug until someone edits the slug by hand.
  // Renaming a live post silently would break its URL and every inbound link.
  const [slugLocked, setSlugLocked] = useState(Boolean(post));

  const [preview, setPreview] = useState(false);

  /**
   * The post as <Article> would receive it, built from what is on screen right
   * now rather than from what is saved. A blank publish date stands in as
   * "now", mirroring what savePost() will stamp on first publish, and readTime
   * is derived with the same helper the server uses so the byline matches.
   */
  const previewPost: Post = {
    id: post?.id ?? "preview",
    title: title || "Untitled",
    slug,
    excerpt,
    body,
    coverImage,
    authorName,
    categories,
    featured,
    status,
    publishedAt: publishedAt
      ? new Date(publishedAt).toISOString()
      : new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    readTime: readTime(body),
  };

  const handleTitle = (value: string) => {
    setTitle(value);
    if (!slugLocked) setSlug(slugify(value));
  };

  const handleCover = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setCoverUploading(true);
    try {
      // Alt carries over so re-uploading an image doesn't wipe the text.
      setCoverImage(await uploadImage(file, coverImage?.alt ?? ""));
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not upload that image.",
      );
    } finally {
      setCoverUploading(false);
    }
  };

  const submit = (nextStatus?: "draft" | "published") => {
    const effectiveStatus = nextStatus ?? status;
    if (nextStatus) setStatus(nextStatus);

    startTransition(async () => {
      const result = await savePost(post?.id ?? null, {
        title,
        slug,
        excerpt,
        authorName,
        categories,
        featured,
        status: effectiveStatus,
        /**
         * Converted here, in the browser, rather than sent as the raw input
         * value.
         *
         * A datetime-local input yields a bare "2026-08-24T14:00" with no zone,
         * and new Date() reads that in whatever timezone it is parsed in. The
         * server action parses it, and a Vercel function runs in UTC, so an
         * editor in IST who picked 2pm had it stored as 2pm UTC: half past
         * seven their time, five and a half hours in the future. The public
         * query filters on publishedAt <= now, so the post simply did not
         * appear until then.
         *
         * toISOString() resolves it against the editor's own clock, which is
         * the only place the intended instant is actually known, and sends an
         * absolute one. It is the same conversion the preview object above has
         * always done, which is why preview looked right while the live site
         * disagreed.
         */
        publishedAt: publishedAt ? new Date(publishedAt).toISOString() : "",
        coverImage,
        body,
      });

      if (!result.ok) {
        toast.error(result.error);
        return;
      }

      toast.success(
        effectiveStatus === "published" ? "Published." : "Draft saved.",
      );

      if (!post) {
        // A new post has no id in the URL yet; move to its edit page so a
        // second save updates it instead of inserting a duplicate.
        router.replace(`/admin/edit/${result.id}`);
      }
      router.refresh();
    });
  };

  const remove = () => {
    if (!post) return;
    if (!window.confirm(`Delete "${post.title}"? This cannot be undone.`))
      return;
    startTransition(() => deletePost(post.id));
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
      className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start"
    >
      {/* ------------------------------------------------------------------ */}
      {/* Main column                                                        */}
      {/* ------------------------------------------------------------------ */}
      <div className="space-y-6">
        <div>
          <label htmlFor="title" className={labelClasses}>
            Title
          </label>
          <input
            id="title"
            value={title}
            onChange={(event) => handleTitle(event.target.value)}
            placeholder="Why your TikTok ads stop at three seconds"
            className={`${inputClasses} text-lg`}
          />
        </div>

        <div>
          <label htmlFor="excerpt" className={labelClasses}>
            Excerpt
          </label>
          <textarea
            id="excerpt"
            value={excerpt}
            onChange={(event) => setExcerpt(event.target.value)}
            rows={2}
            placeholder="Leave blank to use the opening of the article."
            className={`${inputClasses} resize-y`}
          />
          <p className={hintClasses}>
            Shown on the blog index card. Blank means it gets derived from the
            first 180 characters of the body.
          </p>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className={`${labelClasses} mb-0`}>Body</span>

            <div
              role="group"
              aria-label="Editor view"
              className="flex gap-0.5 rounded-lg border border-white/10 p-0.5"
            >
              {(
                [
                  ["Write", Pencil, false],
                  ["Preview", Eye, true],
                ] as const
              ).map(([label, Icon, wantsPreview]) => (
                <button
                  key={label}
                  type="button"
                  aria-pressed={preview === wantsPreview}
                  onClick={() => setPreview(wantsPreview)}
                  className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                    preview === wantsPreview
                      ? "bg-primary/15 text-primary"
                      : "text-foreground/50 hover:text-foreground"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* The editor stays mounted and is merely hidden. Unmounting it would
              destroy the TipTap instance, taking the undo history and the
              cursor position with it every time the preview is toggled. */}
          <div className={preview ? "hidden" : undefined}>
            <RichTextEditor
              value={body}
              onChange={setBody}
              onError={(message) => toast.error(message)}
            />
          </div>

          {preview && (
            <div className="rounded-xl border border-white/10 bg-[#131417a9] px-4 py-8 sm:px-6 md:py-10">
              <Article post={previewPost} />
            </div>
          )}
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Sidebar                                                            */}
      {/* ------------------------------------------------------------------ */}
      <aside className="space-y-6 lg:sticky lg:top-8">
        <div className="rounded-xl border border-white/10 bg-white/2 p-4 space-y-4">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={pending}
              onClick={() => submit("published")}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-gradient-primary px-4 py-2.5 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {pending && <Loader2 className="h-4 w-4 animate-spin" />}
              {status === "published" ? "Update" : "Publish"}
            </button>
            <button
              type="button"
              disabled={pending}
              onClick={() => submit("draft")}
              className="rounded-lg border border-white/15 px-4 py-2.5 text-sm font-medium text-foreground/80 transition-colors hover:border-white/30 hover:text-foreground disabled:opacity-50"
            >
              Save draft
            </button>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-foreground/50 uppercase tracking-wide">
              Status
            </span>
            <span
              className={`rounded-full px-2.5 py-1 font-semibold ${
                status === "published"
                  ? "bg-primary/15 text-primary"
                  : "bg-white/10 text-foreground/60"
              }`}
            >
              {status === "published" ? "Published" : "Draft"}
            </span>
          </div>

          {post && status === "published" && (
            <Link
              href={`/blog/${post.slug}`}
              target="_blank"
              className="flex items-center gap-1.5 text-xs text-primary hover:underline"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              View on the site
            </Link>
          )}
        </div>

        <div className="rounded-xl border border-white/10 bg-white/2 p-4 space-y-4">
          <div>
            <label htmlFor="slug" className={labelClasses}>
              Slug
            </label>
            <input
              id="slug"
              value={slug}
              onChange={(event) => {
                setSlugLocked(true);
                setSlug(slugify(event.target.value));
              }}
              placeholder="auto-from-title"
              className={`${inputClasses} font-mono text-xs`}
            />
            <p className={hintClasses}>/blog/{slug || "..."}</p>
          </div>

          <AuthorField
            value={authorName}
            onChange={setAuthorName}
            suggestions={facets.authors}
            inputClassName={inputClasses}
            labelClassName={labelClasses}
          />

          <CategoryPicker
            value={categories}
            onChange={setCategories}
            suggestions={facets.categories}
            inputClassName={inputClasses}
            labelClassName={labelClasses}
            hintClassName={hintClasses}
          />

          <div>
            <label htmlFor="publishedAt" className={labelClasses}>
              Publish date
            </label>
            <input
              id="publishedAt"
              type="datetime-local"
              value={publishedAt}
              onChange={(event) => setPublishedAt(event.target.value)}
              className={inputClasses}
            />
            <p className={hintClasses}>
              Blank stamps the current time on first publish. A future date
              keeps the post off the blog until then. Clearing this on a live
              post keeps its original date rather than resetting it.
            </p>
          </div>

          <label className="flex items-center gap-2.5 text-sm text-foreground/80 cursor-pointer">
            <input
              type="checkbox"
              checked={featured}
              onChange={(event) => setFeatured(event.target.checked)}
              className="h-4 w-4 rounded border-white/20 bg-black/40 accent-(--brand)"
            />
            Feature on the blog index
          </label>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/2 p-4 space-y-3">
          <span className={labelClasses}>Cover image</span>

          {/*
            Worth spelling out: the cost of skipping this is invisible from
            inside the editor. The post looks fine without a cover, and the
            consequence only shows up months later in someone else's LinkedIn
            feed as the generic company card.
          */}
          <p className={hintClasses}>
            Used on the blog index, at the top of the post, and as the link
            preview when the post is shared on LinkedIn or X. Without one, every
            share falls back to the same generic SLIC card. Landscape, 1200px
            wide or more.
          </p>

          {coverImage ? (
            <div className="space-y-3">
              <div className="relative overflow-hidden rounded-lg ring-1 ring-white/10">
                <Image
                  src={coverImage.url}
                  alt={coverImage.alt || "Cover"}
                  width={coverImage.width}
                  height={coverImage.height}
                  className="h-auto w-full"
                />
                <button
                  type="button"
                  onClick={() => setCoverImage(null)}
                  aria-label="Remove cover image"
                  className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-black/70 text-foreground/80 hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <input
                value={coverImage.alt}
                onChange={(event) =>
                  setCoverImage({ ...coverImage, alt: event.target.value })
                }
                placeholder="Alt text"
                className={inputClasses}
              />
              <p className={hintClasses}>
                {coverImage.width}x{coverImage.height}
              </p>
            </div>
          ) : (
            <button
              type="button"
              disabled={coverUploading}
              onClick={() => coverInputRef.current?.click()}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-white/15 px-4 py-6 text-sm text-foreground/60 transition-colors hover:border-primary/50 hover:text-foreground disabled:opacity-50"
            >
              {coverUploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              {coverUploading ? "Uploading..." : "Upload cover"}
            </button>
          )}

          <input
            ref={coverInputRef}
            type="file"
            accept={UPLOAD_ACCEPT_ATTR}
            onChange={handleCover}
            className="hidden"
          />
        </div>

        {post && (
          <button
            type="button"
            onClick={remove}
            disabled={pending}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-500/30 px-4 py-2.5 text-sm font-medium text-red-400 transition-colors hover:border-red-500/60 hover:bg-red-500/10 disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" />
            Delete post
          </button>
        )}
      </aside>
    </form>
  );
}
