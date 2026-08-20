import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Article } from "@/components/blog/article";
import type { Post } from "@/lib/post-types";

/**
 * The public article page: site chrome around the shared <Article>.
 *
 * The article markup itself lives in components/blog/article.tsx because the
 * admin preview renders the very same component. Keeping only the page frame
 * here is what stops the preview and the published page drifting apart.
 */
export function BlogPostView({ post }: { post: Post }) {
  return (
    <main className="min-h-screen bg-transparent">
      <Navbar />

      <div className="pt-24 md:pt-32 pb-16 md:pb-20 px-4 sm:px-6 lg:px-8 bg-[#131417a9]">
        <Article post={post} />
      </div>

      <Footer />
    </main>
  );
}
