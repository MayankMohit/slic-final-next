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
      "Leads SLIC's creative vision, blending storytelling with performance-driven strategy.",
    initial: "V",
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
    <section className="section-padding bg-card/30">
      <div className="container-tight">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Story */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block text-sm font-medium text-primary mb-4 uppercase tracking-wider">
              Our Story
            </span>

            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-balance">
              From Passion to{" "}
              <span className="text-gradient">Performance</span>
            </h2>

            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                What began as a passion for storytelling and editing evolved into
                a performance-first content agency trusted by global brands.
              </p>
              <p>
                We don&apos;t chase trends—we engineer content systems that compound
                growth and attention.
              </p>
              <p className="text-foreground font-medium">
                $50M+ in revenue generated
                and 150K+ organic followers
                grown in under 90 days.
              </p>
            </div>

            <div className="mt-8">
              <Button asChild variant="outline" className="group border-border/50 bg-transparent hover:bg-secondary">
                <Link href="/about">
                  Learn More
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Team */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <span className="inline-block text-sm font-medium text-primary mb-4 uppercase tracking-wider">
              Core Team
            </span>

            <div className="space-y-4">
              {team.map((member, index) => (
                <GlowCard key={member.name} className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-display font-bold text-lg shrink-0">
                      {member.initial}
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-foreground">
                        {member.name}
                      </h3>
                      <p className="text-sm text-primary mb-2">{member.role}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {member.description}
                      </p>
                    </div>
                  </div>
                </GlowCard>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
