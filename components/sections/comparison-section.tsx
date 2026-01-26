'use client';

import { motion } from "framer-motion";
import { GlowCard } from "@/components/ui/glow-card";
import { Check, X } from "lucide-react";

const comparisonData = [
  {
    area: "Focus",
    traditional: "Brand-first deliverables",
    slic: "Performance-first, conversion-driven creative"
  },
  {
    area: "Speed",
    traditional: "4–8 week creative cycles",
    slic: "Test-ready variants in 48–72 hours"
  },
  {
    area: "Pricing",
    traditional: "Fixed retainers and long lead times",
    slic: "Outcome-focused packages built for scaling"
  },
  {
    area: "Measurement",
    traditional: "Results checked post-delivery",
    slic: "Built-in A/B tests, ROAS tracking, weekly iteration"
  },
  {
    area: "Creativity → Conversion",
    traditional: "Aesthetics often prioritized",
    slic: "Creative designed to improve CTR/CVR/ROAS"
  },
  {
    area: "Accountability",
    traditional: "Hand-off model",
    slic: "Shared KPIs, active optimization, paid-media coordination"
  }
];

export function ComparisonSection() {
  return (
    <section className="section-padding">
      <div className="container-tight">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-sm font-medium text-primary mb-4 uppercase tracking-wider">
            Why Choose Us
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-balance">
            Traditional Agency vs{" "}
            <span className="text-gradient">SLIC Media</span>
          </h2>
        </motion.div>

        {/* Desktop Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="hidden md:block"
        >
          <GlowCard className="overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-3 bg-secondary/50 text-sm font-medium">
              <div className="p-4 text-muted-foreground">Area</div>
              <div className="p-4 text-muted-foreground border-x border-border/30">
                Traditional
              </div>
              <div className="p-4 text-primary">
                SLIC Media
              </div>
            </div>
            
            {/* Table Rows */}
            {comparisonData.map((row, index) => (
              <div key={row.area} className={`grid grid-cols-3 text-sm ${index !== comparisonData.length - 1 ? 'border-b border-border/30' : ''}`}>
                <div className="p-4 font-medium text-foreground">{row.area}</div>
                <div className="p-4 text-muted-foreground border-x border-border/30 flex items-start gap-2">
                  <X className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                  <span>{row.traditional}</span>
                </div>
                <div className="p-4 text-foreground flex items-start gap-2">
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
                <h3 className="font-display font-semibold text-foreground mb-3">{row.area}</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-2 text-sm">
                    <X className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{row.traditional}</span>
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
    </section>
  );
}
