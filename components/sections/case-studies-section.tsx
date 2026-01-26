"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, TrendingUp, Users, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlowCard } from "@/components/ui/glow-card";
import { useCalendly } from "@/hooks/use-calendly";

const caseStudies = [
  {
    icon: Users,
    metric: "3.5x ROAS",
    metricLabel: "Return on Ad Spend",
    title: "US Nutrition Brand Relaunch",
    description:
      "Delivered 3.5x ROAS for NeuroBrocc during their US market relaunch. Research-backed video ad creative drove profitable customer acquisition from day one across paid channels.",
    tags: ["Facebook Ads", "TikTok Ads", "DTC Nutrition"],
  },
  {
    icon: TrendingUp,
    metric: "3x",
    metricLabel: "Scaled Results",
    title: "TikTok and Applovin Scale",
    description:
      "Scaled Loop Labs across TikTok and Applovin with 3x performance improvement. Organic and paid video content working together to drive consistent acquisition at scale.",
    tags: ["TikTok Ads", "Applovin", "Paid + Organic"],
  },
  {
    icon: DollarSign,
    metric: "47%",
    metricLabel: "Average Hold Rate",
    title: "Creative That Holds Attention",
    description:
      "Our video ads average 47% hold rate and $30 to $40 CPA across DTC brands. When creative holds attention, algorithms reward you with lower costs and better placement.",
    tags: ["Video Ads", "CPA Optimization", "Performance Creative"],
  },
];

export function CaseStudiesSection() {
  const { openCalendly } = useCalendly();
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
            Performance Creative That Delivers Measurable ROAS
          </h2>
          <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
            We don't measure success in likes or followers. We measure it in
            CPA, ROAS, and revenue. Here's what our video ads have delivered for
            DTC brands like yours.
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
                  <h3 className="font-display text-xl font-semibold mb-3 text-foreground">
                    {study.title}
                  </h3>
                  <p className="text-muted-foreground text-sm grow leading-relaxed">
                    {study.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-4 pt-4 ">
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
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-6"
        >
          <div className="max-w-4xl mx-auto flex flex-col items-center justify-between gap-6 text-center md:text-left">
            <p className="text-muted-foreground text-sm md:text-base text-center">
              These results come from research-first creative, not guesswork. If
              you're spending $30k+ on Facebook, TikTok, or YouTube ads and want
              creative that actually performs, let's talk.
            </p>

            <div className="flex items-center gap-10">
              <div className="relative group">
                <Button
                  onClick={openCalendly}
                  size="sm"
                  className="bg-gradient-primary hover:opacity-90 text-primary-foreground px-6 py-5 text-base font-semibold"
                >
                  Book a Strategy Call
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>

                {/* Hover Popup */}
                <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-full mt-4 w-max max-w-md opacity-0 translate-y-2 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-y-0">
                  <div className="relative bg-background border border-border/60 shadow-xl rounded-xl px-4 py-3 text-sm text-muted-foreground text-center">
                    30-minute call. No pitch deck. Leave with a creative
                    roadmap.
                    {/* Arrow */}
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-background border-l border-t border-border/60 rotate-45" />
                  </div>
                </div>
              </div>

              <Link
                href="/case-studies"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors inline-flex items-center"
              >
                See More Case Studies
                <ArrowRight className="ml-1 w-4 h-4" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
