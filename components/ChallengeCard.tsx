import { CheckCircle2, Crown, Gem, Medal, Trophy } from "lucide-react";
import clsx from "clsx";
import type { LucideIcon } from "lucide-react";
import type { Challenge } from "@/lib/types";

const TIER_LABELS = ["", "Bronze", "Silver", "Gold", "Platinum", "Diamond"];
const TIER_COLORS = [
  "",
  "text-[#7A5438] bg-[#E2D2BF] ring-[#B8A99A]/35",
  "text-slate-500 bg-slate-100 ring-slate-300",
  "text-yellow-600 bg-yellow-50 ring-yellow-200",
  "text-sky-600 bg-sky-50 ring-sky-200",
  "text-violet-600 bg-violet-50 ring-violet-200",
];
const TIER_ICONS: (LucideIcon | null)[] = [null, Medal, Medal, Medal, Gem, Crown];

export function ChallengeCard({ challenge }: { challenge: Challenge }) {
  const percent = Math.min(100, Math.round((challenge.progress / challenge.target) * 100));
  const isTiered = challenge.tier !== undefined;
  const completedTier = challenge.completed && isTiered ? challenge.tier! - 1 : null;
  const CompletedTierIcon = completedTier !== null ? TIER_ICONS[completedTier] : null;

  return (
    <article className={clsx("card p-5 transition hover:-translate-y-1 hover:shadow-strong", challenge.completed && "ring-2 ring-emerald-400/60")}>
      <div className="flex items-start justify-between gap-4">
        <div className={clsx("flex h-11 w-11 items-center justify-center rounded-2xl shadow-sm", challenge.completed ? "bg-emerald-500" : "bg-[#7A5438] text-white")}>
          {challenge.completed
            ? (CompletedTierIcon ? <CompletedTierIcon size={22} className="text-white" /> : <CheckCircle2 size={22} className="text-white" />)
            : <Trophy size={22} />}
        </div>
        <div className="flex items-center gap-2">
          {isTiered && challenge.tier !== undefined && !challenge.completed && (
            <span className={clsx("rounded-full px-2.5 py-1 text-xs font-bold ring-1", TIER_COLORS[challenge.tier])}>
              {TIER_LABELS[challenge.tier]}
            </span>
          )}
          {challenge.completed ? (
            <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600 ring-1 ring-emerald-200">
              <CheckCircle2 size={12} /> Completed
            </span>
          ) : (
            <span className="rounded-full bg-[#E2D2BF] px-3 py-1 text-xs font-bold text-[#7A5438] ring-1 ring-[#B8A99A]/35">+{challenge.xp} XP</span>
          )}
        </div>
      </div>

      <h3 className="mt-4 text-lg font-bold text-ink">{challenge.title}</h3>

      {isTiered && challenge.tier !== undefined && challenge.totalTiers !== undefined && (
        <div className="mt-1.5 flex gap-1">
          {Array.from({ length: challenge.totalTiers }).map((_, i) => {
            const tierNum = i + 1;
            const isDone = challenge.completed ? tierNum <= challenge.tier! : tierNum < challenge.tier!;
            const isActive = tierNum === challenge.tier;
            return (
              <div
                key={i}
                className={clsx("h-1 flex-1 rounded-full", {
                  "bg-emerald-400": isDone,
                  "bg-sky": isActive,
                  "bg-slate-200": !isDone && !isActive,
                })}
              />
            );
          })}
        </div>
      )}

      <p className="mt-2 text-sm leading-6 text-slate-600">{challenge.description}</p>

      <div className="mt-5">
        <div className="mb-2 flex justify-between text-xs font-bold text-slate-600">
          <span>Progress</span>
          <span>
            {challenge.progress.toLocaleString()}/{challenge.target.toLocaleString()}
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-100 ring-1 ring-slate-200">
          <div
            className={clsx(challenge.completed ? "h-full rounded-full bg-emerald-500" : "game-bar-fill")}
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    </article>
  );
}
