"use client";

import { motion } from "framer-motion";
import { GlowCard } from "@/components/ui/glow-card";
import { ArrowRight, Check, X } from "lucide-react";
import { Button } from "../ui/button";
import { useCalendly } from "@/hooks/use-calendly";
import PrimaryButton from "../ui/primaryBtn";

const comparisonData = [
  {
    area: "Focus",
    traditional: "Brand-first deliverables",
    slic: "Performance-first video ads built to convert",
  },
  {
    area: "Speed",
    traditional: "4–8 week creative cycles",
    slic: "Test-ready variants in 48 to 72 hours",
  },
  {
    area: "Pricing",
    traditional: "Fixed retainers and long lead times",
    slic: "Flexible packages built for scaling DTC brands",
  },
  {
    area: "Measurement",
    traditional: "Results reviewed after delivery",
    slic: "A/B testing, ROAS tracking, weekly iteration",
  },
  {
    area: "Creative Approach",
    traditional: "Aesthetics prioritized over results",
    slic: "Every ad designed to improve CTR, CVR, and ROAS",
  },
  {
    area: "Accountability",
    traditional: "Hand-off model, minimal optimization",
    slic: "Shared KPIs, active optimization, paid media alignment",
  },
];

export function ComparisonSection() {
  const { openCalendly } = useCalendly();
  return (
    <section className="section-padding">
      <div className="">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-6"
        >
          <span className="inline-block text-[0.8vw] font-semibold text-primary mb-[1vh] uppercase tracking-wider">
            Why Choose Us
          </span>
          <h2 className="font-sans text-3xl md:text-4xl lg:text-[3vw] font-semibold mb-[2vh] text-balance">
            Traditional Agency vs <span className="text-gradient font-bold">SLIC</span>
          </h2>
          <p className="text-[0.8vw] text-muted-foreground leading-relaxed max-w-[50vw] mx-auto font-semibold">
            Most creative agencies prioritize aesthetics over performance. We
            built SLIC to do the opposite.
          </p>
        </motion.div>

        {/* Desktop Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="hidden md:block w-[70vw] mx-auto"
        >
          <GlowCard className="overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-3 bg-secondary/50 text-[0.8vw] font-bold">
              <div className="p-[1vw] text-foreground">Area</div>
              <div className="p-[1vw] text-foreground border-x border-muted-foreground/30 font-semibold">
                Traditional
              </div>
              <div className="p-[1vw] text-primary">SLIC Media</div>
            </div>

            {/* Table Rows */}
            {comparisonData.map((row, index) => (
              <div
                key={row.area}
                className={`grid grid-cols-3 text-[0.8vw] ${index !== comparisonData.length - 1 ? "border-b border-muted-foreground/30" : ""}`}
              >
                <div className="p-[0.6vw] font-bold text-foreground">
                  {row.area}
                </div>
                <div className="p-[0.6vw] text-muted-foreground border-x border-muted-foreground/30 flex items-start gap-2 font-semibold">
                  <X className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                  <span>{row.traditional}</span>
                </div>
                <div className="p-[0.6vw] text-foreground flex items-start gap-2 font-semibold">
                  <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <span>{row.slic}</span>
                </div>
              </div>
            ))}
          </GlowCard>
        </motion.div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {comparisonData.map((row, index) => (
            <motion.div
              key={row.area}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <GlowCard className="p-4">
                <h3 className="font-sans font-semibold text-foreground mb-3">
                  {row.area}
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-2 text-sm">
                    <X className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">
                      {row.traditional}
                    </span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                    <span className="text-foreground">{row.slic}</span>
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
        <div className="max-w-[50vw] mx-auto flex flex-col items-center justify-between gap-6 text-center md:text-left">
          <p className="text-muted-foreground text-sm md:text-[1v6] text-center font-semibold">
            If you're tired of agencies that deliver pretty ads that don't
            perform, let's talk.
          </p>

          <div className="flex items-center gap-10">
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
                  30-minute call. No pitch deck. Leave with a creative roadmap.
                  {/* Arrow */}
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-background border-l border-t border-border/60 rotate-45" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
