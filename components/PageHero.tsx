import Link from "next/link";
import clsx from "clsx";
import type { ReactNode } from "react";

export type HeroTab = { label: string; href: string; active?: boolean };

export function PageHero({
  eyebrow,
  title,
  description,
  tabs,
  actions,
  compact = false,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  tabs?: HeroTab[];
  actions?: ReactNode;
  compact?: boolean;
}) {
  return (
    <section
      className={clsx(
        "hero-3d relative overflow-hidden rounded-[2rem] text-white shadow-strong",
        compact ? "min-h-[13rem]" : "min-h-[30rem]"
      )}
    >
      <div className="absolute inset-0 bg-[linear-gradient(145deg,#08275b_0%,#0f4e9a_42%,#62c4ff_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_8%,rgba(191,219,254,0.42),transparent_24rem),radial-gradient(circle_at_8%_92%,rgba(125,211,252,0.22),transparent_22rem)]" />

      <div className={clsx("relative flex h-full flex-col", compact ? "min-h-[13rem]" : "min-h-[30rem]")}>
        {eyebrow && (
          <div className="flex items-center justify-between px-6 pt-5">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/12 px-3.5 py-1.5 text-xs font-semibold text-blue-50 ring-1 ring-white/15 backdrop-blur">
              {eyebrow}
            </span>
            {actions && <div className="flex items-center gap-2">{actions}</div>}
          </div>
        )}

        <div className="flex flex-1 flex-col items-center justify-center px-6 py-10 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">{title}</h1>
          {description && (
            <p className="mt-4 max-w-3xl text-sm font-medium leading-6 text-blue-50/90 sm:text-base">{description}</p>
          )}
          {tabs && tabs.length > 0 && (
            <nav className="mt-7 flex flex-wrap items-center justify-center gap-1.5 rounded-2xl bg-white/12 p-1.5 ring-1 ring-white/15 backdrop-blur">
              {tabs.map((tab) => (
                <Link
                  key={tab.href + tab.label}
                  href={tab.href}
                  aria-current={tab.active ? "page" : undefined}
                  className={clsx(
                    "rounded-xl px-4 py-2 text-sm font-semibold transition",
                    tab.active ? "bg-white text-[#0b2f64] shadow-sm" : "text-blue-50 hover:bg-white/10 hover:text-white"
                  )}
                >
                  {tab.label}
                </Link>
              ))}
            </nav>
          )}
        </div>
      </div>
    </section>
  );
}
