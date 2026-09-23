"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import type { ReactNode } from "react";

/**
 * Three small pieces of page behaviour that belong together:
 *
 * 1. Route changes replay an arrival animation, so moving between sections
 *    feels like a transition rather than a repaint.
 * 2. Sections that start below the fold fade up as you reach them. Anything
 *    already on screen is left alone — it has the load-time boot sequence.
 * 3. The document carries a `data-scrolled` flag once the page has moved, which
 *    the top bar and the dock use to lift off the content.
 */
export function ShellMotion({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    let queued = false;
    let lastY = window.scrollY;

    function syncScrolled() {
      if (queued) return;
      queued = true;
      window.setTimeout(() => {
        queued = false;
        const y = window.scrollY;
        const delta = y - lastY;

        root.dataset.scrolled = y > 8 ? "true" : "false";

        // Only commit to a direction once the move is deliberate, so the dock
        // does not flicker on small corrections.
        if (Math.abs(delta) > 12) {
          root.dataset.reading = delta > 0 && y > 220 ? "true" : "false";
          lastY = y;
        }
      }, 80);
    }

    syncScrolled();
    window.addEventListener("scroll", syncScrolled, { passive: true });

    return () => {
      window.removeEventListener("scroll", syncScrolled);
    };
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let observer: IntersectionObserver | null = null;

    // A timer rather than requestAnimationFrame: rAF is suspended while the
    // page is hidden, which would leave the reveal permanently unarmed.
    const timer = window.setTimeout(() => {
      const shell = document.querySelector("main.page-shell");

      if (!shell) {
        return;
      }

      /**
       * Pick reveal targets at a useful size. A page section that is taller
       * than most of the viewport is really a list, so we step inside it and
       * reveal its items instead — that is what makes a long results page feel
       * like it is arriving rather than one slab appearing. Tables are left
       * whole, since their children are rows.
       */
      function collect(parent: Element, depth: number): HTMLElement[] {
        const found: HTMLElement[] = [];

        for (const child of Array.from(parent.children)) {
          if (!(child instanceof HTMLElement)) continue;
          if (child.dataset.revealSkip === "true") continue;

          const isTable = /^(TABLE|THEAD|TBODY|TR)$/.test(child.tagName);
          const tall = child.getBoundingClientRect().height > window.innerHeight * 0.6;

          if (!isTable && depth < 2 && tall && child.children.length > 1) {
            found.push(...collect(child, depth + 1));
          } else {
            found.push(child);
          }
        }

        return found;
      }

      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting && entry.target instanceof HTMLElement) {
              entry.target.dataset.reveal = "shown";
              observer?.unobserve(entry.target);
            }
          }
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.04 }
      );

      const fold = window.innerHeight - 40;
      let staged = 0;

      for (const target of collect(shell, 0)) {
        // Already on screen at load: leave it to the boot sequence.
        if (target.getBoundingClientRect().top < fold) continue;

        target.dataset.reveal = "hidden";
        target.style.transitionDelay = `${Math.min(staged, 4) * 60}ms`;
        staged += 1;
        observer.observe(target);
      }
    }, 0);

    return () => {
      window.clearTimeout(timer);
      observer?.disconnect();
    };
  }, [pathname]);

  return (
    <div key={pathname} className="page-enter min-w-0">
      {children}
    </div>
  );
}
