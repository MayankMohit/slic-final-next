import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getPostById, getPostFacets } from "@/lib/posts";
import { PostEditor } from "../../../post-editor";

export const metadata = { title: "Edit post" };


export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const post = await getPostById((await params).id);
  if (!post) notFound();

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

      <PostEditor post={post} facets={facets} />
    </>
  );
}
