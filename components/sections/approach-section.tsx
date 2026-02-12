"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GlowCard } from "@/components/ui/glow-card";
import {
  Search,
  FileText,
  Film,
  BarChart3,
  ArrowRight,
  Play,
} from "lucide-react";
import { useCalendly } from "@/hooks/use-calendly";
import PrimaryButton from "../ui/primaryBtn";
import { useIsMobile } from "@/hooks/use-isMobile";

const steps = [
  {
    icon: Search,
    title: "Deep Creative Research",
    description:
      "We audit your competitors' ads, mine customer reviews, and analyze winning creative in your category. You get a strategy brief showing exactly which hooks, angles, and formats are working and where the gaps are.",
    step: "01",
  },
  {
    icon: FileText,
    title: "Performance Scripting",
    description:
      "Every ad starts with a script built on research, not templates. We write hooks engineered for the first 3 seconds, narratives that hold attention, and CTAs that drive action. This is why our ads outperform generic creative.",
    step: "02",
  },
  {
    icon: Film,
    title: "Platform-Native Editing",
    description:
      "We edit specifically for Meta, TikTok, and YouTube. No one-size-fits-all. Pacing, captions, text overlays, and format variations optimized for each platform's algorithm. All production stays in-house for speed and quality control.",
    step: "03",
  },
  {
    icon: BarChart3,
    title: "Testing & Iteration",
    description:
      "You don't just get ads. You get a testing framework. We structure creative for A/B testing, track what's winning, and iterate fast. The goal: find your top performers and scale them before creative fatigue hits.",
    step: "04",
  },
];

export function ApproachSection() {
  const { openCalendly } = useCalendly();
  const isMobile = useIsMobile();
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center md:max-w-[70vw] mx-auto mb-[4vh]"
        >
          <span className="tag">
            How We Work
          </span>
          <h2 className="heading">
            Research first. Production second. <br />
            Results always.
          </h2>

          <p className="desc">
            We don't offer UGC. We don't guess what might work. We research your
            market, script high-converting video ad concepts, and edit
            everything in-house for Facebook, Instagram, TikTok, and YouTube.
            Every creative ships with a testing plan and clear ROAS targets.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="md:max-w-[70vw] mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 md:gap-[2vw] gap-5 justify-items-center mb-[3vh]">
            {steps.map((step, index) => (
              <motion.div
              key={step.step}
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
              className="h-full md:max-w-[20vw]"
            >
                <GlowCard className="h-full md:py-[2vh] md:px-[2vw] p-8 relative group transition-shadow duration-100 hover:shadow-xl hover:shadow-primary/10">
                  <span className="absolute md:top-4 md:right-4 top-9 right-9 text-5xl md:text-[2.5vw] font-bold text-primary/50 group-hover:text-primary/20 transition-colors">
                    {step.step}
                  </span>

                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <step.icon className="md:w-[1.5vw] md:h-[1.5vw] text-primary" />
                  </div>

                  <h3 className="text-sm md:text-[0.8vw] font-bold mb-3 pr-8">
                    {step.title}
                  </h3>

                  <p className="text-muted-foreground text-sm md:text-[0.8vw] leading-relaxed font-semibold">
                    {step.description}
                  </p>

                  {index < steps.length - 1 && !isMobile && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 w-[2vw] h-0.5 bg-linear-to-r from-primary/50 to-transparent" />
                  )}
                </GlowCard>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Compact Minimal CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className=""
        >
          <div className="max-w-[70vw] mx-auto flex flex-col items-center justify-between gap-6 text-center md:text-left">
            <p className="text-muted-foreground text-xs md:text-[0.8vw] font-semibold">
              This process has driven{" "}
              <span className=" text-foreground">
                32% average CPA reduction
              </span>{" "}
              for our clients.
            </p>

            <div className="flex items-center flex-col md:flex-row gap-4 md:gap-[4vw]">
              <div className="relative group">
                {/* <Button
                  onClick={openCalendly}
                  size="sm"
                  className="bg-gradient-primary hover:opacity-90 text-primary-foreground"
                >
                  Book a Strategy Call
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button> */}
                <PrimaryButton onClick={openCalendly} />

                {/* Hover Popup */}
                <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-full mt-4 w-max max-w-lg opacity-0 translate-y-2 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-y-0">
                  <div className="relative bg-background border border-border/60 shadow-xl rounded-xl px-[2vw] py-[1.5vh] text-[0.8vw] text-muted-foreground text-center">
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
                  <span>See Our Work</span>
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
