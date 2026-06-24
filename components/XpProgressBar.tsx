import { getRankProgress } from "@/lib/rank";

export function XpProgressBar({ xp }: { xp: number }) {
  const progress = getRankProgress(xp);

  return (
    <section className="card p-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-slate-500">Rank progress</p>
          <h2 className="mt-1 text-2xl font-black text-ink">{xp.toLocaleString()} XP</h2>
        </div>
        <p className="text-sm font-bold text-brand">
          {progress.next ? `${progress.remaining} XP to ${progress.next.name}` : "Max rank unlocked"}
        </p>
      </div>
      <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-brand" style={{ width: `${progress.percent}%` }} />
      </div>
      <p className="mt-3 text-sm text-slate-500">{progress.current.name}</p>
    </section>
  );
}
