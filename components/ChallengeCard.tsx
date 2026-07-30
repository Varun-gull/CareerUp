import { CheckCircle2, Crown, Gem, Medal, Trophy } from "lucide-react";
import clsx from "clsx";
import type { LucideIcon } from "lucide-react";
import { getRewardPointsForXp } from "@/lib/gamification";
import type { Challenge } from "@/lib/types";

const TIER_LABELS = ["", "Bronze", "Silver", "Gold", "Platinum", "Diamond"];
const TIER_COLORS = [
  "",
  "text-[#2A6384] bg-[#EAF2F8] ring-[#5E7681]/30",
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
  const rewardPoints = getRewardPointsForXp(challenge.xp);

  return (
    <article className={clsx("card card-interactive p-5", challenge.completed && "ring-2 ring-emerald-400/60")}>
      <div className="flex items-start justify-between gap-4">
        <div className={clsx("flex h-11 w-11 items-center justify-center rounded-2xl shadow-sm", challenge.completed ? "bg-emerald-500" : "bg-[#2A6384] text-white")}>
          {challenge.completed
            ? (CompletedTierIcon ? <CompletedTierIcon size={22} className="text-white" /> : <CheckCircle2 size={22} className="text-white" />)
            : <Trophy size={22} />}
        </div>
        <div className="flex items-center gap-2">
          {isTiered && challenge.tier !== undefined && !challenge.completed && (
            <span className={clsx("rounded-full px-2.5 py-1 text-xs font-semibold ring-1", TIER_COLORS[challenge.tier])}>
              {TIER_LABELS[challenge.tier]}
            </span>
          )}
          {challenge.completed ? (
            <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600 ring-1 ring-emerald-200">
              <CheckCircle2 size={12} /> Completed
            </span>
          ) : (
            <span className="metric rounded-full bg-[#EAF2F8] px-3 py-1 text-xs font-semibold text-[#2A6384] ring-1 ring-[#5E7681]/30">+{challenge.xp} XP +{rewardPoints} RP</span>
          )}
        </div>
      </div>

      <h3 className="mt-4 font-display text-lg font-bold tracking-tight text-ink">{challenge.title}</h3>

      {isTiered && challenge.tier !== undefined && challenge.totalTiers !== undefined && (
        <div className="mt-2 flex gap-1" aria-label={`Tier ${challenge.tier} of ${challenge.totalTiers}`}>
          {Array.from({ length: challenge.totalTiers }).map((_, i) => {
            const tierNum = i + 1;
            const isDone = challenge.completed ? tierNum <= challenge.tier! : tierNum < challenge.tier!;
            const isActive = tierNum === challenge.tier;
            return (
              <div
                key={i}
                className={clsx("h-1 flex-1 origin-left rounded-full", {
                  "bg-emerald-400": isDone,
                  "bg-[#2A6384]": isActive,
                  "bg-slate-200": !isDone && !isActive,
                })}
              />
            );
          })}
        </div>
      )}

      <p className="mt-2 text-sm leading-6 text-slate-600">{challenge.description}</p>

      <div className="mt-5">
        <div className="mb-2 flex justify-between text-xs text-slate-600">
          <span className="font-semibold">Progress</span>
          <span className="metric font-semibold">
            {challenge.progress.toLocaleString()}/{challenge.target.toLocaleString()}
          </span>
        </div>
        <div className="meter-track h-2">
          <div
            className={clsx("game-bar-fill", challenge.completed && "!bg-emerald-500")}
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    </article>
  );
}
