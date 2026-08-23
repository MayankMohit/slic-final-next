"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Clock, ArrowRight } from "lucide-react";
import { GlowCard } from "@/components/ui/glow-card";
import { CTASection } from "@/components/sections/cta-section";
import Image from "next/image";
import { postImageUrl, type Post } from "@/lib/post-types";

interface BlogPageContentProps {
  posts: Post[];
}

export function BlogPageContent({ posts }: BlogPageContentProps) {
  const featuredPosts = posts.filter((post) => post.featured);
  const allPosts = posts;

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
                    key={post.slug}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Link
                      href={`/blog/${post.slug}`}
                      className="block h-full group"
                    >
                      {/* h-full + flex-col is what makes the cards line up: the
                          grid already stretches every item to the tallest in the
                          row, but the card has to fill that height for the
                          footer to sit at the bottom rather than under the
                          excerpt. */}
                      <GlowCard className="overflow-hidden p-0 min-h-[48vh] h-full flex flex-col">
                        {/* Fixed 12rem strip, and object-contain rather than
                            object-cover so the whole image is visible instead
                            of being cropped to fill. The height is on the
                            container, never the image, so cards stay identical
                            whatever the source dimensions are. The dark ground
                            is what the letterboxing falls back to — without it
                            the gaps beside a portrait image read as a hole in
                            the card. */}
                        <div className="relative h-48 w-full shrink-0 bg-black/25">
                          <Image
                            src={postImageUrl(post.coverImage)}
                            alt={post.coverImage?.alt || post.title}
                            fill
                            sizes="(min-width: 768px) 33vw, 100vw"
                            className="object-contain"
                          />
                        </div>

                        <div className="p-6 flex flex-col grow">
                          {/* Tags */}
                          <div className="flex flex-wrap gap-2 mb-3">
                            {post.categories.map((category) => (
                              <span
                                key={category}
                                className="text-xs px-3 py-1 rounded-full bg-primary/10 text-brand-alt"
                              >
                                {category}
                              </span>
                            ))}
                          </div>

                          {/* Title — capped at two lines, and always reserving
                              two lines' worth of space so a one-line title
                              doesn't leave its card shorter than its
                              neighbours. min-h-14 is 3.5rem — two lines of
                              text-lg, whose line-height is 1.75rem. */}
                          <h3 className="font-semibold text-lg mb-2 line-clamp-2 min-h-14 group-hover:text-brand-alt transition-colors">
                            {post.title}
                          </h3>

                          {/* Excerpt */}
                          <p className="text-sm text-foreground/80 grow leading-relaxed">
                            {post.excerpt}
                          </p>

                          {/* Footer */}
                          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50 text-xs text-foreground/80">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              <span>{post.readTime}</span>
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
                  key={post.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link
                    href={`/blog/${post.slug}`}
                    className="block h-full group"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <GlowCard className="overflow-hidden p-0 min-h-[48vh] h-full flex flex-col">
                      {/* Fixed strip + object-contain, same as the featured
                          grid above — full image, never cropped, and the card
                          height is independent of the source dimensions. */}
                      <div className="relative h-48 w-full shrink-0 bg-black/25">
                        <Image
                          src={postImageUrl(post.coverImage)}
                          alt={post.coverImage?.alt || post.title}
                          fill
                          sizes="(min-width: 768px) 33vw, 100vw"
                          className="object-contain"
                        />
                      </div>

                      <div className="p-6 flex flex-col grow">
                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          {post.categories.map((category) => (
                            <span
                              key={category}
                              className="text-xs px-3 py-1 rounded-full bg-primary/10 text-brand-alt"
                            >
                              {category}
                            </span>
                          ))}
                        </div>

                        {/* Title — two lines then truncate, with the two lines
                            always reserved so card heights match. */}
                        <h3 className="font-semibold text-lg mb-2 line-clamp-2 min-h-14 group-hover:text-brand-alt transition-colors">
                          {post.title}
                        </h3>

                        {/* Excerpt */}
                        <p className="text-sm text-foreground/80 grow leading-relaxed">
                          {post.excerpt}
                        </p>

                        {/* Footer */}
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50 text-xs text-foreground/80">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{post.readTime}</span>
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
