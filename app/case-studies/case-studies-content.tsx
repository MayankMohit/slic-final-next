"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import {
  TrendingUp,
  Users,
  DollarSign,
  ShoppingCart,
  Eye,
  BarChart3,
  Check,
} from "lucide-react";
import { GlowCard } from "@/components/ui/glow-card";
import { CTASection } from "@/components/sections/cta-section";

const caseStudies = [
  {
    icon: Users,
    metric: "0 → 150K",
    metricLabel: "Instagram Followers",
    title: "Lifestyle Brand Organic Growth",
    client: "Premium Fashion Label",
    challenge:
      "A new lifestyle brand needed to build social proof and a loyal following from scratch with zero existing presence.",
    solution:
      "Implemented our viral content framework with trend-jacking, UGC-style posts, and community engagement strategy.",
    results: [
      "150K followers in 90 days",
      "12% average engagement rate",
      "500% increase in website traffic",
      "45% of sales from social",
    ],
    tags: ["Instagram", "Organic Growth", "Content Strategy", "Fashion"],
  },
  {
    icon: TrendingUp,
    metric: "3x",
    metricLabel: "Conversion Rate Lift",
    title: "DTC Beauty Brand Transformation",
    client: "Skincare Startup",
    challenge:
      "A DTC skincare brand was struggling with high CPA and low ROAS from their paid social campaigns.",
    solution:
      "Created platform-native ad creatives with strong hooks, social proof elements, and optimized for conversions.",
    results: [
      "3x conversion rate increase",
      "65% reduction in CPA",
      "4.5x ROAS achieved",
      "200+ winning ad variations",
    ],
    tags: ["Meta Ads", "TikTok Ads", "Conversion", "Beauty"],
  },
  {
    icon: DollarSign,
    metric: "7-Figure",
    metricLabel: "Annual Revenue",
    title: "Startup to Scale Success",
    client: "Health & Wellness Brand",
    challenge:
      "A bootstrapped health brand needed to scale from $10K/month to $100K+/month without VC funding.",
    solution:
      "Full Brand Growth Package with comprehensive ad creative production and organic content strategy.",
    results: [
      "Scaled to 7-figure revenue",
      "8x return on ad spend",
      "80K organic followers",
      "Featured in major publications",
    ],
    tags: ["Full Funnel", "Viral Ads", "Growth", "Wellness"],
  },
  {
    icon: ShoppingCart,
    metric: "$2M+",
    metricLabel: "Revenue in Q4",
    title: "E-commerce Holiday Campaign",
    client: "Home Goods Brand",
    challenge:
      "Needed to maximize Q4 holiday revenue with limited budget and short timeline.",
    solution:
      "Rapid creative production with holiday-themed UGC and promotional content across all platforms.",
    results: [
      "$2M+ Q4 revenue",
      "400% increase vs previous year",
      "35% of annual revenue in 60 days",
      "10M+ video views",
    ],
    tags: ["E-commerce", "Seasonal", "Meta Ads", "Home"],
  },
  {
    icon: Eye,
    metric: "50M+",
    metricLabel: "Video Views",
    title: "Viral TikTok Campaign",
    client: "Food & Beverage Brand",
    challenge:
      "A new beverage brand needed massive awareness on a startup budget.",
    solution:
      "Creator partnerships combined with our in-house viral content production focused on TikTok.",
    results: [
      "50M+ organic views",
      "Multiple viral videos (1M+ views each)",
      "300% follower growth",
      "Sold out product launch",
    ],
    tags: ["TikTok", "Viral", "F&B", "Launch"],
  },
  {
    icon: BarChart3,
    metric: "500%",
    metricLabel: "ROAS Improvement",
    title: "Ad Creative Overhaul",
    client: "Fitness Equipment Brand",
    challenge:
      "Existing ads were burning through budget with poor returns. Needed a complete creative refresh.",
    solution:
      "Rebuilt entire creative strategy with new hooks, formats, and platform-specific optimizations.",
    results: [
      "500% ROAS improvement",
      "85% lower cost per acquisition",
      "50+ new winning creatives",
      "Expanded to 3 new platforms",
    ],
    tags: ["Paid Social", "Creative Strategy", "Fitness", "Performance"],
  },
];

export function CaseStudiesPageContent() {
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
                Case Studies
              </span>

              <h1 className="font-sans text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance">
                Real Results for Real Brands
              </h1>

              <p className="text-lg text-muted-foreground leading-relaxed">
                Numbers don&apos;t lie. Explore how we&apos;ve helped brands
                like yours achieve explosive growth through strategic video
                content.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Case Studies Grid */}
        <section className="section-padding pt-0">
          <div className="container-tight">
            <div className="grid md:grid-cols-2 gap-8">
              {caseStudies.map((study, index) => (
                <motion.div
                  key={study.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <GlowCard className="h-full p-6 md:p-8">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <div className="p-3 rounded-xl bg-primary/10 w-fit mb-3">
                          <study.icon className="w-6 h-6 text-primary" />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {study.client}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="font-sans text-3xl font-bold text-gradient">
                          {study.metric}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {study.metricLabel}
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <h2 className="font-sans text-xl font-semibold mb-4 text-foreground">
                      {study.title}
                    </h2>

                    <div className="space-y-4 mb-6">
                      <div>
                        <p className="text-xs font-semibold text-primary mb-1">
                          Challenge
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {study.challenge}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-primary mb-1">
                          Solution
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {study.solution}
                        </p>
                      </div>
                    </div>

                    <div className="mb-6">
                      <p className="text-xs font-semibold text-primary mb-3">
                        Key Results
                      </p>
                      <ul className="space-y-2">
                        {study.results.map((result) => (
                          <li
                            key={result}
                            className="flex items-start gap-2 text-sm text-foreground"
                          >
                            <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                            {result}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-4 border-t border-border/50">
                      {study.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 text-xs rounded-full bg-secondary text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </GlowCard>
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
