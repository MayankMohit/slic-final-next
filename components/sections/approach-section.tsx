'use client';

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GlowCard } from "@/components/ui/glow-card";
import { Search, FileText, Film, BarChart3, ArrowRight } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Market & Competitor Research",
    description:
      "Trend harvesting, creative gap analysis, and attention-map research to identify what actually works in your niche.",
    step: "01",
  },
  {
    icon: FileText,
    title: "Scriptwriting & Hook Design",
    description:
      "Short, tested scripts built for the first 3 seconds — tailored hooks, CTAs, and sequencing that improve CTR and CVR.",
    step: "02",
  },
  {
    icon: Film,
    title: "In-House Editing & Optimization",
    description:
      "Pacing, cuts, captions, visual emphasis, and format variants for platform-specific delivery — all edited by our internal team.",
    step: "03",
  },
  {
    icon: BarChart3,
    title: "Measurement & Rapid Iteration",
    description:
      "A/B creative tests, performance cohorts, and weekly optimization sprints tied to ROAS and conversion objectives.",
    step: "04",
  },
];

export function ApproachSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Our Approach —{" "}
            <span className="text-primary">
              Research → Script → Edit → Optimize
            </span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            We don't offer UGC. We research the niche, audit competitors, script
            high-converting ad concepts, and edit everything in-house for
            performance. Every creative is built with measurable KPIs and a test
            plan.
          </p>
        </motion.div>

        {/* Centered Grid Wrapper */}
        <div className="max-w-6xl mx-auto">

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 justify-items-center mb-12">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -15 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="w-full max-w-70"
              >
                <GlowCard className="h-full py-6 px-4 relative group transition-shadow duration-100 hover:shadow-xl hover:shadow-primary/10">

                  {/* Step Number */}
                  <span className="absolute top-4 right-4 text-5xl font-bold text-primary/10 group-hover:text-primary/20 transition-colors">
                    {step.step}
                  </span>

                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <step.icon className="w-6 h-6 text-primary" />
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-semibold mb-3 pr-8">
                    {step.title}
                  </h3>

                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {step.description}
                  </p>

                  {/* Connector Line */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-px bg-linear-to-r from-primary/50 to-transparent" />
                  )}
                </GlowCard>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Button variant="outline" size="lg" asChild className="group border-border/50 bg-transparent hover:bg-secondary">
            <Link href="/work" className="group inline-flex items-center">
              See Our Work
              <ArrowRight
                className="ml-2 transition-transform duration-300 "
                size={18}
              />
            </Link>
          </Button>
        </motion.div>

      </div>
    </section>
  );
}
