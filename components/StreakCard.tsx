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
    <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-5 text-white shadow-soft">
      <div className="pointer-events-none absolute bottom-0 left-0 h-20 w-full bg-gradient-to-r from-gold/10 to-transparent" />

      <div className="relative flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gold text-slate-950 shadow-lg shadow-gold/10">
          <Zap size={32} fill="currentColor" />
        </div>
        <div>
          <p className="text-sm font-bold uppercase text-gold">Current streak</p>
          <p className="text-4xl font-bold leading-none">{streak} days</p>
        </div>
      </div>

      <div className="relative mt-5 rounded-2xl border border-slate-200 bg-slate-50/90 p-3">
        <p className="text-sm font-bold leading-6 text-slate-700">
          {streak > 0 ? "You are charged up. Apply to one role today to keep the streak alive." : "Start the streak by applying to one role today."}
        </p>
      </div>

      {showReviveInfo && (
        <div className="relative mt-4 rounded-2xl border border-slate-200 bg-slate-50/90 p-3">
          <div className="flex items-center gap-2 text-sm font-bold text-amber-700">
            <ShieldCheck size={16} /> Streak revive
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-700">{reviveHelper}</p>
          {reviveRequiredApplications > 0 && (
            <p className="mt-2 rounded-xl bg-gold/10 px-3 py-2 text-xs font-bold text-amber-700">
              Revive in progress: apply to {reviveRequiredApplications} roles today.
            </p>
          )}
          <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold text-slate-700">
            <span className="rounded-full bg-slate-100 px-3 py-1">Free: {hasFreeRevive ? "available" : "used"}</span>
            <span className="rounded-full bg-slate-100 px-3 py-1">Paid: {paidRevives}</span>
          </div>
          {freeReviveUsed && (
            <form action={unlockStreakRevive} className="mt-3">
              <button
                type="submit"
                disabled={!canUnlockPaidRevive}
                className="w-full rounded-xl bg-gold px-3 py-2 text-sm font-bold text-slate-950 transition hover:bg-brand disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
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
