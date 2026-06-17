import { Flame } from "lucide-react";

export function StreakCard({ streak }: { streak: number }) {
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
      <p className="mt-5 text-sm leading-6 text-slate-300">Apply, save, or update a role daily to keep the streak alive.</p>
    </section>
  );
}
