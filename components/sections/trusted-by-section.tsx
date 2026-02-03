"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

export const TrustedBySection = () => {
  const logos = [
    "loop.png",
    "nb.png",
    "unscrptd.png",
    "lokt.png",
    "blackbox.png",
    "maybelline.png",
    "nexa.png",
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
    "nexa.png": 8,
    "maybelline.png": 0,
  };

  const marqueeRef = useRef<HTMLDivElement | null>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

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
    <div className="w-[80%] mx-auto flex flex-col items-center mb-[5vh] overflow-hidden">
      <h3 className="text-[0.9vw] font-inter font-semibold text-white/80 mb-[5vh] select-none text-center">
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
        <div ref={marqueeRef} className="flex gap-14 whitespace-nowrap w-max">
          {repeatedLogos.map((logo, i) => {
            const size = logoSizes[logo] || { width: 150 };
            const yOffset = logoYOffsets[logo] ?? 0;

            return (
              <div
                key={i}
                className="opacity-70 hover:opacity-100 transition duration-300 select-none"
                style={{
                  filter: "brightness(0) invert(1)",
                  transform: `translateY(${yOffset}px)`,
                }}
              >
                <img
                  src={`/brandLogos/${logo}`}
                  alt={`${logo.split(".")[0]} logo`}
                  className="object-contain pointer-events-none"
                  style={{
                    width: `${size.width}px`,
                    height: "auto",
                  }}
                  draggable="false"
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
