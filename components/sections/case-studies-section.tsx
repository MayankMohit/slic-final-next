"use client";

import { motion } from "framer-motion";
import { TrendingUp, Users, DollarSign, Play } from "lucide-react";
import { GlowCard } from "@/components/ui/glow-card";
import AnimatedCounter from "@/components/ui/animated-counter";
import PrimaryButton from "../ui/primaryBtn";
import SecondaryButton from "../ui/secondaryBtn";

const caseStudies = [
  {
    icon: Users,
    metric: "3.5x ROAS",
    // Ratios count up from a floor, never from zero. See animated-counter.tsx.
    metricFrom: 2,
    metricLabel: "Return on Ad Spend",
    title: "US Nutrition Brand Relaunch",
    description:
      "Delivered 3.5x ROAS for NeuroBrocc during their US market relaunch. Research-backed video ad creative drove profitable customer acquisition from day one across paid channels.",
    tags: ["Meta Ads", "TikTok Ads", "DTC Nutrition"],
  },
  {
    icon: TrendingUp,
    metric: "3x",
    metricFrom: 1.8,
    metricLabel: "Scaled Results",
    title: "TikTok and Applovin Scale",
    description:
      "Scaled Loop Labs across TikTok and Applovin with 3x performance improvement. Organic and paid video content working together to drive consistent acquisition at scale.",
    tags: ["TikTok Ads", "Applovin", "Paid + Organic"],
  },
  {
    icon: DollarSign,
    metric: "47%",
    metricFrom: 30,
    metricLabel: "Average Hold Rate",
    title: "Creative That Holds Attention",
    description:
      "Our video ads average 47% hold rate and $30 to $40 CPA across DTC brands. When creative holds attention, algorithms reward you with lower costs and better placement.",
    tags: ["Video Ads", "CPA Optimization", "Performance Creative"],
  },
];

export function CaseStudiesSection() {
  return (
    <section className="section-padding">
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center md:max-w-[57vw] mx-auto mb-[4vh]"
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

        {/* Same wrapper / grid / item structure as the How We Work steps, so the
            two sections scale identically. The wrapper must be sized in vw, not
            px: the card interiors are sized in vw, and a px-capped container
            would let them keep growing after the card itself stopped.

            57vw is narrower than How We Work's 70vw by design — it reproduces
            the card width this section had under the old max-w-6xl container
            (~337px at 1900px), but now scales with the viewport instead of
            freezing. */}
        <div className="md:max-w-[57vw] mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 md:gap-[2vw] gap-5 mb-[4vh]">
            {caseStudies.map((study) => (
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
                }}
                className="h-full w-full"
              >
                <GlowCard className="h-full p-6 md:p-[1vw] transition-shadow duration-300 hover:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35)]">
                  <div className="flex flex-col h-full gap-3 md:gap-0">
                    <div className="flex items-start justify-between mb-[1vw]">
                      <div className="p-2 md:p-[0.8vw] rounded-xl bg-primary/10">
                        <study.icon className="w-6 h-6 md:w-[1.25vw] md:h-[1.25vw] text-primary" />
                      </div>
                      <div className="text-right">
                        <div className="font-sans text-2xl md:text-[1.5vw] font-bold text-gradient">
                          <AnimatedCounter
                            value={study.metric}
                            from={study.metricFrom}
                            scrollTrigger
                            duration={3000}
                            className="font-sans text-2xl md:text-[1.5vw] font-bold text-gradient"
                          />
                        </div>
                        <div className="text-xs md:text-[0.8vw] text-foreground/80 font-normal">
                          {study.metricLabel}
                        </div>
                      </div>
                    </div>
                    <h3 className="font-sans text-sm md:text-[0.8vw] font-bold mb-[1vw] text-foreground">
                      {study.title}
                    </h3>
                    <p className="text-foreground/80 text-xs md:text-[0.8vw] grow leading-relaxed font-normal">
                      {study.description}
                    </p>
                    <div className="flex flex-wrap gap-2 md:gap-[0.5vw] mt-[1vw] ">
                      {study.tags.map((tag) => (
                        <span
                          key={tag}
                          className="p-2 md:px-[0.5vw] md:py-[0.2vw] text-xs md:text-[0.7vw] rounded-full bg-[#00000040] text-foreground/80 font-normal"
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
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-6"
        >
          <div className="md:max-w-[50vw] mx-auto flex flex-col items-center justify-between gap-5 md:gap-[1vw] text-center md:text-left">
            <p className="text-foreground/80 text-xs md:text-[0.8vw] text-center font-normal">
              These results come from research-first creative, not guesswork. If
              you're spending $30k+ on Meta, TikTok, or YouTube ads and want
              creative that actually performs, let's talk.
            </p>

            <div className="flex items-center flex-col md:flex-row gap-3 md:gap-[1.5vw]">
              <div className="relative group">
                <PrimaryButton href="/book" />

                {/* Hover Popup */}
                <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-full mt-4 w-max max-w-lg opacity-0 translate-y-2 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-y-0">
                  <div className="relative bg-background border border-border/60 shadow-xl rounded-xl px-4 py-3 text-[0.8vw] text-foreground/80 text-center">
                    30-minute call. No pitch deck. Leave with a creative
                    roadmap.
                    {/* Arrow */}
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-background border-l border-t border-border/60 rotate-45" />
                  </div>
                </div>
              </div>

              <SecondaryButton href="/case-studies">
                <Play className="w-[1.25em] h-[1.25em]" />
                <span>See More Case Studies</span>
              </SecondaryButton>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
