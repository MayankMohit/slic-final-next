"use client";

import { useEffect, useRef } from "react";

interface AnimatedCounterProps {
  value: string; // "3.5x", "47%", "$50M+"
  duration?: number;
  delay?: number;
  scrollTrigger?: boolean;
  className?: string;
}

export default function AnimatedCounter({
  value,
  duration = 2000,
  delay = 0,
  scrollTrigger = false,
  className,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!ref.current) return;

    const match = value.match(/([\d.]+)/);
    if (!match) return;

    const numericValue = parseFloat(match[1]);
    const prefix = value.slice(0, match.index);
    const suffix = value.slice((match.index ?? 0) + match[1].length);

    // 🔹 Force initial value to 0 immediately
    ref.current.textContent =
      prefix +
      (match[1].includes(".") ? "0.0" : "0") +
      suffix;

    let rafId: number;
    let startTime: number | null = null;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);

      // Smooth easeOut cubic
      const eased = 1 - Math.pow(1 - percentage, 3);
      const current = numericValue * eased;

      if (ref.current) {
        ref.current.textContent =
          prefix +
          current.toFixed(match[1].includes(".") ? 1 : 0) +
          suffix;
      }

      if (percentage < 1) {
        rafId = requestAnimationFrame(animate);
      }
    };

    const start = () => {
      if (hasAnimated.current) return;
      hasAnimated.current = true;

      setTimeout(() => {
        rafId = requestAnimationFrame(animate);
      }, delay);
    };

    if (scrollTrigger) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            start();
            observer.disconnect();
          }
        },
        { threshold: 0.5 }
      );

      observer.observe(ref.current);

      return () => {
        observer.disconnect();
        cancelAnimationFrame(rafId);
      };
    } else {
      start();
      return () => cancelAnimationFrame(rafId);
    }
  }, [value, duration, delay, scrollTrigger]);

  return <span ref={ref} className={className} />;
}
