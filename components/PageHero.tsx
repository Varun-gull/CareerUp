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
        compact ? "min-h-[13rem]" : "min-h-[17rem]"
      )}
    >
      <div className="absolute inset-0 bg-[linear-gradient(150deg,#28464b_0%,#3d6a6b_45%,#7ba6a4_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_8%,rgba(226,240,238,0.30),transparent_24rem),radial-gradient(circle_at_10%_95%,rgba(16,185,129,0.14),transparent_20rem)]" />

      <div className={clsx("relative flex h-full flex-col", compact ? "min-h-[13rem]" : "min-h-[17rem]")}>
        {eyebrow && (
          <div className="flex items-center justify-between px-6 pt-5">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-sky-100 ring-1 ring-white/15 backdrop-blur">
              {eyebrow}
            </span>
            {actions && <div className="flex items-center gap-2">{actions}</div>}
          </div>
        )}

        <div className="flex flex-1 flex-col items-center justify-center px-6 py-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{title}</h1>
          {description && (
            <p className="mt-3 max-w-2xl text-sm font-medium leading-6 text-slate-300 sm:text-base">{description}</p>
          )}
        </div>

        {tabs && tabs.length > 0 && (
          <div className="flex justify-center px-6 pb-5">
            <nav className="flex flex-wrap items-center justify-center gap-1.5 rounded-2xl bg-white/10 p-1.5 ring-1 ring-white/15 backdrop-blur">
              {tabs.map((tab) => (
                <Link
                  key={tab.href + tab.label}
                  href={tab.href}
                  aria-current={tab.active ? "page" : undefined}
                  className={clsx(
                    "rounded-xl px-4 py-2 text-sm font-semibold transition",
                    tab.active ? "bg-white text-slate-950 shadow-sm" : "text-slate-200 hover:bg-white/10 hover:text-white"
                  )}
                >
                  {tab.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </section>
  );
}
