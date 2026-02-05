import { client } from "@/lib/sanity";
import { BlogPostView } from "./BlogPostView";

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const post = await client.fetch(
    `*[_type == "post" && slug.current == $slug][0]{
      title,
      slug,
      body,
      publishedAt,
      author->,
      mainImage,
      categories[]->{
        title
      }
    }`,
    { slug }
  );

  if (!post) return <div>Post not found</div>;

  const formattedDate = new Date(post.publishedAt)
    .toISOString()
    .split("T")[0];

  return <BlogPostView post={post} formattedDate={formattedDate} />;
}
