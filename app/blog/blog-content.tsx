"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Clock, ArrowRight } from "lucide-react";
import { GlowCard } from "@/components/ui/glow-card";
import { CTASection } from "@/components/sections/cta-section";
import Image from "next/image";
import { urlFor } from "@/lib/sanity";

// Sanity post type matching your schema
interface SanityPost {
  title: string;
  slug: { current: string };
  publishedAt: string;
  body?: any[];
  mainImage?: any;
  featured?: boolean;
  author?: {
    name: string;
    image?: any;
  };
  categories?: Array<{ title: string }>;
}

interface BlogPageContentProps {
  posts: SanityPost[];
}

export function BlogPageContent({ posts }: BlogPageContentProps) {
  const featuredPosts = posts.filter((post) => post.featured);
  const allPosts = posts;

  const getReadTime = (post: SanityPost) => {
    if (!post.body) return "1 min read";

    const plainText = post.body
      .filter((block: any) => block._type === "block" && block.children)
      .map((block: any) =>
        block.children
          .filter((child: any) => child._type === "span")
          .map((child: any) => child.text)
          .join(" "),
      )
      .join(" ");

    const words = plainText.trim().split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.ceil(words / 200));

    return `${minutes} min read`;
  };

  const getExcerpt = (post: SanityPost) => {
    if (!post.body) return "";

    const plainText = post.body
      .map((block: any) =>
        block._type === "block"
          ? block.children.map((child: any) => child.text).join("")
          : "",
      )
      .join(" ");

    return plainText.slice(0, 180) + "...";
  };

  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="pt-20">
        {/* Hero */}
        <section className="section-padding">
          <div className="container-tight">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-3xl mx-auto"
            >
              <span className="tag">Blog & Insights</span>
              <h1 className="heading">Learn to Create Viral Content</h1>
              <p className="desc">
                Actionable insights on video marketing, social media growth, and
                ad creative strategies from our team.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <section className="section-padding pt-0">
            <div className="container-tight">
              <h2 className="font-sans text-2xl font-semibold mb-8 text-foreground">
                Featured Articles
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {featuredPosts.map((post, index) => (
                  <motion.div
                    key={post.slug.current}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Link
                      href={`/blog/${post.slug.current}`}
                      className="block h-full group"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <GlowCard className="overflow-hidden p-0 min-h-[48vh]">
                        {post.mainImage && (
                          <div className="relative h-48 w-full">
                            <Image
                              src={urlFor(post.mainImage).width(800).url()}
                              alt={post.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}

                        <div className="p-6 flex flex-col h-full">
                          {/* Tags */}
                          <div className="flex flex-wrap gap-2 mb-3">
                            {post.categories?.map((cat) => (
                              <span
                                key={cat.title}
                                className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary"
                              >
                                {cat.title}
                              </span>
                            ))}
                          </div>

                          {/* Title */}
                          <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                            {post.title}
                          </h3>

                          {/* Excerpt */}
                          <p className="text-sm text-muted-foreground grow leading-relaxed">
                            {getExcerpt(post)}
                          </p>

                          {/* Footer */}
                          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50 text-xs text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              <span>{getReadTime(post)}</span>
                            </div>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-all" />
                          </div>
                        </div>
                      </GlowCard>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* All Posts */}
        <section className="section-padding pt-0">
          <div className="container-tight">
            {featuredPosts.length > 0 && (
              <h2 className="font-sans text-2xl font-semibold mb-8 text-foreground">
                All Articles
              </h2>
            )}
            <div className="grid md:grid-cols-3 gap-6">
              {allPosts.map((post, index) => (
                <motion.div
                  key={post.slug.current}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link
                    href={`/blog/${post.slug.current}`}
                    className="block h-full group"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <GlowCard className="overflow-hidden p-0 min-h-[48vh]">
                      {post.mainImage && (
                        <div className="relative h-48 w-full">
                          <Image
                            src={urlFor(post.mainImage).width(800).url()}
                            alt={post.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}

                      <div className="p-6 flex flex-col h-full">
                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          {post.categories?.map((cat) => (
                            <span
                              key={cat.title}
                              className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary"
                            >
                              {cat.title}
                            </span>
                          ))}
                        </div>

                        {/* Title */}
                        <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                          {post.title}
                        </h3>

                        {/* Excerpt */}
                        <p className="text-sm text-muted-foreground grow leading-relaxed">
                          {getExcerpt(post)}
                        </p>

                        {/* Footer */}
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50 text-xs text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{getReadTime(post)}</span>
                          </div>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-all" />
                        </div>
                      </div>
                    </GlowCard>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <CTASection />
      </div>
      <Footer />
    </main>
  );
}
