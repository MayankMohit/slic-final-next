"use client";

import { useEffect, useRef } from "react";

interface AnimatedCounterProps {
  /** The figure exactly as it should read when finished: "3.5x ROAS", "$50M+". */
  value: string;
  /**
   * The number to count up FROM. Defaults to 0.
   *
   * Volume figures can start at zero safely — half of $50M is still a large
   * number, and the animation reads as accumulation. Ratios cannot. A ROAS of
   * 0.7x is not a smaller version of 3.5x, it is a campaign losing money, and
   * this site's audience reads those figures for a living. Flooring the start
   * keeps every frame of the animation a result we would actually claim.
   */
  from?: number;
  duration?: number;
  delay?: number;
  scrollTrigger?: boolean;
  className?: string;
}

/** Decimal places in a numeric string, so "1.8" -> 1 and "3" -> 0. */
function decimalsOf(numeric: string) {
  const dot = numeric.indexOf(".");
  return dot === -1 ? 0 : numeric.length - dot - 1;
}

export default function AnimatedCounter({
  value,
  from = 0,
  duration = 2000,
  delay = 0,
  scrollTrigger = false,
  className,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const match = value.match(/[\d.]+/);
    if (!match) {
      el.textContent = value;
      return;
    }

    const target = parseFloat(match[0]);
    const prefix = value.slice(0, match.index);
    const suffix = value.slice((match.index ?? 0) + match[0].length);

    /**
     * Mid-animation precision is the coarser of the two ends, not the target's.
     *
     * "3x" carries no decimal, so counting to it from 1.8 at zero decimals
     * would render 2, 2, 2, 3 — four frames holding two values. Borrowing the
     * floor's precision gives a real count (1.8x, 2.1x, 2.6x...) and the final
     * frame below restores the written form.
     */
    const decimals = Math.max(decimalsOf(match[0]), decimalsOf(String(from)));

    // A floor above the target would count downward. Guard rather than trust
    // the call sites, since the two numbers live in different files.
    const start = Number.isFinite(from) ? Math.min(from, target) : 0;

    const targetIsWhole = decimalsOf(match[0]) === 0;

    const render = (n: number) => {
      let text = n.toFixed(decimals);
      // Borrowing the floor's precision (above) means "3x" counted from 1.8
      // would spend its last frames reading "3.0x" before snapping to "3x" —
      // a format change on the figure the eye has settled on. When the written
      // value carries no decimal, no whole number on the way to it does either.
      if (targetIsWhole) text = text.replace(/\.0+$/, "");
      el.textContent = prefix + text + suffix;
    };

    /**
     * Reduced motion gets the figure, not the performance. Counting numbers are
     * a vestibular trigger, and this is the site's proof — it has to be
     * readable by everyone, so the animation is skipped rather than shortened.
     */
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.textContent = value;
      return;
    }

    render(start);

    let rafId = 0;
    let timerId: ReturnType<typeof setTimeout> | undefined;
    let startedAt: number | null = null;

    const step = (now: number) => {
      startedAt ??= now;
      const progress = duration > 0 ? Math.min((now - startedAt) / duration, 1) : 1;

      if (progress < 1) {
        const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
        render(start + (target - start) * eased);
        rafId = requestAnimationFrame(step);
      } else {
        // The written string, not a re-formatted number: this is what keeps
        // "3x" from landing as "3.0x" and "$50M+" from losing its suffix to a
        // floating-point remainder.
        el.textContent = value;
      }
    };

    const run = () => {
      timerId = setTimeout(() => {
        rafId = requestAnimationFrame(step);
      }, delay);
    };

    if (!scrollTrigger) {
      run();
      return () => {
        clearTimeout(timerId);
        cancelAnimationFrame(rafId);
      };
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        // Disconnected on the first crossing, so scrolling back up and down
        // again never restarts the count.
        observer.disconnect();
        run();
      },
      { threshold: 0.5 },
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      clearTimeout(timerId);
      cancelAnimationFrame(rafId);
    };
  }, [value, from, duration, delay, scrollTrigger]);

  return <span ref={ref} className={className} />;
}
