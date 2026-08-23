"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { GlowCard } from "@/components/ui/glow-card";
import PrimaryButton from "../ui/primaryBtn";

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
  return (
    <section className="section-padding">
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center md:max-w-[57vw] mx-auto mb-[4vh]"
        >
          <span className="tag">
            Testimonials
          </span>
          <h2 className="heading">
            What Our Clients Say
          </h2>
          <p className="desc">
            Don't just take our word for it. Hear from the brands we've helped
            scale with performance video ads.
          </p>
        </motion.div>

        {/* The card body is sized in vw at md+ — padding, margins, gaps and
            icons, not just the type. Previously only the text was vw while the
            box around it was fixed px in a px-capped container, so the copy grew
            with the viewport while its container stayed put. */}
        <div className="md:max-w-[57vw] mx-auto">
          <div className="grid md:grid-cols-2 md:gap-[2vw] gap-5">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.author}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="h-full w-full"
              >
                <GlowCard className="group h-full p-6 md:p-[1vw]">
                  <div className="flex flex-col h-full">
                    <Quote className="w-8 h-8 md:w-[1.6vw] md:h-[1.6vw] text-brand-alt/50 group-hover:text-brand-alt/95 transition-colors duration-300 mb-4 md:mb-[1vw]" />
                    <p className="text-foreground text-sm md:text-[0.8vw] mb-6 md:mb-[1.2vw] grow leading-relaxed font-normal">
                      &ldquo;{testimonial.quote}&rdquo;
                    </p>
                    <div className="flex gap-1 md:gap-[0.25vw] mb-4 md:mb-[1vw]">
                      {Array.from({ length: testimonial.stars }).map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 md:w-[0.8vw] md:h-[0.8vw] fill-primary text-primary"
                        />
                      ))}
                    </div>
                    <div className="flex flex-col gap-1 md:gap-[0.25vw]">
                      <div className="font-sans font-bold text-foreground text-xs md:text-[0.8vw]">
                        {testimonial.author}
                      </div>
                      <div className="text-xs md:text-[0.8vw] text-foreground/80 font-normal">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                </GlowCard>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="mt-6"
      >
        <div className="md:max-w-[50vw] max-w-[90vw] mx-auto flex flex-col items-center justify-between gap-5 md:gap-[1vw] text-center md:text-left">
          <p className="text-foreground/80 text-xs md:text-[0.8vw] text-center font-normal">
            Ready to see results like these? Book a call and we'll show you
            exactly how we can improve your video ad performance.
          </p>

          <div className="flex items-center gap-[4vw]">
            <div className="relative group">
              <PrimaryButton href="/book" />

              {/* Hover Popup */}
              <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-full mt-4 w-max max-w-lg opacity-0 translate-y-2 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-y-0">
                <div className="relative bg-background border border-border/60 shadow-xl rounded-xl px-4 py-3 text-[0.8vw] text-foreground/80 text-center">
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
