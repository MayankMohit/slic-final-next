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
          {/* Heading */}
          <h2 className="heading">
            Let&apos;s Build Video Ads That{" "}
            <span className="text-gradient">Actually Convert</span>
          </h2>

          {/* CTA */}
          <div className="relative inline-block mt-[3vh]">
            <PrimaryButton onClick={openCalendly} />
          </div>

          {/* Trust line */}
          <p className="mt-4 text-xs md:text-[0.8vw] text-foreground/80 font-normal">
            No pitch. No pressure. Just real insights.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
