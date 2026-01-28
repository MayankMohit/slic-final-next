"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCalendly } from "@/hooks/use-calendly";

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
            <span className="text-[0.8vw] font-medium text-primary">
              Ready to Scale?
            </span>
          </div>

          {/* Heading */}
          <h2 className="font-display text-3xl md:text-4xl lg:text-[3vw] font-bold mb-6 text-balance">
            Let&apos;s Build Video Ads That{" "}
            <span className="text-gradient">Actually Converts</span>
          </h2>

          {/* Copy */}
          <p className="text-[0.8vw] text-muted-foreground mb-10 max-w-[50vw] mx-auto leading-relaxed">
            Book a strategy call and get a clear breakdown of what's holding
            your creative back and how we'd fix it.
          </p>

          {/* CTA */}
          <div className="relative inline-block">
            <Button
              onClick={openCalendly}
              size="sm"
              className="bg-gradient-primary hover:opacity-90 text-primary-foreground px-10 py-6"
            >
              Book a Strategy Call
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>

            {/* Subtle glow hover */}
            <div className="absolute inset-0 bg-primary/20 blur-xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          {/* Trust line */}
          <p className="mt-8 text-[0.8vw] text-muted-foreground">
            No pitch. No pressure. Just real insights.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
