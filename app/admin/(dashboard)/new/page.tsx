import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getPostFacets } from "@/lib/posts";
import { PostEditor } from "../../post-editor";

export const metadata = { title: "New post" };

export default async function NewPostPage() {
  const facets = await getPostFacets();

  return (
    <>
      <Link
        href="/admin"
        className="mb-6 inline-flex items-center gap-1.5 text-xs text-foreground/50 transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        All posts
      </Link>

      {/* No post: the editor starts empty and its first save inserts, then
          redirects to /admin/edit/<id> so the next save updates. */}
      <PostEditor post={null} facets={facets} />
    </>
  );
}
