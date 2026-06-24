import { Flame, ShieldCheck } from "lucide-react";
import { unlockStreakRevive } from "@/lib/applications/actions";

export function StreakCard({
  streak,
  xp,
  freeReviveUsed,
  paidRevives,
  reviveRequiredApplications,
}: {
  streak: number;
  xp: number;
  freeReviveUsed: boolean;
  paidRevives: number;
  reviveRequiredApplications: number;
}) {
  const hasFreeRevive = !freeReviveUsed;
  const canUnlockPaidRevive = freeReviveUsed && xp >= 250;
  const reviveHelper = hasFreeRevive
    ? "Your first streak revive is free. If you miss a day, apply to 1 role that day to restore it."
    : paidRevives > 0
      ? "Paid revive ready. Apply to 2 roles in one day after a miss to restore your streak."
      : "Your free revive has been used. Unlock another for 250 XP when you want a backup.";

  return (
    <section className="card bg-ink p-5 text-white">
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-blue-600">
          <Flame size={28} />
        </div>
        <div>
          <p className="text-sm font-bold text-blue-200">Current streak</p>
          <p className="text-3xl font-black">{streak} days</p>
        </div>
      </div>
      <p className="mt-5 text-sm leading-6 text-slate-300">Apply to at least one role each day to keep the streak alive.</p>
      <div className="mt-4 rounded-lg border border-white/10 bg-white/5 p-3">
        <div className="flex items-center gap-2 text-sm font-black text-blue-100">
          <ShieldCheck size={16} /> Streak revive
        </div>
        <p className="mt-2 text-sm leading-6 text-slate-300">{reviveHelper}</p>
        {reviveRequiredApplications > 0 && (
          <p className="mt-2 rounded-lg bg-blue-600/20 px-3 py-2 text-xs font-black text-blue-100">
            Revive in progress: apply to {reviveRequiredApplications} roles today.
          </p>
        )}
        <div className="mt-3 flex flex-wrap gap-2 text-xs font-black text-blue-100">
          <span className="rounded-full bg-white/10 px-3 py-1">Free: {hasFreeRevive ? "available" : "used"}</span>
          <span className="rounded-full bg-white/10 px-3 py-1">Paid: {paidRevives}</span>
        </div>
        {freeReviveUsed && (
          <form action={unlockStreakRevive} className="mt-3">
            <button
              type="submit"
              disabled={!canUnlockPaidRevive}
              className="w-full rounded-lg bg-white px-3 py-2 text-sm font-black text-ink transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:bg-white/20 disabled:text-slate-400"
            >
              Unlock revive - 250 XP
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
