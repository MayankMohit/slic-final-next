import Link from "next/link";
import Image from "next/image";
import { FileText, Star } from "lucide-react";
import { getAllPosts } from "@/lib/posts";
import { isDbConfigured } from "@/lib/mongodb";
import { BLOG_PLACEHOLDER_IMAGE } from "@/lib/post-types";

export const metadata = { title: "Posts" };


function formatDate(iso: string | null) {
  if (!iso) return "No date";
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeZone: "Asia/Kolkata",
  }).format(new Date(iso));
}

export default async function AdminPostsPage() {
  if (!isDbConfigured) {
    return (
      <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-6">
        <h2 className="mb-2 text-sm font-semibold text-amber-300">
          No database connected
        </h2>
        <p className="text-sm leading-relaxed text-foreground/70">
          Set <code className="rounded bg-black/40 px-1.5 py-0.5">MONGODB_URI</code>{" "}
          in <code className="rounded bg-black/40 px-1.5 py-0.5">.env.local</code> and
          restart the dev server. See{" "}
          <code className="rounded bg-black/40 px-1.5 py-0.5">docs/blog-admin.md</code>{" "}
          for the full setup.
        </p>
      </div>
    );
  }

  const posts = await getAllPosts();

  if (posts.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-white/15 px-6 py-16 text-center">
        <FileText className="mx-auto mb-4 h-8 w-8 text-foreground/25" />
        <h2 className="mb-2 text-base font-semibold text-foreground">No posts yet</h2>
        <p className="mx-auto mb-6 max-w-sm text-sm text-foreground/55">
          Write the first one. Drafts stay off the public blog until you publish
          them.
        </p>
        <Link
          href="/admin/new"
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-primary px-4 py-2.5 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90"
        >
          New post
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="mb-4 flex items-baseline gap-2 text-xs text-foreground/45">
        <span>{posts.length} post{posts.length === 1 ? "" : "s"}</span>
        <span>&middot;</span>
        <span>{posts.filter((post) => post.status === "draft").length} draft</span>
      </div>

      {posts.map((post) => (
        <Link
          key={post.id}
          href={`/admin/edit/${post.id}`}
          className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/2 p-3 transition-colors hover:border-primary/40 hover:bg-white/5"
        >
          <Image
            src={post.coverImage?.url || BLOG_PLACEHOLDER_IMAGE}
            alt=""
            width={96}
            height={64}
            className="h-16 w-24 shrink-0 rounded-lg object-cover ring-1 ring-white/10"
          />

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h2 className="truncate text-sm font-semibold text-foreground">
                {post.title || "Untitled"}
              </h2>
              {post.featured && (
                <Star
                  className="h-3.5 w-3.5 shrink-0 fill-primary text-primary"
                  aria-label="Featured"
                />
              )}
            </div>
            <p className="mt-0.5 truncate font-mono text-xs text-foreground/40">
              /blog/{post.slug}
            </p>
            <p className="mt-1 text-xs text-foreground/50">
              {formatDate(post.publishedAt)} &middot; {post.readTime}
              {post.categories.length > 0 && ` · ${post.categories.join(", ")}`}
            </p>
          </div>

          <span
            className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
              post.status === "published"
                ? "bg-primary/15 text-primary"
                : "bg-white/10 text-foreground/60"
            }`}
          >
            {post.status === "published" ? "Live" : "Draft"}
          </span>
        </Link>
      ))}
    </div>
  );
}
