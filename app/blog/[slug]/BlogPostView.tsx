import Image from "next/image";
import { PortableText, PortableTextComponents } from "@portabletext/react";
import { urlFor, postImageUrl } from "@/lib/sanity";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

interface BlogPostViewProps {
  post: any;
  formattedDate: string;
}

/**
 * Reads an image's real dimensions out of its Sanity asset reference, which
 * encodes them: image-<hash>-1498x750-png.
 *
 * Only the ratio matters here — next/image uses width and height to reserve
 * layout space, not to size the request. Passing the true ratio is what stops
 * the image being letterboxed into a fixed box and cropped.
 */
function assetDimensions(ref?: string) {
  const match = /-(\d+)x(\d+)-[a-z]+$/.exec(ref ?? "");
  return match
    ? { width: Number(match[1]), height: Number(match[2]) }
    : { width: 1200, height: 700 };
}

const portableTextComponents: PortableTextComponents = {
  types: {
    // Sanity writes the image object as soon as an editor fills in alt text, so
    // a block can be { _type: "image", alt: "..." } with no uploaded asset.
    // urlFor throws on those, and an uncaught throw here takes down the whole
    // route rather than just dropping one image.
    image: ({ value }) => {
      if (!value?.asset) return null;

      const { width, height } = assetDimensions(value.asset._ref);

      return (
        <div className="my-10">
          {/* The ring gives the image a visible edge. Several of these are
              dark screenshots, and against this page's near-black background
              an unbordered one reads as a gap in the article rather than as
              an image that loaded. */}
          <Image
            src={urlFor(value).width(1600).url()}
            alt={value.alt || "Blog image"}
            width={width}
            height={height}
            sizes="(min-width: 1024px) 64rem, 100vw"
            className="rounded-2xl w-full h-auto ring-1 ring-white/10"
          />
        </div>
      );
    },
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
      <p className="text-lg leading-8 text-foreground/80 mb-6">{children}</p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-primary pl-6 italic my-8 text-xl">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc pl-6 space-y-2 my-6 text-lg">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal pl-6 space-y-2 my-6 text-lg">{children}</ol>
    ),
  },
};

export function BlogPostView({ post, formattedDate }: BlogPostViewProps) {
  return (
    <main className="min-h-screen bg-transparent">
      <Navbar />

      <div className="pt-24 md:pt-32 pb-16 md:pb-20 px-4 sm:px-6 lg:px-8 bg-[#131417a9]">
        <div className="max-w-4xl lg:max-w-5xl mx-auto">
          {/* Hero image — always rendered; falls back to the placeholder so the
              article doesn't open on a bare headline. */}
          <div className="mb-8 md:mb-12">
            <Image
              src={postImageUrl(post.mainImage, 1600)}
              alt={post.mainImage?.alt || post.title}
              width={1600}
              height={900}
              priority
              className="rounded-3xl w-full h-auto object-cover shadow-xl"
            />
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 md:gap-3 mb-6">
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
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Author + Date */}
          <div className="flex items-center gap-3 md:gap-4 mb-8 md:mb-12">
            {post.author?.image?.asset && (
              <Image
                src={urlFor(post.author.image).width(100).url()}
                alt={post.author.name}
                width={50}
                height={50}
                className="rounded-full w-10 h-10 md:w-12 md:h-12"
              />
            )}
            <div>
              <p className="font-medium">{post.author?.name}</p>
              <p className="text-sm text-foreground/80">{formattedDate}</p>
            </div>
          </div>

          {/* Body */}
          <article className="prose prose-sm sm:prose-base lg:prose-lg prose-neutral max-w-none overflow-hidden">
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
