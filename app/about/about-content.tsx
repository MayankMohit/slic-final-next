"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { METRICS } from "@/lib/metrics";
import { Target, Users, Award, Rocket } from "lucide-react";
import { GlowCard } from "@/components/ui/glow-card";
import { CTASection } from "@/components/sections/cta-section";

const values = [
  {
    icon: Target,
    title: "Performance Over Aesthetics",
    description:
      "A beautiful ad that doesn't convert is a failed ad. We optimize for ROAS, CPA, and revenue first. The creative follows the strategy, not the other way around.",
  },
  {
    icon: Rocket,
    title: "Research Before Production",
    description:
      "We don't start with a camera. We start with competitor ads, customer reviews, and winning creative patterns. Scripts are built on insights, not assumptions.",
  },
  {
    icon: Users,
    title: "Speed Without Sacrifice",
    description:
      "Test-ready variants in 48 to 72 hours, not 4 to 8 weeks. We move fast because creative fatigue doesn't wait. But speed never means cutting corners on quality.",
  },
  {
    icon: Award,
    title: "Partnership, Not Hand-Off",
    description:
      "We share your KPIs. We track your results. We iterate based on what's working. This isn't a deliverables relationship. It's a growth partnership.",
  },
];

const team = [
  {
    name: "Vedant Kulkarni",
    role: "FOUNDER AND CREATIVE DIRECTOR",
    bio: "Built SLIC after years of producing performance video ads for brands like NEXA, Maybelline, and AJIO. Leads creative strategy across every client engagement, ensuring every ad is backed by research and built to convert. Obsessed with the intersection of psychology and performance.",
    avatar: "/avatars/vedant.png",
    avatarClass: "h-18 md:h-22",
  },
  {
    name: "Siddhartha Aryan",
    role: "HEAD OF PRODUCTION",
    bio: "Oversees every project from kickoff to final delivery. Ensures your video ads ship on time, on spec, and ready to test. No bottlenecks, no missed deadlines. The reason SLIC delivers fast without sacrificing quality.",
    avatar: "/avatars/siddhartha.png",
    avatarClass: "h-18 md:h-22",
  },
];

// "50+ Brands Scaled" is gone. It was the one figure here with nothing
// behind it anywhere else on the site, and it sat oddly beside $50M+ earned
// from a handful of named clients. Three stats, all of which the case
// studies can substantiate.
const milestones = [
  { value: METRICS.revenueGenerated, label: "Revenue Generated" },
  { value: METRICS.peakRoas, label: "Peak ROAS" },
  { value: METRICS.adsDelivered, label: "Performance Ads Delivered" },
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
              <span className="tag">About Us</span>

              <h1 className="heading">
                From Passion to{" "}
                <span className="text-gradient">Performance</span>
              </h1>

              <p className="desc">
                We&apos;re a performance creative agency obsessed with making
                video ads that actually convert. Not content for content's sake.
                Ads that drive revenue.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Story */}
        <section className="section-padding">
          <div className="container-tight">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <span className="tag">Our Story</span>

                <div className="text-xs md:text-[0.8vw] text-foreground/80 space-y-2">
                  <p>
                    SLIC started with one belief: creative should be measured by
                    business outcomes, not impressions.
                  </p>
                  <p>
                    We saw DTC brands spending $30k, $50k, even $100k per month
                    on paid media, but their creative was an afterthought.
                    Agencies delivered pretty videos that tanked in ad accounts.
                    Media buyers blamed creative. Creative teams blamed
                    strategy. Nobody owned results.
                  </p>
                  <p>We built SLIC to fix that.</p>
                  <p>
                    We research before we produce. We script before we edit.
                    Every video ad we deliver is built on customer insights,
                    competitor analysis, and platform-specific optimization.
                    When our ads go live, they're not guesses. They're informed
                    bets designed to win.
                  </p>
                  <p>
                    Today, our video ads have generated over $50M in revenue for
                    DTC brands like Loop Labs, NeuroBrocc, and LOKT. We've
                    averaged 47% hold rates and $30 to $40 CPAs across clients.
                    And we're just getting started.
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
                      <div
                        key={stat.label}
                        className={`text-center${
                          // An odd count leaves the last stat alone on its
                          // row. Spanning both columns centres it rather
                          // than leaving it under the left-hand one.
                          milestones.length % 2 === 1 &&
                          index === milestones.length - 1
                            ? " col-span-2"
                            : ""
                        }`}
                      >
                        <div className="font-sans text-2xl md:text-[1.5vw] font-bold text-gradient">
                          {stat.value}
                        </div>
                        <div className="text-xs md:text-[0.8vw] text-foreground/80">
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
              <span className="tag">What Drives Us</span>
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
                    <h3 className="font-sans text-sm md:text-[0.8vw] font-bold mb-2 text-foreground">
                      {value.title}
                    </h3>
                    <p className="text-xs md:text-[0.8vw] text-foreground/80">
                      {value.description}
                    </p>
                  </GlowCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="section-padding">
          <div className="container-tight">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <span className="tag">Meet the Team</span>
              <p className="desc">
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
                  <GlowCard className="p-8 h-full">
                    <div className="flex flex-col items-center text-center">
                      <Image
                        src={member.avatar}
                        alt={member.name}
                        width={300}
                        height={350}
                        loading="eager"
                        className={`${member.avatarClass} w-auto`}
                      />
                      <h3 className="mt-4 font-sans text-sm md:text-[0.8vw] font-bold text-foreground uppercase">
                        {member.name}
                      </h3>
                      <p className="text-brand-alt text-sm md:text-[0.8vw] mb-4">
                        {member.role}
                      </p>
                      <p className="text-foreground/80 text-xs md:text-[0.8vw]">
                        {member.bio}
                      </p>
                    </div>
                  </GlowCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <CTASection />
      </div>

      <Footer />
    </main>
  );
}
