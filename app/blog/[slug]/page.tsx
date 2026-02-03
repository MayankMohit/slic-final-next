import { client } from '@/lib/sanity'

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await client.fetch(
    `*[_type == "post" && slug.current == $slug][0]{
      title, slug, body, publishedAt, author->, mainImage, categories
    }`, { slug: params.slug }
  )
  
  if (!post) return <div>Post not found</div>
  
  return (
    <article>
      <h1>{post.title}</h1>
      <time>{new Date(post.publishedAt).toLocaleDateString()}</time>
      <div>{/* Render post.body with @sanity/block-content-to-react */}</div>
    </article>
  )
}
