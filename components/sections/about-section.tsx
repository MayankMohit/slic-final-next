"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { GlowCard } from "@/components/ui/glow-card";
import { useCalendly } from "@/hooks/use-calendly";
import PrimaryButton from "../ui/primaryBtn";
import SecondaryButton from "../ui/secondaryBtn";

const team = [
  {
    name: "Vedant Kulkarni",
    role: "Founder & Creative Director",
    description:
      "Built SLIC after years of producing performance video ads for brands like NEXA, Maybelline, and AJIO. Leads creative strategy, ensuring every ad is backed by research and built to convert.",
    avatar: "/avatars/vedant.png",
    avatarClass: "h-11 md:h-12",
  },
  {
    name: "Siddhartha Aryan",
    role: "Head of Production",
    description:
      "Oversees every project from kickoff to final delivery. Ensures your video ads ship on time, on spec, and ready to test. No bottlenecks, no missed deadlines.",
    avatar: "/avatars/siddhartha.png",
    avatarClass: "h-11 md:h-12",
  },
];

export function AboutSection() {
  const { openCalendly } = useCalendly();
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
            <span className="tag">
              Our Story
            </span>

            <h2 className="heading">
              From Passion to <span className="text-gradient">Performance</span>
            </h2>

            <div className="space-y-5 desc">
              <p>
                What began as a passion for storytelling and editing evolved
                into a performance creative agency built for DTC brands scaling
                on paid media.
              </p>
              <p>
                We don't chase trends. We research what converts, script ads
                that hold attention, and edit for platforms like Facebook,
                TikTok, and YouTube. Every video ad we deliver is built to
                improve ROAS and lower CPA.
              </p>
              <p className="text-foreground font-semibold">
                <span className="text-primary">$50M+</span> in revenue generated
                for brands including <br />
                <span className="text-primary">
                  LOOP LABS, NEUROBROCC, LOKT.
                </span>
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mt-6"
            >
              <div className="max-w-4xl mx-auto flex flex-col gap-6 text-center md:text-left">
                <div className="flex items-center gap-[2vw]">
                  <div className="relative group">
                    <PrimaryButton onClick={openCalendly} />

                    {/* Hover Popup */}
                    <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-full mt-4 w-max max-w-lg opacity-0 translate-y-2 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-y-0">
                      <div className="relative bg-background border border-border/60 shadow-xl rounded-xl px-4 py-3 text-[0.8vw] text-muted-foreground text-center">
                        30-minute call. No pitch deck. Leave with a creative
                        roadmap.
                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-background border-l border-t border-border/60 rotate-45" />
                      </div>
                    </div>
                  </div>

                  <SecondaryButton href="/work">Learn More</SecondaryButton>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Team */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
            className="space-y-[2vh] mt-10 lg:mt-0"
          >
            <h3 className="text-sm md:text-[0.8vw] uppercase tracking-widest text-foreground mb-1 font-bold">
              Team
            </h3>
            <p className="text-muted-foreground text-sm md:text-[0.8vw] mb-8 font-semibold">
              Who You'll Work With
            </p>

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
                  <div className="border-b border-slate-600 flex items-center gap-3 px-[1.5vh] py-[1.2vh]">
                    <Image
                      src={member.avatar}
                      alt={member.name}
                      width={300}
                      height={350}
                      loading="eager"
                      className={`${member.avatarClass} w-auto shrink-0`}
                    />
                    <div>
                      <div className="text-xl md:text-[0.8vw] font-sans font-bold text-gradient mt-1 uppercase">
                        {member.name}
                      </div>
                      <div className="text-foreground text-sm md:text-[0.8vw] font-semibold tracking-wider">
                        {member.role}
                      </div>
                    </div>
                  </div>
                  <div className="p-[2vh]">
                    <p className="text-muted-foreground leading-relaxed text-xs md:text-[0.8vw] font-semibold">
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
