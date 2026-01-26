'use client';

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, TrendingUp, Users, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlowCard } from "@/components/ui/glow-card";

const caseStudies = [
  {
    icon: Users,
    metric: "0 → 150K",
    metricLabel: "Instagram Followers",
    title: "Lifestyle Brand Growth",
    description: "Grew an emerging lifestyle brand's Instagram from zero to 150K followers in just 90 days using our viral content strategy and trend-jacking techniques.",
    tags: ["Instagram", "Organic Growth", "Content Strategy"],
  },
  {
    icon: TrendingUp,
    metric: "3x",
    metricLabel: "Conversion Uplift",
    title: "DTC E-commerce Transformation",
    description: "Achieved 3x conversion rate improvement for a DTC beauty brand through scroll-stopping ad creatives optimized for Meta and TikTok.",
    tags: ["Meta Ads", "TikTok", "Conversion"],
  },
  {
    icon: DollarSign,
    metric: "7-Figure",
    metricLabel: "Revenue Scaled",
    title: "From Startup to Scale",
    description: "Scaled a bootstrapped brand to 7-figure annual revenue using our comprehensive viral ad strategy across multiple platforms.",
    tags: ["Full Funnel", "Viral Ads", "Revenue"],
  },
];

export function CaseStudiesSection() {
  return (
    <section className="section-padding">
      <div className="container-tight">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-sm font-medium text-primary mb-4 uppercase tracking-wider">
            Results
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-balance">
            Real Results for Real Brands
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Numbers don&apos;t lie. Here&apos;s how we&apos;ve helped brands just like yours achieve explosive growth.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {caseStudies.map((study, index) => (
            <motion.div
              key={study.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <GlowCard className="h-full p-6">
                <div className="flex flex-col h-full">
                  <div className="flex items-start justify-between mb-6">
                    <div className="p-3 rounded-xl bg-primary/10">
                      <study.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="text-right">
                      <div className="font-display text-2xl md:text-3xl font-bold text-gradient">
                        {study.metric}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {study.metricLabel}
                      </div>
                    </div>
                  </div>
                  <h3 className="font-display text-xl font-semibold mb-3 text-foreground">{study.title}</h3>
                  <p className="text-muted-foreground text-sm flex-grow leading-relaxed">{study.description}</p>
                  <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border/50">
                    {study.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 text-xs rounded-full bg-secondary text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </GlowCard>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Button asChild variant="outline" size="lg" className="group border-border/50 bg-transparent hover:bg-secondary">
            <Link href="/case-studies">
              See More Case Studies
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
