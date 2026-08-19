"use client";

import { motion } from "framer-motion";
import { GlowCard } from "@/components/ui/glow-card";
import { Search, FileText, Film, BarChart3, Play } from "lucide-react";
import { useCalendly } from "@/hooks/use-calendly";
import PrimaryButton from "../ui/primaryBtn";
import SecondaryButton from "../ui/secondaryBtn";
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
    <section className="section-padding relative overflow-hidden">
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
          {/* Items stretch to fill their tracks. Centring them under a width cap
              instead made each card shrink-to-fit, which left visible slack at
              the md breakpoint where the tracks are far wider than the cap.
              Stretching means the card width is always exactly
              (wrapper - gaps) / columns, in vw, at every breakpoint.
              (Class names are deliberately not spelled out here — Tailwind
              scans comment text and would emit a rule for them.) */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 md:gap-[2vw] gap-5 mb-[3vh]">
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
                
              }}
              className="h-full w-full"
            >
                {/* Every dimension at md+ is in vw, including the ones that used
                    to be rem (the icon box, its margin, the title margin and
                    padding, the step-number offsets). Browser zoom scales rem
                    but leaves vw physically fixed, so a mix of the two made the
                    card grow vertically on zoom while its width held still. The
                    vw values below are the previous rem sizes converted at a
                    1900px viewport, so the card looks unchanged at 100% zoom and
                    now holds that size at every zoom level.

                    Padding is p-6 md:p-[1vw] to match the Results cards. The
                    2vw side padding this used to carry ate a quarter of a 16vw
                    card, so the text wrapped into a 12vw column against
                    Results' 15.67vw and the cards ran noticeably taller. */}
                <GlowCard className="h-full p-6 md:p-[1vw] relative group transition-shadow duration-300 hover:shadow-xl hover:shadow-primary/10">
                  <span className="absolute md:top-[0.85vw] md:right-[0.85vw] top-6 right-6 text-5xl md:text-[2.5vw] font-bold text-primary/50 group-hover:text-primary/20 transition-colors">
                    {step.step}
                  </span>

                  {/* Same inner column as the Results cards: the grid stretches
                      every item to the tallest in the row, and this is what lets
                      the card fill that height so the description grows into the
                      slack instead of leaving it below the text. */}
                  <div className="flex flex-col h-full gap-3 md:gap-0">
                    <div className="w-12 h-12 md:w-[2.5vw] md:h-[2.5vw] rounded-xl bg-primary/10 flex items-center justify-center mb-4 md:mb-[0.85vw] group-hover:bg-primary/20 transition-colors">
                      <step.icon className="md:w-[1.5vw] md:h-[1.5vw] text-primary" />
                    </div>

                    <h3 className="text-sm md:text-[0.8vw] font-bold mb-3 md:mb-[0.6vw] pr-8 md:pr-[1.7vw]">
                      {step.title}
                    </h3>

                    <p className="text-foreground/80 text-xs md:text-[0.8vw] grow leading-relaxed font-normal">
                      {step.description}
                    </p>
                  </div>

                  {index < steps.length - 1 && !isMobile && (
                    <div className="hidden lg:block absolute top-1/2 -right-[0.85vw] w-[2vw] h-0.5 bg-linear-to-r from-primary/50 to-transparent" />
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
            <p className="text-foreground/80 text-xs md:text-[0.8vw] font-normal">
              This process has driven{" "}
              <span className=" text-foreground">
                32% average CPA reduction
              </span>{" "}
              for our clients.
            </p>

            <div className="flex items-center flex-col md:flex-row gap-4 md:gap-[1.5vw]">
              <div className="relative group">
                <PrimaryButton onClick={openCalendly} />

                {/* Hover Popup */}
                <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-full mt-4 w-max max-w-lg opacity-0 translate-y-2 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-y-0">
                  <div className="relative bg-background border border-border/60 shadow-xl rounded-xl px-[2vw] py-[1.5vh] text-[0.8vw] text-foreground/80 text-center">
                    30-minute call. No pitch deck. Leave with a creative
                    roadmap.
                    {/* Arrow */}
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-background border-l border-t border-border/60 rotate-45" />
                  </div>
                </div>
              </div>

              <SecondaryButton href="/work">
                <Play className="w-[1.25em] h-[1.25em]" />
                <span>See Our Work</span>
              </SecondaryButton>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
