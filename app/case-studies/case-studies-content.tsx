"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Check } from "lucide-react";
import { GlowCard } from "@/components/ui/glow-card";
import { CTASection } from "@/components/sections/cta-section";

const caseStudies = [
  {
    logo: "loop.png",
    logoSize: { width: 130 },
    metrics: [
      { value: "$40M+", label: "Revenue Generated" },
      { value: "2.5x", label: "ROAS" },
    ],
    title: "Loop Labs: $40M+ in Revenue with Performance Video Ads",
    client: "DTC Toy Brand",
    challenge:
      "Loop Labs needed a reliable stream of high-performing video ad creative to scale their paid media spend profitably. They were spending aggressively on Facebook and TikTok but hitting creative fatigue and inconsistent ROAS.",
    solution:
      "We became their dedicated performance creative partner, delivering research-backed video ads on a continuous basis. Every ad started with competitor analysis, customer research, and hook testing. We optimized specifically for Facebook and TikTok algorithms, iterating weekly based on performance data.",
    results: [
      "$40M+ in revenue generated over 2 years",
      "Consistent 2.5x ROAS across campaigns",
      "Eliminated creative bottlenecks",
      "Continuous pipeline of winning ad variations",
    ],
    tags: ["Facebook Ads", "TikTok Ads", "DTC", "Toys"],
  },
  {
    logo: "nb.png",
    logoSize: { width: 60 },
    metrics: [
      { value: "$10M+", label: "Revenue Generated" },
      { value: "3x", label: "ROAS" },
    ],
    title: "NeuroBrocc: $10M+ Revenue and 3x ROAS on US Launch",
    client: "Kids Nutrition Supplement Brand",
    challenge:
      "NeuroBrocc was relaunching in the US market and needed video ad creative that could drive profitable customer acquisition from day one. The kids nutrition space is competitive, with high CPAs and skeptical parents as the target audience.",
    solution:
      "We researched the competitive landscape, identified messaging gaps, and scripted video ads that addressed parent objections head-on. Our creative focused on trust signals, ingredient transparency, and clear benefits. Every ad was optimized for Meta and tested rigorously.",
    results: [
      "$10M+ in revenue generated",
      "3x ROAS on paid campaigns",
      "Successful US market relaunch",
      "Scalable creative system for ongoing growth",
    ],
    tags: ["Meta Ads", "DTC", "Nutrition", "Supplements"],
  },
  {
    logo: "lokt.png",
    logoSize: { width: 120 },
    metrics: [
      { value: "3x", label: "ROAS" },
      { value: "$12 to $15", label: "CPA" },
    ],
    title: "LOKT: 3x ROAS with $12 to $15 CPA",
    client: "Screentime Solution Product",
    challenge:
      "LOKT needed video ad creative that could explain their screentime solution product quickly and drive conversions at a sustainable CPA. The product required education before purchase, making the first 3 seconds critical.",
    solution:
      "We developed hook-first video ads that grabbed attention and communicated the core value proposition within seconds. Scripts were built on customer pain points (parents frustrated with kids' screen addiction) and clear product benefits. We tested multiple angles and iterated toward winners.",
    results: [
      "3x ROAS achieved",
      "$12 to $15 CPA (sustainable for scale)",
      "High-converting hook variations identified",
      "Repeatable creative framework established",
    ],
    tags: ["Facebook Ads", "TikTok Ads", "DTC", "Consumer Tech"],
  },
  {
    logo: "unscrptd.png",
    logoSize: { width: 140 },
    metrics: [
      { value: "2x", label: "ROAS" },
    ],
    title: "UNSCRPTD: 2x ROAS with Street Interview Ad Creative",
    client: "Street Interview Content Agency",
    challenge:
      "UNSCRPTD needed video ad creative that could turn their signature street interview format into high-converting paid ads for their brand clients. The challenge was maintaining the raw, authentic feel that makes street interviews engaging while optimizing for conversions.",
    solution:
      "We developed a performance-focused editing approach for street interview content. We identified the highest-impact moments, built scroll-stopping hooks from real reactions, and structured the ads for platform algorithms. The authentic format combined with strategic editing created ads that felt native but converted.",
    results: [
      "2x ROAS on paid campaigns",
      "Authentic street interview format preserved",
      "Scalable ad creative system",
      "High engagement with strong conversion",
    ],
    tags: ["Facebook Ads", "TikTok Ads", "Street Interviews", "Content Agency"],
  },
];

export function CaseStudiesPageContent() {
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
              <span className="tag">Case Studies</span>

              <h1 className="heading">Real Results for Real Brands</h1>

              <p className="desc">
                We don't measure success in likes or views. We measure it in
                revenue, ROAS, and CPA. Here's how our performance video ads
                have helped DTC brands scale profitably on Facebook, TikTok, and
                YouTube.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Case Studies Grid */}
        <section className="section-padding pt-0">
          <div className="container-tight">
            <div className="grid md:grid-cols-2 gap-8">
              {caseStudies.map((study, index) => (
                <motion.div
                  key={study.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <GlowCard className="h-full p-6 md:p-8">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <div className="p-3 rounded-2xl bg-primary/10 w-fit mb-3 flex items-center justify-center">
                          <Image
                            src={`/brandLogos/${study.logo}`}
                            alt={`${study.logo.split(".")[0]} logo`}
                            width={study.logoSize.width}
                            height={50}
                            className="object-contain pointer-events-none"
                            draggable={false}
                            style={{ width: study.logoSize.width, height: "auto" }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {study.client}
                        </p>
                      </div>
                      <div className="text-right space-y-3">
                        {study.metrics.map((metric) => (
                          <div key={metric.value}>
                            <div className="font-sans text-2xl md:text-3xl font-bold text-gradient leading-none">
                              {metric.value}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {metric.label}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Content */}
                    <h2 className="font-sans text-xl font-semibold mb-4 text-foreground">
                      {study.title}
                    </h2>

                    <div className="space-y-4 mb-6">
                      <div>
                        <p className="text-xs font-semibold text-primary mb-1">
                          Challenge
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {study.challenge}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-primary mb-1">
                          Solution
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {study.solution}
                        </p>
                      </div>
                    </div>

                    <div className="mb-6">
                      <p className="text-xs font-semibold text-primary mb-3">
                        Key Results
                      </p>
                      <ul className="space-y-2">
                        {study.results.map((result) => (
                          <li
                            key={result}
                            className="flex items-start gap-2 text-sm text-foreground"
                          >
                            <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                            {result}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-4 border-t border-border/50">
                      {study.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 text-xs rounded-full bg-secondary text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ))}
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
