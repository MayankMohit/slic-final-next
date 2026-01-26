'use client';

import { motion } from "framer-motion";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Clock, ArrowRight } from "lucide-react";
import { GlowCard } from "@/components/ui/glow-card";
import { CTASection } from "@/components/sections/cta-section";

const blogPosts = [
  {
    title: "TikTok Ad Trends: What's Working in 2024",
    excerpt: "Discover the latest TikTok ad formats and creative strategies driving the highest ROAS for DTC brands this year.",
    category: "Trends",
    readTime: "5 min read",
    slug: "/blog/tiktok-ad-trends-2024",
    featured: true,
  },
  {
    title: "The Psychology of Scroll-Stopping Creatives",
    excerpt: "Why certain videos make you stop scrolling—and how to apply these principles to your ad creatives for maximum impact.",
    category: "Strategy",
    readTime: "7 min read",
    slug: "/blog/psychology-scroll-stopping-creatives",
    featured: true,
  },
  {
    title: "TikTok vs Instagram Reels for DTC Brands",
    excerpt: "A data-driven comparison to help you decide where to invest your content marketing budget for maximum ROI.",
    category: "Platform Guides",
    readTime: "6 min read",
    slug: "/blog/tiktok-vs-instagram-reels-dtc",
    featured: true,
  },
  {
    title: "How to Script Videos That Convert",
    excerpt: "The proven framework we use to write video scripts that hook viewers in the first 3 seconds and drive action.",
    category: "Strategy",
    readTime: "8 min read",
    slug: "/blog/script-videos-that-convert",
    featured: false,
  },
  {
    title: "Meta Ads Video Best Practices for 2024",
    excerpt: "Everything you need to know about creating high-performing video ads for Facebook and Instagram in the current landscape.",
    category: "Platform Guides",
    readTime: "10 min read",
    slug: "/blog/meta-ads-video-best-practices",
    featured: false,
  },
  {
    title: "UGC vs Professional Ads: What Performs Better?",
    excerpt: "We tested $100K in ad spend to answer the age-old question. The results might surprise you.",
    category: "Case Studies",
    readTime: "6 min read",
    slug: "/blog/ugc-vs-professional-ads",
    featured: false,
  },
  {
    title: "Building a Content Calendar That Drives Results",
    excerpt: "How to plan and organize your social content for consistent growth without burning out.",
    category: "Strategy",
    readTime: "5 min read",
    slug: "/blog/content-calendar-results",
    featured: false,
  },
  {
    title: "YouTube Shorts for Brand Growth",
    excerpt: "Why YouTube Shorts is the most underutilized platform for DTC brands and how to win there.",
    category: "Platform Guides",
    readTime: "7 min read",
    slug: "/blog/youtube-shorts-brand-growth",
    featured: false,
  },
];

export function BlogPageContent() {
  const featuredPosts = blogPosts.filter((post) => post.featured);
  const regularPosts = blogPosts.filter((post) => !post.featured);

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
              <span className="inline-block text-sm font-medium text-primary mb-4 uppercase tracking-wider">
                Blog & Insights
              </span>

              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance">
                Learn to Create Viral Content
              </h1>

              <p className="text-lg text-muted-foreground leading-relaxed">
                Actionable insights on video marketing, social media growth, and ad creative strategies from our team.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <section className="section-padding pt-0">
            <div className="container-tight">
              <h2 className="font-display text-2xl font-semibold mb-8 text-foreground">Featured Articles</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {featuredPosts.map((post, index) => (
                  <motion.div
                    key={post.slug}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Link href={post.slug} className="block h-full group">
                      <GlowCard className="h-full p-6">
                        <div className="flex flex-col h-full">
                          <span className="inline-block px-3 py-1 text-xs rounded-full bg-primary/10 text-primary w-fit mb-4">
                            {post.category}
                          </span>
                          <h3 className="font-display text-xl font-semibold mb-3 text-foreground group-hover:text-primary transition-colors">
                            {post.title}
                          </h3>
                          <p className="text-sm text-muted-foreground grow leading-relaxed">
                            {post.excerpt}
                          </p>
                          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border/50 text-xs text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            <span>{post.readTime}</span>
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
              <h2 className="font-display text-2xl font-semibold mb-8 text-foreground">All Articles</h2>
            )}
            
            <div className="grid md:grid-cols-2 gap-6">
              {regularPosts.map((post, index) => (
                <motion.div
                  key={post.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link href={post.slug} className="block h-full group">
                    <GlowCard className="h-full p-6">
                      <div className="flex flex-col h-full">
                        <span className="inline-block px-3 py-1 text-xs rounded-full bg-primary/10 text-primary w-fit mb-4">
                          {post.category}
                        </span>
                        <h3 className="font-display text-lg font-semibold mb-2 text-foreground group-hover:text-primary transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-sm text-muted-foreground grow leading-relaxed">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-muted-foreground/50">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            <span>{post.readTime}</span>
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

        {/* CTA */}
        <CTASection />
      </div>

      <Footer />
    </main>
  );
}
