'use client';

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

const brands = [
  "AJIO",
  "Casio",
  "Goibibo",
  "Himalaya",
  "Loop",
  "Maybelline",
  "New Balance",
  "Nexa",
  "VH1",
  "Viacom",
];

export function TrustedBySection() {
  const marqueeRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    const marquee = marqueeRef.current;

    tweenRef.current = gsap.to(marquee, {
      xPercent: -50,
      repeat: -1,
      duration: 30,
      ease: "linear",
    });

    return () => {
      if (tweenRef.current) tweenRef.current.kill();
    };
  }, []);

  const repeatedBrands = [...brands, ...brands];

  const handleMouseEnter = () => {
    if (tweenRef.current) tweenRef.current.pause();
  };

  const handleMouseLeave = () => {
    if (tweenRef.current) tweenRef.current.play();
  };

  return (
    <section className="py-16 border-y border-border/30">
      <div className="container-tight mb-8">
        <p className="text-center text-sm text-muted-foreground font-medium uppercase tracking-wider">
          Trusted by
        </p>
      </div>

      <div 
        className="overflow-hidden"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div
          ref={marqueeRef}
          className="flex items-center gap-16 whitespace-nowrap"
          style={{ width: "max-content" }}
        >
          {repeatedBrands.map((brand, i) => (
            <div
              key={`${brand}-${i}`}
              className="flex-shrink-0 px-6 py-3 rounded-lg bg-secondary/30 border border-border/30 opacity-70 hover:opacity-100 transition-opacity"
            >
              <span className="font-display text-lg font-semibold text-muted-foreground">
                {brand}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
