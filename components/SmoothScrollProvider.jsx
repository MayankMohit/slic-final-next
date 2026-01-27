"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export default function SmoothScrollProvider({ children, options }) {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.2,
      smoothWheel: true,
      ...options,
    });

    let rafId;
    const raf = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      lenis.destroy?.();
    };
  }, [options]);

  return children;
}
