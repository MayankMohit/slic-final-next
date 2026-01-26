'use client';

import { motion } from "framer-motion";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Target, Users, Award, Rocket } from "lucide-react";
import { GlowCard } from "@/components/ui/glow-card";
import { CTASection } from "@/components/sections/cta-section";

const values = [
  {
    icon: Target,
    title: "Results-Obsessed",
    description:
      "Every creative decision is driven by data and optimized for measurable outcomes.",
  },
  {
    icon: Rocket,
    title: "Speed & Quality",
    description:
      "We move fast without compromising on the quality that drives results.",
  },
  {
    icon: Users,
    title: "Partnership Mindset",
    description:
      "We treat your brand like our own, invested in your long-term success.",
  },
  {
    icon: Award,
    title: "Creative Excellence",
    description:
      "Pushing boundaries to create content that stands out in crowded feeds.",
  },
];

const team = [
  {
    name: "Vedant",
    role: "Founder & Creative Director",
    bio: "The visionary behind SLIC's creative strategy. With a background in film production and digital marketing, Vedant has helped brands generate over $50M in revenue through viral content. His approach blends storytelling with performance marketing.",
    initial: "V",
  },
  {
    name: "Siddharth",
    role: "Operations & Logistics",
    bio: "The engine behind seamless execution. Siddharth ensures every project—from concept to delivery—is delivered on time while maintaining SLIC's quality bar.",
    initial: "S",
  },
];

const milestones = [
  { value: "$50M+", label: "Revenue Generated" },
  { value: "150K+", label: "Followers Grown" },
  { value: "500+", label: "Videos Produced" },
  { value: "50+", label: "Brands Scaled" },
];

export function AboutPageContent() {
  return (
    <main className="min-h-screen">
      <Navbar />

      <div className="pt-20">
        {/* Hero */}
        <section className="section-padding">
          <div className="container-tight">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-3xl mx-auto"
            >
              <span className="inline-block text-sm font-medium text-primary mb-4 uppercase tracking-wider">
                About Us
              </span>

              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance">
                From Passion to{" "}
                <span className="text-gradient">Performance</span>
              </h1>

              <p className="text-lg text-muted-foreground leading-relaxed">
                We&apos;re a performance-first video agency obsessed with creating
                content that actually converts.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Story */}
        <section className="section-padding bg-card/30">
          <div className="container-tight">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <span className="inline-block text-sm font-medium text-primary mb-4 uppercase tracking-wider">
                  Our Story
                </span>

                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    SLIC Media started with one belief: video should drive real
                    business outcomes, not just impressions.
                  </p>
                  <p>
                    Our first major breakthrough came when we grew an Instagram
                    account from zero to 150,000 followers in just 90 days—purely
                    through strategic content.
                  </p>
                  <p>
                    That success wasn&apos;t luck. It was systems, testing, and a deep
                    understanding of what makes people stop scrolling.
                  </p>
                  <p>
                    Today, we help brands scale revenue with performance-driven
                    video across social and paid channels.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <GlowCard className="p-8">
                  <div className="grid grid-cols-2 gap-8">
                    {milestones.map((stat, index) => (
                      <div key={stat.label} className="text-center">
                        <div className="font-display text-3xl md:text-4xl font-bold text-gradient mb-2">
                          {stat.value}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </GlowCard>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="section-padding">
          <div className="container-tight">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <span className="inline-block text-sm font-medium text-primary mb-4 uppercase tracking-wider">
                What Drives Us
              </span>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <GlowCard className="h-full p-6 text-center">
                    <div className="p-3 rounded-xl bg-primary/10 w-fit mx-auto mb-4">
                      <value.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-display text-lg font-semibold mb-2 text-foreground">
                      {value.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {value.description}
                    </p>
                  </GlowCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="section-padding bg-card/30">
          <div className="container-tight">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <span className="inline-block text-sm font-medium text-primary mb-4 uppercase tracking-wider">
                Meet the Team
              </span>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                A focused team combining creativity, strategy, and execution.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {team.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <GlowCard className="p-8">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-20 h-20 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-display font-bold text-2xl mb-4">
                        {member.initial}
                      </div>
                      <h3 className="font-display text-xl font-semibold text-foreground">
                        {member.name}
                      </h3>
                      <p className="text-primary text-sm mb-4">{member.role}</p>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {member.bio}
                      </p>
                    </div>
                  </GlowCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <CTASection />
      </div>

      <Footer />
    </main>
  );
}
