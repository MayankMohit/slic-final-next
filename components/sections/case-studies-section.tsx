"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, TrendingUp, Users, DollarSign, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlowCard } from "@/components/ui/glow-card";
import { useCalendly } from "@/hooks/use-calendly";
import AnimatedCounter from "@/components/ui/animated-counter";
import PrimaryButton from "../ui/primaryBtn";

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
          className="text-center mb-[4vh]"
        >
          <span className="tag">
            Results
          </span>
          <h2 className="heading">
            Performance Creative That Delivers Measurable ROAS
          </h2>
          <p className="desc">
            We don't measure success in likes or followers. We measure it in
            CPA, ROAS, and revenue. Here's what our video ads have delivered for
            DTC brands like yours.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-[2vw] mb-[4vh]">
          {caseStudies.map((study, index) => (
            <motion.div
              key={study.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -10, scale: 1.02 }}
              viewport={{ once: true }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 18,
                delay: index * 0.1,
              }}
              className="h-full"
            >
              <GlowCard className="h-full p-6 md:p-[1vw] transition-shadow duration-300 hover:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35)]">
                <div className="flex flex-col h-full gap-3 md:gap-0">
                  <div className="flex items-start justify-between mb-[1vw]">
                    <div className="p-2 md:p-[0.8vw] rounded-xl bg-primary/10">
                      <study.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="text-right">
                      <div className="font-sans text-2xl md:text-[1.5vw] font-bold text-gradient">
                        <AnimatedCounter
                          value={study.metric}
                          scrollTrigger
                          duration={3000}
                          className="font-sans text-2xl md:text-[1.5vw] font-bold text-gradient"
                        />
                      </div>
                      <div className="text-xs md:text-[0.8vw] text-muted-foreground font-semibold">
                        {study.metricLabel}
                      </div>
                    </div>
                  </div>
                  <h3 className="font-sans text-sm md:text-[0.8vw] font-bold mb-[1vw] text-foreground">
                    {study.title}
                  </h3>
                  <p className="text-muted-foreground text-xs md:text-[0.8vw] grow leading-relaxed font-semibold">
                    {study.description}
                  </p>
                  <div className="flex flex-wrap gap-2 md:gap-[0.5vw] mt-[1vw] ">
                    {study.tags.map((tag) => (
                      <span
                        key={tag}
                        className="p-2 md:px-[0.5vw] md:py-[0.2vw] text-xs md:text-[0.7vw] rounded-full bg-[#00000040] text-muted-foreground font-semibold"
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
          <div className="md:max-w-[50vw] mx-auto flex flex-col items-center justify-between gap-5 md:gap-[1vw] text-center md:text-left">
            <p className="text-muted-foreground text-xs md:text-[0.8vw] text-center font-semibold">
              These results come from research-first creative, not guesswork. If
              you're spending $30k+ on Facebook, TikTok, or YouTube ads and want
              creative that actually performs, let's talk.
            </p>

            <div className="flex items-center flex-col md:flex-row gap-3 md:gap-[4vw]">
              <div className="relative group">
                {/* <Button
                  onClick={openCalendly}
                  size="sm"
                  className="bg-gradient-primary hover:opacity-90 text-primary-foreground px-6 py-5 text-base font-semibold"
                >
                  Book a Strategy Call
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button> */}
                <PrimaryButton onClick={openCalendly} />

                {/* Hover Popup */}
                <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-full mt-4 w-max max-w-lg opacity-0 translate-y-2 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-y-0">
                  <div className="relative bg-background border border-border/60 shadow-xl rounded-xl px-4 py-3 text-[0.8vw] text-muted-foreground text-center">
                    30-minute call. No pitch deck. Leave with a creative
                    roadmap.
                    {/* Arrow */}
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-background border-l border-t border-border/60 rotate-45" />
                  </div>
                </div>
              </div>

              <Button
                asChild
                variant="outline"
                size="sm"
              >
                <Link href="/work">
                  <Play className="mr-2 w-5 h-5" />
                  <span>See More Case Studies</span>
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
