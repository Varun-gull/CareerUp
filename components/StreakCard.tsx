import { ShieldCheck, Zap } from "lucide-react";
import { unlockStreakRevive } from "@/lib/applications/actions";

export function StreakCard({
  streak,
  xp,
  streakBroken,
  freeReviveUsed,
  paidRevives,
  reviveRequiredApplications,
}: {
  streak: number;
  xp: number;
  streakBroken: boolean;
  freeReviveUsed: boolean;
  paidRevives: number;
  reviveRequiredApplications: number;
}) {
  const hasFreeRevive = !freeReviveUsed;
  const canUnlockPaidRevive = freeReviveUsed && xp >= 250;
  const showReviveInfo = streakBroken || reviveRequiredApplications > 0;
  const reviveHelper = hasFreeRevive
    ? "Your first streak revive is free. If you miss a day, apply to 1 role that day to restore it."
    : paidRevives > 0
      ? "Paid revive ready. Apply to 2 roles in one day after a miss to restore your streak."
      : "Your free revive has been used. Unlock another for 250 XP when you want a backup.";

  return (
    <section className="relative overflow-hidden rounded-lg border border-purple-200 bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 p-5 text-white shadow-soft">
      <div className="pointer-events-none absolute -right-12 -top-14 h-36 w-36 rounded-full bg-purple-500/20 blur-2xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-20 w-full bg-gradient-to-r from-purple-600/15 to-transparent" />

      <div className="relative flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-purple-800 shadow-lg shadow-purple-950/30">
          <Zap size={32} fill="currentColor" />
        </div>
        <div>
          <p className="text-sm font-black uppercase tracking-wide text-purple-200">Current streak</p>
          <p className="text-4xl font-black leading-none">{streak} days</p>
        </div>
      </div>

      <div className="relative mt-5 rounded-lg border border-white/10 bg-white/10 p-3">
        <p className="text-sm font-bold leading-6 text-purple-50">
          {streak > 0 ? "You are charged up. Apply to one role today to keep the streak alive." : "Start the streak by applying to one role today."}
        </p>
      </div>

      {showReviveInfo && (
        <div className="relative mt-4 rounded-lg border border-white/10 bg-white/5 p-3">
          <div className="flex items-center gap-2 text-sm font-black text-purple-100">
            <ShieldCheck size={16} /> Streak revive
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-300">{reviveHelper}</p>
          {reviveRequiredApplications > 0 && (
            <p className="mt-2 rounded-lg bg-purple-700/20 px-3 py-2 text-xs font-black text-purple-100">
              Revive in progress: apply to {reviveRequiredApplications} roles today.
            </p>
          )}
          <div className="mt-3 flex flex-wrap gap-2 text-xs font-black text-purple-100">
            <span className="rounded-full bg-white/10 px-3 py-1">Free: {hasFreeRevive ? "available" : "used"}</span>
            <span className="rounded-full bg-white/10 px-3 py-1">Paid: {paidRevives}</span>
          </div>
          {freeReviveUsed && (
            <form action={unlockStreakRevive} className="mt-3">
              <button
                type="submit"
                disabled={!canUnlockPaidRevive}
                className="w-full rounded-lg bg-white px-3 py-2 text-sm font-black text-ink transition hover:bg-purple-50 disabled:cursor-not-allowed disabled:bg-white/20 disabled:text-slate-400"
              >
                Unlock revive - 250 XP
              </button>
            </form>
          )}
        </div>
      )}
    </section>
  );
}
