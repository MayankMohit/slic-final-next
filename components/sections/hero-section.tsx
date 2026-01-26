"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCalendly } from "@/hooks/use-calendly";

export function HeroSection() {
  const { openCalendly } = useCalendly();

  return (
    <section className="relative min-h-screen flex items-center justify-center">
      {/* Content */}
      <div className="container-tight py-10 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-medium text-primary">
              {" "}
              Performance Creative Agency for DTC Brands
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 text-balance"
          >
            Ad Creative That{" "}
            <span className="text-gradient">Actually Converts</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed text-pretty"
          >
            We research, script, and produce performance-driven video ads for
            Meta, TikTok, and YouTube. Built for DTC brands spending $30k+/month
            who are done guessing what creative will work.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            {/* Primary CTA with Hover Popup */}
            <div className="relative group">
              <Button
                onClick={openCalendly}
                size="lg"
                className="bg-gradient-primary hover:opacity-90 text-primary-foreground px-8 py-6 text-base font-semibold"
              >
                Book a Strategy Call
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>

              {/* Hover Popup */}
              <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-full mt-4 w-max max-w-md opacity-0 translate-y-2 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-y-0">
                <div className="relative bg-background border border-border/60 shadow-xl rounded-xl px-4 py-3 text-sm text-muted-foreground text-center">
                  30-minute call. No pitch deck. Leave with a creative roadmap.
                  {/* Arrow */}
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-background border-l border-t border-border/60 rotate-45" />
                </div>
              </div>
            </div>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="px-8 py-6 text-base font-semibold border-border/50 bg-transparent hover:bg-secondary"
            >
              <Link href="/work">
                <Play className="mr-2 w-5 h-5" />
                See Our Work
              </Link>
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-10 pt-10 border-t border-border/50"
          >
            {[
              { value: "$50M+", label: "Client Revenue Generated" },
              { value: "1000+", label: "Performance Ads Delivered" },
              { value: "32%", label: "Avg. CPA Reduction" },
              { value: "3.2x", label: "Avg. ROAS Lift" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="font-display text-2xl md:text-3xl font-bold text-gradient mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute bottom-20 left-1/2 -translate-x-1/2"
      >
        <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex justify-center pt-2">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-1.5 h-1.5 rounded-full bg-primary"
          />
        </div>
      </motion.div>
    </section>
  );
}
