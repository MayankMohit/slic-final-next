'use client';

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlowCard } from "@/components/ui/glow-card";

const team = [
  {
    name: "Vedant",
    role: "Founder & Creative Director",
    description:
      "Leads SLIC’s creative vision, blending storytelling with performance-driven strategy.",
    initial: "V", // kept but not used in this layout
  },
  {
    name: "Siddhartha",
    role: "Operations & Logistics",
    description:
      "Ensures every project runs flawlessly—from concept to final delivery.",
    initial: "S",
  },
];

export function AboutSection() {
  return (
    <section className="relative section-padding overflow-hidden">
      <div className="container-tight relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Story */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <span className="inline-flex items-center gap-2 text-primary text-xs uppercase tracking-[0.2em] mb-6">
              <span className="w-6 h-px bg-primary/50" />
              Our Story
            </span>

            <h2 className="text-4xl md:text-5xl font-display font-bold mb-8 leading-tight">
              From Passion to{" "}
              <span className="text-gradient">Performance</span>
            </h2>

            <div className="space-y-5 text-muted-foreground text-lg leading-relaxed">
              <p>
                What began as a passion for storytelling and editing evolved into
                a performance-first content agency trusted by global brands.
              </p>
              <p>
                We don’t chase trends—we engineer content systems that compound
                growth and attention.
              </p>
              <p className="text-foreground font-medium">
                <span className="text-primary">$50M+</span> in revenue generated
                and <span className="text-primary">150K+</span> organic followers
                grown in under 90 days.
              </p>
            </div>

            <Button
              variant="outline"
              className="mt-10 group"
              asChild
            >
              <Link href="/about">
                Learn More
                <ArrowRight
                  className="ml-2 transition-transform duration-300 group-hover:translate-x-1"
                  size={18}
                />
              </Link>
            </Button>
          </motion.div>

          {/* Team */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
            className="space-y-8"
          >
            <h3 className="text-sm uppercase tracking-widest text-muted-foreground mb-2">
              Core Team
            </h3>

            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.12 }}
                className="group"
              >
                <GlowCard className="overflow-hidden h-full">
                  <div className="p-6 border-b border-slate-600">
                    <div className="text-2xl md:text-3xl font-display font-bold text-gradient mt-1">
                      {member.name}
                    </div>
                    <div className="text-muted-foreground text-sm uppercase tracking-wider">
                      {member.role}
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-muted-foreground leading-relaxed">
                      {member.description}
                    </p>
                  </div>
                </GlowCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}