"use client";

import { useEffect, useLayoutEffect, useRef } from "react";

/**
 * useLayoutEffect on the client, useEffect on the server.
 *
 * The distinction is load bearing here, not a lint appeasement. The span now
 * ships its finished figure in the server HTML (see the return below), so
 * whatever writes the count-up's starting value has to do it before the browser
 * paints the hydrated tree - otherwise the number visibly rewinds from "$50M+"
 * to "$0" in front of the reader. useLayoutEffect runs synchronously after DOM
 * mutation and before paint, which is exactly that window. useEffect does not.
 *
 * React warns that useLayoutEffect does nothing during server rendering, which
 * is true and harmless, so the server gets useEffect instead. The branch is on
 * `typeof window`, evaluated once at module scope, so it is constant per
 * environment and never changes hook order within one.
 */
const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

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

  useIsomorphicLayoutEffect(() => {
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
      const progress =
        duration > 0 ? Math.min((now - startedAt) / duration, 1) : 1;

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

  /**
   * The figure is rendered as real text, not written in by the effect.
   *
   * This span used to be self-closing, which meant every headline number on the
   * site — $50M+ in revenue, 1000+ ads delivered, 3x peak ROAS — existed only
   * after hydration. The labels beside them were in the HTML; the numbers were
   * not. On a site whose entire brief is SEO, and whose own meta description
   * quotes these figures, the proof was the one part a crawler without a
   * JavaScript engine could not read, and a reader with JavaScript off saw four
   * empty gaps where the results should be.
   *
   * Rendering {value} makes the finished figure the document's actual content.
   * The effect above then overwrites it with the count-up, which is the reason
   * that effect has to run before paint rather than after it.
   */
  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  );
}
