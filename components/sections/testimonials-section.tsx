'use client';

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { GlowCard } from "@/components/ui/glow-card";

const testimonials = [
  {
    quote: "SLIC transformed our creative strategy and helped us achieve viral reach we never thought possible.",
    author: "Benzion Sadigursky",
    role: "Founder, Loop Labs",
    stars: 5,
  },
  {
    quote: "The speed and quality of iteration is unmatched. They truly understand performance marketing.",
    author: "Ross Barash",
    role: "Creative Director, NeuroBrocc",
    stars: 5,
  },
  {
    quote: "Working with SLIC means never worrying about creative bottlenecks. They deliver results, fast.",
    author: "Elina",
    role: "Marketing Head, Nim Video",
    stars: 5,
  },
  {
    quote: "Their understanding of platform-native content is exceptional. Real ROI improvements.",
    author: "Shelly",
    role: "Marketing Manager, Wondershare Filmora",
    stars: 5,
  },
];

export function TestimonialsSection() {
  return (
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
            Testimonials
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-balance">
            What Our Clients Say
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Don&apos;t just take our word for it—hear from the brands we&apos;ve helped scale.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.author}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <GlowCard className="h-full p-6">
                <div className="flex flex-col h-full">
                  <Quote className="w-8 h-8 text-primary/30 mb-4" />
                  <p className="text-foreground text-lg mb-6 flex-grow leading-relaxed">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: testimonial.stars }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <div>
                    <div className="font-display font-semibold text-foreground">{testimonial.author}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
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
