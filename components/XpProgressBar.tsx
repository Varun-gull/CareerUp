"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { rankBonuses } from "@/lib/gamification";
import { getRankProgress, ranks } from "@/lib/rank";

export function XpProgressBar({ xp }: { xp: number }) {
  const progress = getRankProgress(xp);
  const [open, setOpen] = useState(false);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  function toggle() {
    if (!open && btnRef.current) setRect(btnRef.current.getBoundingClientRect());
    setOpen((o) => !o);
  }

  useEffect(() => {
    if (!open) return;
    function update() {
      if (btnRef.current) setRect(btnRef.current.getBoundingClientRect());
    }
    function handleClickOutside(e: MouseEvent) {
      if (btnRef.current && !btnRef.current.contains(e.target as Node)) setOpen(false);
    }
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const dropdown = open && rect ? createPortal(
    <div
      style={{
        position: "fixed",
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
        zIndex: 9999,
        width: 256,
      }}
      className="rounded-3xl border border-slate-200 bg-white/95 p-3 shadow-strong backdrop-blur-xl"
    >
      <div className="grid gap-2">
        {ranks.map((rank) => (
          <div key={rank.name} className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-3 py-2">
            <span className="text-sm font-bold text-ink">{rank.name}</span>
            <span className="text-right text-xs font-bold text-slate-600">
              {rank.minXp.toLocaleString()} XP
              {rankBonuses.some((b) => b.rankName === rank.name) && (
                <span className="block text-brand">+{rankBonuses.find((b) => b.rankName === rank.name)?.xp} bonus</span>
              )}
            </span>
          </div>
        ))}
      </div>
    </div>,
    document.body
  ) : null;

  return (
    <section className="card p-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-slate-500">Rank progress</p>
          <h2 className="mt-1 text-2xl font-bold text-ink">{xp.toLocaleString()} XP</h2>
        </div>
        <p className="rounded-full bg-sky/10 px-3 py-1 text-sm font-bold text-sky-600 ring-1 ring-sky/20">
          {progress.next ? `${progress.remaining} XP to ${progress.next.name}` : "Max rank unlocked"}
        </p>
      </div>
      <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100 ring-1 ring-slate-200">
        <div className="game-bar-fill" style={{ width: `${progress.percent}%` }} />
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-bold text-slate-600">{progress.current.name}</p>
        <button
          ref={btnRef}
          type="button"
          onClick={toggle}
          className="cursor-pointer rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-sky-600 transition hover:border-sky/40 hover:bg-slate-100"
        >
          Show all ranks
        </button>
        {dropdown}
      </div>
    </section>
  );
}
