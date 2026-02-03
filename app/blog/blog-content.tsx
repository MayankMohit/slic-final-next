"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Clock, ArrowRight } from "lucide-react";
import { GlowCard } from "@/components/ui/glow-card";
import { CTASection } from "@/components/sections/cta-section";

// Sanity post type matching your schema
interface SanityPost {
  title: string;
  slug: { current: string };
  publishedAt: string;
  author?: { name: string };
  mainImage?: any;
  categories?: Array<{ title: string }>;
}

interface BlogPageContentProps {
  posts: SanityPost[];
}

export function BlogPageContent({ posts }: BlogPageContentProps) {
  const featuredPosts = posts.slice(0, 3); // First 3 as featured
  const regularPosts = posts.slice(3); // Rest as regular

  const getReadTime = () => `${Math.ceil(Math.random() * 8 + 3)} min read`;
  const getCategory = (post: SanityPost) => post.categories?.[0]?.title || "Insights";
  const getExcerpt = (post: SanityPost) => `${post.title.slice(0, 100)}...`;

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
              <span className="inline-block text-sm font-semibold text-primary mb-4 uppercase tracking-wider">
                Blog & Insights
              </span>
              <h1 className="font-sans text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance">
                Learn to Create Viral Content
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
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
                    <Link href={`/blog/${post.slug.current}`} className="block h-full group">
                      <GlowCard className="h-full p-6">
                        <div className="flex flex-col h-full">
                          <span className="inline-block px-3 py-1 text-xs rounded-full bg-primary/10 text-primary w-fit mb-4">
                            {getCategory(post)}
                          </span>
                          <h3 className="font-sans text-xl font-semibold mb-3 text-foreground group-hover:text-primary transition-colors">
                            {post.title}
                          </h3>
                          <p className="text-sm text-muted-foreground grow leading-relaxed">
                            {getExcerpt(post)}
                          </p>
                          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border/50 text-xs text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            <span>{getReadTime()}</span>
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
            <div className="grid md:grid-cols-2 gap-6">
              {regularPosts.map((post, index) => (
                <motion.div
                  key={post.slug.current}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link href={`/blog/${post.slug.current}`} className="block h-full group">
                    <GlowCard className="h-full p-6">
                      <div className="flex flex-col h-full">
                        <span className="inline-block px-3 py-1 text-xs rounded-full bg-primary/10 text-primary w-fit mb-4">
                          {getCategory(post)}
                        </span>
                        <h3 className="font-sans text-lg font-semibold mb-2 text-foreground group-hover:text-primary transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-sm text-muted-foreground grow leading-relaxed">
                          {getExcerpt(post)}
                        </p>
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-muted-foreground/50">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            <span>{getReadTime()}</span>
                          </div>
                          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
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
