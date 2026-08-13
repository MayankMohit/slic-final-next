"use client";

import { Fragment } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
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
    traditional: "4 to 8 week creative cycles",
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

function CheckBadge() {
  return (
    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/25">
      <Check className="h-3 w-3 text-primary" strokeWidth={3} />
    </span>
  );
}

function CrossBadge() {
  return (
    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/10">
      <X className="h-3 w-3 text-foreground/70" strokeWidth={3} />
    </span>
  );
}

export function ComparisonSection() {
  const { openCalendly } = useCalendly();

  return (
    <section className="section-padding">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <span className="tag">Why Choose Us</span>
        <h2 className="heading">
          Traditional Agency vs{" "}
          <span className="text-gradient font-bold">SLIC</span>
        </h2>
        <p className="desc">
          Most creative agencies prioritize aesthetics over performance. We built
          SLIC to do the opposite.
        </p>
      </motion.div>

      {/* Desktop comparison table */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="hidden md:block w-[72vw] mx-auto"
      >
        <div
          className="relative grid"
          style={{
            gridTemplateColumns: "0.9fr 1.15fr 1fr",
            gridTemplateRows: `auto repeat(${comparisonData.length}, auto) auto`,
          }}
        >
          {/* Zebra striping — sits behind the highlighted column */}
          {comparisonData.map((row, i) =>
            i % 2 === 0 ? (
              <div
                key={`stripe-${row.area}`}
                className="col-start-1 col-end-4 rounded-xl bg-white/8"
                style={{ gridRowStart: i + 2 }}
              />
            ) : null,
          )}

          {/* Highlighted SLIC column, spanning header through CTA */}
          <div
            className="col-start-2 rounded-3xl border border-primary/25 bg-[linear-gradient(180deg,rgba(59,130,246,0.22),rgba(59,130,246,0.04))] shadow-[0_0_60px_rgba(59,130,246,0.15)]"
            style={{ gridRow: "1 / -1" }}
          />

          {/* Header row */}
          <div className="relative z-10 col-start-1 row-start-1" />
          <div className="relative z-10 col-start-2 row-start-1 flex items-center justify-center py-[1.6vw]">
            <Image
              src="/icons/sm_logo.png"
              alt="SLIC"
              width={120}
              height={32}
              className="h-[2.6vh] w-auto"
            />
          </div>
          <div className="relative z-10 col-start-3 row-start-1 flex items-center justify-center py-[1.6vw] text-[0.85vw] font-bold uppercase tracking-wider text-foreground/80">
            Traditional Agency
          </div>

          {/* Feature rows */}
          {comparisonData.map((row, i) => (
            <Fragment key={row.area}>
              <div
                className="relative z-10 col-start-1 flex items-center px-[1vw] py-[1vw] text-[0.8vw] font-bold text-foreground"
                style={{ gridRowStart: i + 2 }}
              >
                {row.area}
              </div>
              <div
                className="relative z-10 col-start-2 flex items-start gap-[0.6vw] px-[1.2vw] py-[1vw] text-[0.8vw] font-semibold text-foreground"
                style={{ gridRowStart: i + 2 }}
              >
                <CheckBadge />
                <span>{row.slic}</span>
              </div>
              <div
                className="relative z-10 col-start-3 flex items-start gap-[0.6vw] px-[1.2vw] py-[1vw] text-[0.8vw] font-semibold text-foreground/75"
                style={{ gridRowStart: i + 2 }}
              >
                <CrossBadge />
                <span>{row.traditional}</span>
              </div>
            </Fragment>
          ))}

          {/* CTA inside the highlighted column */}
          <div
            className="relative z-10 col-start-2 flex justify-center px-[1.2vw] pb-[1.6vw] pt-[0.6vw]"
            style={{ gridRowStart: comparisonData.length + 2 }}
          >
            <div className="relative group">
              <PrimaryButton onClick={openCalendly} />

              {/* Hover Popup */}
              <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-full mt-4 w-max max-w-lg opacity-0 translate-y-2 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-y-0">
                <div className="relative bg-background border border-border/60 shadow-xl rounded-xl px-4 py-3 text-[0.8vw] text-muted-foreground text-center">
                  30-minute call. No pitch deck. Leave with a creative roadmap.
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-background border-l border-t border-border/60 rotate-45" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Mobile stacked cards */}
      <div className="md:hidden space-y-4 max-w-[90vw] mx-auto">
        {comparisonData.map((row, index) => (
          <motion.div
            key={row.area}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.08 }}
          >
            <div className="overflow-hidden rounded-2xl border border-border/60 bg-card/40">
              <div className="border-b border-border/60 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-foreground">
                {row.area}
              </div>

              <div className="flex items-start gap-3 border-l-2 border-primary bg-primary/10 px-4 py-3">
                <CheckBadge />
                <div>
                  <div className="mb-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                    SLIC
                  </div>
                  <p className="text-xs font-semibold text-foreground">
                    {row.slic}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 px-4 py-3">
                <CrossBadge />
                <div>
                  <div className="mb-0.5 text-[10px] font-bold uppercase tracking-wider text-foreground/80">
                    Traditional Agency
                  </div>
                  <p className="text-xs font-semibold text-foreground/75">
                    {row.traditional}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Closing line — CTA button only on mobile, desktop has it in the panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="mt-8"
      >
        <div className="md:max-w-[50vw] max-w-[90vw] mx-auto flex flex-col items-center gap-6">
          <p className="text-center text-xs md:text-[0.8vw] font-semibold text-muted-foreground">
            If you're tired of agencies that deliver pretty ads that don't
            perform, let's talk.
          </p>

          <div className="md:hidden">
            <PrimaryButton onClick={openCalendly} />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
