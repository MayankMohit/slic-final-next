import Image from "next/image";
import { PortableText, PortableTextComponents } from "@portabletext/react";
import { urlFor } from "@/lib/sanity";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

interface BlogPostViewProps {
  post: any;
  formattedDate: string;
}

const portableTextComponents: PortableTextComponents = {
  types: {
    image: ({ value }) => (
      <div className="my-10">
        <Image
          src={urlFor(value).width(1200).url()}
          alt={value.alt || "Blog image"}
          width={1200}
          height={700}
          className="rounded-2xl w-full h-auto object-cover"
        />
      </div>
    ),
  },
  block: {
    h1: ({ children }) => (
      <h1 className="text-4xl font-bold mt-12 mb-6">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-3xl font-semibold mt-10 mb-5">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-2xl font-semibold mt-8 mb-4">{children}</h3>
    ),
    normal: ({ children }) => (
      <p className="text-lg leading-8 text-muted-foreground mb-6">
        {children}
      </p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-primary pl-6 italic my-8 text-xl">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc pl-6 space-y-2 my-6 text-lg">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal pl-6 space-y-2 my-6 text-lg">
        {children}
      </ol>
    ),
  },
};

export function BlogPostView({ post, formattedDate }: BlogPostViewProps) {
  return (
    <main className="min-h-screen bg-transparent">
      <Navbar />

      <div className="pt-35 pb-20 flex justify-center w-[75%] mx-auto bg-[#131417a9]">
        <div className=" max-w-6xl ">

          {/* Hero Image */}
          {post.mainImage && (
            <div className="mb-12">
              <Image
                src={urlFor(post.mainImage).width(1600).url()}
                alt={post.mainImage.alt || post.title}
                width={1600}
                height={900}
                priority
                className="rounded-3xl w-full h-auto object-cover shadow-xl"
              />
            </div>
          )}

          {/* Categories */}
          <div className="flex flex-wrap gap-3 mb-6">
            {post.categories?.map((cat: any) => (
              <span
                key={cat.title}
                className="px-4 py-1 text-sm rounded-full bg-primary/10 text-primary"
              >
                {cat.title}
              </span>
            ))}
          </div>

          {/* Title */}
          <h1 className="text-5xl font-bold mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Author + Date */}
          <div className="flex items-center gap-4 mb-12">
            {post.author?.image && (
              <Image
                src={urlFor(post.author.image).width(100).url()}
                alt={post.author.name}
                width={50}
                height={50}
                className="rounded-full"
              />
            )}
            <div>
              <p className="font-medium">{post.author?.name}</p>
              <p className="text-sm text-muted-foreground">
                {formattedDate}
              </p>
            </div>
          </div>

          {/* Body */}
          <article className="prose prose-neutral max-w-none">
            <PortableText
              value={post.body}
              components={portableTextComponents}
            />
          </article>

        </div>
      </div>

      <Footer />
    </main>
  );
}
