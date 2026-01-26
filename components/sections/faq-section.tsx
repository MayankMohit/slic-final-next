'use client';

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    question: "What type of clients do you usually work with?",
    answer:
      "We work with creators, entrepreneurs, and businesses who understand the power of consistent, high-quality content. Most of our clients are in the US & UK and want to scale their online presence through powerful storytelling and video marketing.",
  },
  {
    question: "How do you ensure the content fits our brand style and tone?",
    answer:
      "Before production starts, we go through a brand discovery phase—studying your visuals, tone, competitors, and messaging. We then build a content style guide to ensure everything we create feels consistent, on-brand, and true to your audience.",
  },
  {
    question: "How long does it take to deliver the first batch of content?",
    answer:
      "Typically, you can expect your first batch of deliverables within 7–10 business days after we receive all necessary inputs and approvals.",
  },
  {
    question: "Do you handle strategy as well, or only the creative part?",
    answer:
      "We handle both. Our team doesn't just execute—we think strategically about what kind of content performs best for your goals, platforms, and audience.",
  },
  {
    question: "What if I don't have a content idea or script yet?",
    answer:
      "No problem. We handle ideation and scripting for you. Based on your niche, product, and target audience, we create hooks, angles, and stories that grab attention and convert.",
  },
  {
    question: "Why should we choose your agency over others?",
    answer:
      "Because we don't just make content—we build growth systems. We've scaled brands from zero to millions of views with an obsessive focus on performance, quality, and storytelling that drives results.",
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
          className="text-center mb-16"
        >
          <span className="inline-block text-sm font-medium text-primary mb-4 uppercase tracking-wider">
            Got questions?
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-balance">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Everything you need to know before working with us.
          </p>
        </motion.div>

        {/* FAQ List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-3xl mx-auto"
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
                  className="w-full flex items-center justify-between px-2 py-5 text-left group"
                >
                  <span className="font-display text-lg font-medium text-foreground group-hover:text-primary transition-colors pr-4">
                    {faq.question}
                  </span>

                  <div className="p-2 rounded-full bg-secondary/50 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors shrink-0">
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
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
                      <p className="px-2 pb-5 text-muted-foreground leading-relaxed">
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
