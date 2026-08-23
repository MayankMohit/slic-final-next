import Image from "next/image";
import { TipTapContent } from "@/lib/tiptap-render";
import { postImageUrl, type Post } from "@/lib/post-types";

/**
 * The article itself: cover, categories, headline, byline, body.
 *
 * Shared deliberately between the public route and the admin preview. Both
 * render this exact component, so "what the preview shows" and "what a reader
 * sees" cannot drift apart -- a styling change lands in both or neither.
 *
 * Carries no Navbar, Footer or page chrome, because the preview sits inside the
 * editor rather than on a page of its own.
 *
 * Nothing here is server-only, so it is safe to render from the client-side
 * editor: TipTapContent and next/image both work in either environment.
 */
export function Article({ post }: { post: Post }) {
  const cover = post.coverImage;

  // Matches what the route used to compute: a plain YYYY-MM-DD.
  const publishedOn = post.publishedAt
    ? new Date(post.publishedAt).toISOString().split("T")[0]
    : "";

  return (
    <div className="max-w-4xl lg:max-w-5xl mx-auto">
      {/* Hero image - always rendered; falls back to the placeholder so the
          article doesn't open on a bare headline. The stored width and height
          are the real ones, captured at upload, so the space reserved before
          the image loads matches what arrives. */}
      <div className="mb-8 md:mb-12">
        <Image
          src={postImageUrl(cover)}
          alt={cover?.alt || post.title}
          width={cover?.width ?? 1600}
          height={cover?.height ?? 900}
          priority
          sizes="(min-width: 1024px) 64rem, 100vw"
          className="rounded-3xl w-full h-auto object-cover shadow-xl"
        />
      </div>

      {post.categories.length > 0 && (
        <div className="flex flex-wrap gap-2 md:gap-3 mb-6">
          {post.categories.map((category) => (
            <span
              key={category}
              className="px-4 py-1 text-sm rounded-full bg-primary/10 text-brand-alt"
            >
              {category}
            </span>
          ))}
        </div>
      )}

      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-tight">
        {post.title}
      </h1>

      <div className="flex items-center gap-3 md:gap-4 mb-8 md:mb-12">
        <div>
          <p className="font-medium">{post.authorName}</p>
          <p className="text-sm text-foreground/80">
            {publishedOn}
            {publishedOn && " · "}
            {post.readTime}
          </p>
        </div>
      </div>

      {/* The `prose` classes the Sanity version carried did nothing -
          @tailwindcss/typography is not installed - so every element style
          lives in lib/tiptap-render.tsx instead. */}
      <article className="max-w-none overflow-hidden">
        <TipTapContent doc={post.body} />
      </article>
    </div>
  );
}
