"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCalendly } from "@/hooks/use-calendly";
import PrimaryButton from "../ui/primaryBtn";

export function CTASection() {
  const { openCalendly } = useCalendly();

  return (
    <section className="section-padding relative overflow-hidden">
      {/* Content */}
      <div className="container-tight relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto"
        >
          {/* Sub badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs md:text-[0.8vw] font-semibold text-primary">
              Ready to Scale?
            </span>
          </div>

          {/* Heading */}
          <h2 className="heading">
            Let&apos;s Build Video Ads That{" "}
            <span className="text-gradient">Actually Converts</span>
          </h2>

          {/* Copy */}
          <p className="desc mb-5">
            Book a strategy call and get a clear breakdown of what's holding
            your creative back and how we'd fix it.
          </p>

          {/* CTA */}
          <div className="relative inline-block">
            <PrimaryButton onClick={openCalendly} />
          </div>

          {/* Trust line */}
          <p className="mt-4 text-xs md:text-[0.8vw] text-muted-foreground font-semibold">
            No pitch. No pressure. Just real insights.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
