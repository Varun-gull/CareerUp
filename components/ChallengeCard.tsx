import { CheckCircle2, Trophy } from "lucide-react";
import clsx from "clsx";
import type { Challenge } from "@/lib/types";

export function ChallengeCard({ challenge }: { challenge: Challenge }) {
  const percent = Math.min(100, Math.round((challenge.progress / challenge.target) * 100));

  return (
    <article className="card p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand text-white">
          {challenge.completed ? <CheckCircle2 size={22} /> : <Trophy size={22} />}
        </div>
        <span className="rounded-full bg-ink px-3 py-1 text-xs font-black text-white">+{challenge.xp} XP</span>
      </div>
      <h3 className="mt-4 text-lg font-black text-ink">{challenge.title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{challenge.description}</p>
      <div className="mt-5">
        <div className="mb-2 flex justify-between text-xs font-bold text-slate-500">
          <span>Progress</span>
          <span>
            {challenge.progress}/{challenge.target}
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className={clsx("h-full rounded-full", challenge.completed ? "bg-emerald-500" : "bg-brand")}
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    </article>
  );
}
