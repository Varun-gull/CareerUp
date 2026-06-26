import { getRankProgress, ranks } from "@/lib/rank";

export function XpProgressBar({ xp }: { xp: number }) {
  const progress = getRankProgress(xp);

  return (
    <section className="card p-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-slate-500">Rank progress</p>
          <h2 className="mt-1 text-2xl font-black text-ink">{xp.toLocaleString()} XP</h2>
        </div>
        <p className="rounded-full bg-sky/10 px-3 py-1 text-sm font-black text-sky ring-1 ring-sky/20">
          {progress.next ? `${progress.remaining} XP to ${progress.next.name}` : "Max rank unlocked"}
        </p>
      </div>
      <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100 ring-1 ring-slate-200">
        <div className="h-full rounded-full bg-gradient-to-r from-sky via-electric to-brand" style={{ width: `${progress.percent}%` }} />
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-bold text-slate-600">{progress.current.name}</p>
        <details className="relative">
          <summary className="cursor-pointer list-none rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-black text-sky transition hover:border-sky/40 hover:bg-slate-100">
            Show all ranks
          </summary>
          <div className="absolute right-0 z-20 mt-2 w-64 rounded-3xl border border-slate-200 bg-white/95 p-3 shadow-strong backdrop-blur-xl">
            <div className="grid gap-2">
              {ranks.map((rank) => (
                <div key={rank.name} className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-3 py-2">
                  <span className="text-sm font-black text-ink">{rank.name}</span>
                  <span className="text-xs font-bold text-slate-600">{rank.minXp.toLocaleString()} XP</span>
                </div>
              ))}
            </div>
          </div>
        </details>
      </div>
    </section>
  );
}
