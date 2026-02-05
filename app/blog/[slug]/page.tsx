import { sanityFetch } from "@/lib/sanity.live";
import { BlogPostView } from "./BlogPostView";

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const {data: post} = await sanityFetch({
    query: `*[_type == "post" && slug.current == $slug][0]{
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
    params: { slug },
  });

  if (!post) return <div>Post not found</div>;

  const formattedDate = new Date(post.publishedAt).toISOString().split("T")[0];

  return <BlogPostView post={post} formattedDate={formattedDate} />;
}
