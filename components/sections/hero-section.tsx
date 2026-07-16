"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import PrimaryButton from "@/components/ui/primaryBtn";
import { useCalendly } from "@/hooks/use-calendly";
import AnimatedCounter from "@/components/ui/animated-counter";

export function HeroSection() {
  const { openCalendly } = useCalendly();

  // Safari/iOS can't decode VP9 alpha (webm); Chromium/Firefox can't decode
  // HEVC alpha (mp4). Detect via UA — source-order fallback is unreliable
  // because newer Chrome claims HEVC support but drops the alpha channel.
  const [useMp4, setUseMp4] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const ua = navigator.userAgent;
    const isIOS =
      /iPad|iPhone|iPod/.test(ua) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    const isSafari =
      /safari/i.test(ua) &&
      !/chrome|chromium|crios|edg|opr|fxios|firefox|android/i.test(ua);
    setUseMp4(isIOS || isSafari);
  }, []);

  // Pause the loop while the hero is scrolled out of view to save CPU/battery.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [useMp4]);

  return (
    <section className="relative min-h-screen flex items-center justify-center">
      {/* Content */}
      <div className="container-tight py-10 md:py-[15vh] pt-10 md:pt-20">
        <div className="md:max-w-[70vw] mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 md:px-[0.8vw] md:py-[0.4vw] p-1.5 rounded-full bg-primary/10 border border-primary/20 md:mb-[5vh] mb-5"
          >
            <span className="md:w-[0.4vw] md:h-[0.4vw] w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-xs md:text-[0.8vw] font-semibold text-primary">
              {" "}
              Performance Creative Agency for DTC Brands
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-sans text-3xl sm:text-5xl md:text-6xl lg:text-[3vw] tracking-tight mb-[3vh] text-balance"
          >
            Ad Creative That{" "}
            <span className="text-gradient">Actually Converts</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xs md:text-[0.8vw] text-muted-foreground md:max-w-[45vw] mx-auto mb-[3vh] leading-relaxed text-pretty font-semibold"
          >
            We research, script, and produce performance-driven video ads for
            Meta, TikTok, and YouTube. Built for DTC brands spending $30k+/month
            who are done guessing what creative will work.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-[3vw]"
          >
            {/* Primary CTA with Hover Popup */}
            <div className="relative group">
              {/* <Button
                onClick={openCalendly}
                size="sm"
                className="bg-gradient-primary hover:opacity-90 text-primary-foreground"
              >
                Book a Strategy Call
                <ArrowRight className="ml-[0.5vw]" />
              </Button> */}
              <PrimaryButton onClick={openCalendly}  />

              {/* Hover Popup */}
              <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-full mt-4 w-max max-w-lg opacity-0 translate-y-2 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-y-0">
                <div className="relative bg-background border border-border/60 shadow-xl rounded-xl px-[2vw] py-[1.5vh] text-[0.8vw] text-muted-foreground text-center">
                  30-minute call. No pitch deck. Leave with a creative roadmap.
                  {/* Arrow */}
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-background border-l border-t border-border/60 rotate-45" />
                </div>
              </div>
            </div>

            <Button
              asChild
              variant="outline"
              size="sm"
            >
              <Link href="/work">
                <Play className="mr-1/2 w-5 h-5" />
                See Our Work
              </Link>
            </Button>
          </motion.div>

          {/* Laptop Video */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mx-auto md:mt-[4vh] mt-8 w-full max-w-[85vw] md:max-w-[45vw] aspect-video"
          >
            {useMp4 !== null && (
              <video
                ref={videoRef}
                autoPlay
                muted
                loop
                playsInline
                disablePictureInPicture
                disableRemotePlayback
                poster="/landingVideos/landing-poster.webp"
                aria-hidden="true"
                className="h-full w-full object-contain pointer-events-none select-none"
              >
                <source
                  src={
                    useMp4
                      ? "/landingVideos/landing_safari.mp4"
                      : "/landingVideos/landing.webm"
                  }
                  type={useMp4 ? 'video/mp4; codecs="hvc1"' : "video/webm"}
                />
              </video>
            )}
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-[5vw] md:mt-[4vh] mt-4 md:pt-[4vh] pt-8 border-t border-border/50"
          >
            {[
              { value: "$50M+", label: "Client Revenue Generated" },
              { value: "1000+", label: "Performance Ads Delivered" },
              { value: "32%", label: "Avg. CPA Reduction" },
              { value: "3.2x", label: "Avg. ROAS Lift" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <AnimatedCounter
                  value={stat.value}
                  duration={1800}
                  delay={1000}
                  className="font-sans text-2xl md:text-[2vw] font-bold text-gradient mb-[1vh]"
                />
                <div className="text-xs md:text-[0.8vw] text-muted-foreground font-semibold">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
