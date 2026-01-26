'use client';

import { motion } from "framer-motion";
import { GlowCard } from "@/components/ui/glow-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Search, FileText, Film, BarChart3, ArrowRight } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Market & Competitor Research",
    description: "Trend harvesting, creative gap analysis, and attention-map research to identify what actually works in your niche.",
    step: "01"
  },
  {
    icon: FileText,
    title: "Scriptwriting & Hook Design",
    description: "Short, tested scripts built for the first 3 seconds — tailored hooks, CTAs, and sequencing that improve CTR and CVR.",
    step: "02"
  },
  {
    icon: Film,
    title: "In-House Editing & Optimization",
    description: "Pacing, cuts, captions, visual emphasis, and format variants for platform-specific delivery — all edited by our internal team.",
    step: "03"
  },
  {
    icon: BarChart3,
    title: "Measurement & Rapid Iteration",
    description: "A/B creative tests, performance cohorts, and weekly optimization sprints tied to ROAS and conversion objectives.",
    step: "04"
  }
];

export function ApproachSection() {
  return (
    <section className="section-padding bg-card/30">
      <div className="container-tight">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-balance">
            Our Approach —{" "}
            <span className="text-gradient">Research → Script → Edit → Optimize</span>
          </h2>
          <p className="text-muted-foreground max-w-3xl mx-auto text-lg leading-relaxed">
            We don&apos;t offer UGC. We research the niche, audit competitors, script high-converting ad concepts, and edit everything in-house for performance. Every creative is built with measurable KPIs and a test plan.
          </p>
        </motion.div>

        {/* Process Steps Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {steps.map((step, index) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              <GlowCard className="h-full p-6">
                {/* Step Number */}
                <div className="absolute top-4 right-4 font-display text-4xl font-bold text-primary/10">
                  {step.step}
                </div>
                
                {/* Icon */}
                <div className="p-3 rounded-xl bg-primary/10 w-fit mb-4">
                  <step.icon className="w-6 h-6 text-primary" />
                </div>
                
                {/* Content */}
                <h3 className="font-display text-lg font-semibold mb-2 text-foreground">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>

                {/* Connector line (hidden on last item and mobile) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-[2px] bg-gradient-to-r from-primary/50 to-transparent" />
                )}
              </GlowCard>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center"
        >
          <Button asChild variant="outline" size="lg" className="group border-border/50 bg-transparent hover:bg-secondary">
            <Link href="/work">
              See Our Work
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
