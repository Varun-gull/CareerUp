"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

/**
 * A number that ticks up to its value on mount, and re-ticks whenever the
 * value changes — so earning XP or sending an application reads as movement
 * rather than a silent swap. Renders the true value on the server, respects
 * reduced motion, and holds a fixed digit pitch so nothing reflows mid-count.
 */
export function Metric({
  value,
  className,
  duration = 900,
  delay = 220
}: {
  value: number;
  className?: string;
  duration?: number;
  delay?: number;
}) {
  const [display, setDisplay] = useState(value);
  const fromRef = useRef(0);
  const isFirstRun = useRef(true);

  useEffect(() => {
    const target = value;
    const from = isFirstRun.current ? 0 : fromRef.current;
    isFirstRun.current = false;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion || from === target || duration <= 0) {
      fromRef.current = target;
      setDisplay(target);
      return;
    }

    let frame = 0;
    let startedAt = 0;

    function step(now: number) {
      if (!startedAt) startedAt = now;
      const progress = Math.min(1, (now - startedAt) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(from + (target - from) * eased));

      if (progress < 1) {
        frame = requestAnimationFrame(step);
      } else {
        fromRef.current = target;
      }
    }

    setDisplay(from);
    const timer = window.setTimeout(() => {
      frame = requestAnimationFrame(step);
    }, delay);

    return () => {
      window.clearTimeout(timer);
      cancelAnimationFrame(frame);
    };
  }, [value, duration, delay]);

  return <span className={clsx("metric", className)}>{display.toLocaleString()}</span>;
}
