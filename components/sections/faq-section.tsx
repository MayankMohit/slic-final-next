"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    question: "What type of clients does SLIC work with?",
    answer:
      "SLIC works with DTC and ecommerce brands spending $30,000 or more per month on paid media. Our clients typically run video ads on Facebook, Instagram, TikTok, and YouTube and need high-performing creative to scale profitably. If you have product-market fit and a converting funnel but your creative is the bottleneck, we're a good fit.",
  },
  {
    question: "What platforms do you create video ads for?",
    answer:
      "We create performance video ads for Facebook, Instagram, TikTok, and YouTube. Each platform has different creative requirements, and we optimize for each. Pacing, hooks, text overlays, and format variations are tailored to how each platform's algorithm rewards content. We don't do one-size-fits-all edits.",
  },
  {
    question: "How long does it take to deliver the first batch of video ads?",
    answer:
      "Most clients receive their first batch of video ads within 3 weeks. Week 1 is research and strategy. Week 2 is scripting. Week 3 is production and editing. If you need faster turnaround for urgent campaigns, let us know on our strategy call and we can discuss options.",
  },
  {
    question: "How much does it cost to work with SLIC?",
    answer:
      "Pricing depends on volume, platforms, and turnaround needs. We work with DTC brands spending $30k+ on paid media, and our packages are built for teams serious about creative as a growth lever. Book a strategy call and we'll scope out exactly what you need.",
  },
  {
    question: "Do you handle creative strategy, or just production?",
    answer:
      "Both. Strategy is where we start. Before we produce anything, we research your competitors, analyze winning ads in your category, and identify the hooks and angles most likely to convert. Then we script and produce based on that research. You're not just getting video ads. You're getting a creative strategy backed by data.",
  },
  {
    question: "What if I don't have a content idea or script yet?",
    answer:
      "That's exactly what we do. Most clients come to us without scripts or concepts. We handle the research, develop the creative angles, write the scripts, and produce the final video ads. You just need to share your product, your goals, and access to any existing assets. We take it from there.",
  },
  {
    question: "Do you offer UGC or creator content?",
    answer:
      "No. SLIC focuses on research, scripting, and editing. We don't source UGC creators or manage influencer content. Our specialty is building the strategic and production layers that make video ads perform. If you need creator sourcing, we can recommend partners, but that's not our core service.",
  },
  {
    question: "How do you ensure the video ads match our brand?",
    answer:
      "We start every engagement with a brand and creative briefing. You share your brand guidelines, tone preferences, past creative that worked, and any constraints. We use that as the foundation for all scripts and edits. You review and approve everything before final delivery. Nothing ships without your sign-off.",
  },
  {
    question: "Why should we choose SLIC over other creative agencies?",
    answer:
      "Most agencies start with production. We start with research. Before we shoot or edit anything, we dig into what's actually working in your market. We script every ad based on data, not templates. The result is video ads that win creative tests more consistently. We've generated $50M+ in revenue for brands like NEXA, Maybelline, and AJIO using this approach.",
  },
];

export function FAQSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section id="faqs" className="section-padding relative overflow-hidden">
      <div className="container-tight relative z-10">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center md:mb-16 mb-6"
        >
          <span className="tag">
            Got questions?
          </span>
          <h2 className="heading">
            Frequently Asked Questions
          </h2>
          <p className="desc">
            Everything you need to know before working with us.
          </p>
        </motion.div>

        {/* FAQ List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="md:max-w-[50vw] mx-auto max-w-[90vw]"
        >
          {faqs.map((faq, index) => {
            const isOpen = activeIndex === index;

            return (
              <div
                key={faq.question}
                className="border-b border-border last:border-0"
              >
                {/* Question */}
                <button
                  type="button"
                  onClick={() => setActiveIndex(isOpen ? -1 : index)}
                  className="w-full flex items-center justify-between md:px-[1vw] md:py-[0.2vw] p-1.5 text-left group"
                >
                  <span className="font-sans text-sm md:text-[0.8vw] font-bold text-foreground group-hover:text-primary transition-colors pr-4">
                    {faq.question}
                  </span>

                  <div className="md:p-[1vw] p-2 text-[0.8vw] font-semibold rounded-full bg-secondary/50 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    {isOpen ? (
                      <Minus className="w-4 h-4" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                  </div>
                </button>

                {/* Answer */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p className="md:px-5 md:pb-5 pb-2 px-2 text-muted-foreground leading-relaxed font-semibold text-xs md:text-[0.8vw] w-[90%]">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
