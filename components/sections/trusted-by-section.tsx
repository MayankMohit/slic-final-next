"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { useIsMobile } from "@/hooks/use-isMobile";

export const TrustedBySection = () => {
  const logos: { file: string; name: string }[] = [
    { file: "loop.png",       name: "Loop Labs" },
    { file: "nb.png",         name: "NeuroBrocc" },
    { file: "unscrptd.png",   name: "UNSCRPTD" },
    { file: "lokt.png",       name: "LOKT" },
    { file: "blackbox.png",   name: "Blackbox" },
    { file: "maybelline.png", name: "Maybelline" },
    { file: "nexa.png",       name: "NEXA" },
  ];

  const logoSizes: Record<string, { width: number }> = {
    "loop.png": { width: 150 },
    "nb.png": { width: 70 },
    "unscrptd.png": { width: 200 },
    "lokt.png": { width: 150 },
    "blackbox.png": { width: 230 },
    "maybelline.png": { width: 270 },
    "nexa.png": { width: 200 },
  };

  const logoYOffsets: Record<string, number> = {
    "loop.png": -4,
    "nb.png": 2,
    "unscrptd.png": 0,
    "lokt.png": 5,
    "blackbox.png": -3,
    "nexa.png": 6,
    "maybelline.png": 0,
  };

  const marqueeRef = useRef<HTMLDivElement | null>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const marquee = marqueeRef.current;
    if (!marquee) return;

    const totalWidth = marquee.scrollWidth / 2;

    tweenRef.current = gsap.to(marquee, {
      x: -totalWidth,
      duration: 40,
      ease: "linear",
      repeat: -1,
    });

    return () => {
      tweenRef.current?.kill();
    };
  }, []);

  const repeatedLogos = [...logos, ...logos];

  const handleMouseEnter = () => tweenRef.current?.pause();
  const handleMouseLeave = () => tweenRef.current?.play();

  

  return (
    <section className="section-padding md:w-[80%] w-[95%] mx-auto flex flex-col items-center overflow-hidden">
      <h3 className="text-sm md:text-[0.9vw] font-inter font-semibold text-white/80 md:mb-[5vh] mb-4 select-none text-center">
        <span className="text-blue-400">Trusted by DTC brands </span>scaling on
        paid media
      </h3>

      <div
        className="w-full overflow-hidden relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          maskImage: 
            "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
        }}
      >
        <div ref={marqueeRef} className="flex gap-4 md:gap-14 whitespace-nowrap w-max">
          {repeatedLogos.map((logo, i) => {
            const size = logoSizes[logo.file] || { width: 150 };
            const yOffset = logoYOffsets[logo.file] ?? 0;

            return (
              <div
                key={i}
                className="opacity-70 hover:opacity-100 transition duration-300 select-none"
                style={{
                  filter: "brightness(0) invert(1)",
                  transform: `translateY(${yOffset}px)`,
                }}
              >
                <Image
                  src={`/brandLogos/${logo.file}`}
                  alt={`${logo.name} logo`}
                  width={size.width}
                  height={50}
                  className="object-contain pointer-events-none"
                  style={{
                    width: isMobile ? size.width / 2 : size.width,
                    height: "auto",
                  }}
                  draggable={false}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
