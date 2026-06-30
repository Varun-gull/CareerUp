import { CheckCircle2, Trophy } from "lucide-react";
import clsx from "clsx";
import type { Challenge } from "@/lib/types";

const tierConfig = {
  bronze: {
    icon: "🥉",
    badge: "Bronze",
    iconBg: "bg-gradient-to-br from-amber-600 to-orange-500",
    badgeBg: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
    bar: "bg-gradient-to-r from-amber-400 to-orange-400",
  },
  silver: {
    icon: "🥈",
    badge: "Silver",
    iconBg: "bg-gradient-to-br from-slate-400 to-slate-500",
    badgeBg: "bg-slate-100 text-slate-600 ring-1 ring-slate-300",
    bar: "bg-gradient-to-r from-slate-400 to-slate-500",
  },
  gold: {
    icon: "🥇",
    badge: "Gold",
    iconBg: "bg-gradient-to-br from-yellow-400 to-amber-500",
    badgeBg: "bg-yellow-50 text-yellow-700 ring-1 ring-yellow-200",
    bar: "bg-gradient-to-r from-yellow-400 to-amber-500",
  },
} as const;

export function ChallengeCard({ challenge }: { challenge: Challenge }) {
  const percent = Math.min(100, Math.round((challenge.progress / challenge.target) * 100));
  const tier = challenge.tier ? tierConfig[challenge.tier] : null;
  // Strip " — Bronze/Silver/Gold" suffix from displayed title
  const displayTitle = challenge.title.replace(/\s*—\s*(Bronze|Silver|Gold)$/i, "");

  return (
    <article className="card p-5 transition hover:-translate-y-1 hover:shadow-strong">
      <div className="flex items-start justify-between gap-4">
        <div className={clsx(
          "flex h-11 w-11 items-center justify-center rounded-2xl text-slate-950 shadow-glow",
          tier ? tier.iconBg : "bg-gradient-to-br from-sky to-electric"
        )}>
          {challenge.completed
            ? <CheckCircle2 size={22} />
            : tier
              ? <span className="text-xl leading-none">{tier.icon}</span>
              : <Trophy size={22} />
          }
        </div>
        <div className="flex items-center gap-2">
          {tier && (
            <span className={clsx("rounded-full px-2.5 py-0.5 text-xs font-black", tier.badgeBg)}>
              {tier.badge}
            </span>
          )}
          <span className="rounded-full bg-sky/10 px-3 py-1 text-xs font-black text-sky ring-1 ring-sky/20">+{challenge.xp} XP</span>
        </div>
      </div>
      <h3 className="mt-4 text-lg font-black text-ink">{displayTitle}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{challenge.description}</p>
      <div className="mt-5">
        <div className="mb-2 flex justify-between text-xs font-bold text-slate-600">
          <span>Progress</span>
          <span>{challenge.progress}/{challenge.target}</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-100 ring-1 ring-slate-200">
          <div
            className={clsx(
              "h-full rounded-full",
              challenge.completed
                ? "bg-emerald-500"
                : tier
                  ? tier.bar
                  : "bg-gradient-to-r from-brand via-electric to-sky"
            )}
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    </article>
  );
}
