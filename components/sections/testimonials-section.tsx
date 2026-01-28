"use client";

import { motion } from "framer-motion";
import { Star, Quote, ArrowRight } from "lucide-react";
import { GlowCard } from "@/components/ui/glow-card";
import { Button } from "../ui/button";
import { useCalendly } from "@/hooks/use-calendly";

const testimonials = [
  {
    quote:
      "Really thoughtful work, combining the psychology behind things with the premium visuals. Can't imagine this being done better, definitely better than any other VSLs I've seen! Thanks for your attention to detail here and quality of work.",
    author: "Benzion Sadigursky",
    role: "Founder, Loop Labs",
    stars: 5,
  },
  {
    quote:
      "The speed and quality of iteration is unmatched. They truly understand performance marketing.",
    author: "Ross Barash",
    role: "Creative Director, NeuroBrocc",
    stars: 5,
  },
  {
    quote:
      "Working with SLIC means never worrying about creative bottlenecks. They deliver results, fast.",
    author: "Elina",
    role: "Marketing Head, Nim Video",
    stars: 5,
  },
  {
    quote:
      "Their understanding of platform-native content is exceptional. Real ROI improvements.",
    author: "Shelly",
    role: "Marketing Manager, Wondershare Filmora",
    stars: 5,
  },
];

export function TestimonialsSection() {
  const { openCalendly } = useCalendly();
  return (
    <section className="section-padding">
      <div className="container-tight">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-[4vh]"
        >
          <span className="inline-block text-[0.8vw] font-medium text-primary mb-[1vh] uppercase tracking-wider">
            Testimonials
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-[3vw] font-bold mb-[2vh] text-balance">
            What Our Clients Say
          </h2>
          <p className="text-[0.8vw] text-muted-foreground leading-relaxed max-w-[50vw] mx-auto">
            Don't just take our word for it. Hear from the brands we've helped
            scale with performance video ads.
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
                  <p className="text-foreground text-[0.8vw] mb-6 grow leading-relaxed">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: testimonial.stars }).map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-primary text-primary"
                      />
                    ))}
                  </div>
                  <div>
                    <div className="font-display font-bold text-foreground text-[0.8vw]">
                      {testimonial.author}
                    </div>
                    <div className="text-[0.8vw] text-muted-foreground">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </GlowCard>
            </motion.div>
          ))}
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="mt-6"
      >
        <div className="max-w-[50vw] mx-auto flex flex-col items-center justify-between gap-[1vw] text-center md:text-left">
          <p className="text-muted-foreground text-sm md:text-[0.8vw] text-center">
            Ready to see results like these? Book a call and we'll show you
            exactly how we can improve your video ad performance.
          </p>

          <div className="flex items-center gap-[4vw]">
            <div className="relative group">
              <Button
                onClick={openCalendly}
                size="sm"
                className="bg-gradient-primary hover:opacity-90 text-primary-foreground px-6 py-5 text-base font-semibold"
              >
                Book a Strategy Call
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>

              {/* Hover Popup */}
              <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-full mt-4 w-max max-w-md opacity-0 translate-y-2 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-y-0">
                <div className="relative bg-background border border-border/60 shadow-xl rounded-xl px-4 py-3 text-sm text-muted-foreground text-center">
                  30-minute call. No pitch deck. Leave with a creative roadmap.
                  {/* Arrow */}
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-background border-l border-t border-border/60 rotate-45" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
