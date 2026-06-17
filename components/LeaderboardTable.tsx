import { Flame } from "lucide-react";
import { RankBadge } from "./RankBadge";
import type { LeaderboardUser } from "@/lib/types";

export function LeaderboardTable({ users }: { users: LeaderboardUser[] }) {
  const sorted = [...users].sort((a, b) => b.xp - a.xp);

  return (
    <div className="card overflow-hidden">
      <div className="grid grid-cols-[56px_1fr_100px] gap-4 border-b border-slate-100 bg-slate-50 px-5 py-3 text-xs font-black uppercase text-slate-500 sm:grid-cols-[56px_1fr_150px_110px]">
        <span>#</span>
        <span>Player</span>
        <span>XP</span>
        <span className="hidden sm:block">Streak</span>
      </div>
      {sorted.map((user, index) => (
        <div
          key={user.id}
          className="grid grid-cols-[56px_1fr_100px] gap-4 border-b border-slate-100 px-5 py-4 last:border-0 sm:grid-cols-[56px_1fr_150px_110px]"
        >
          <span className="text-lg font-black text-slate-400">{index + 1}</span>
          <div>
            <p className="font-black text-ink">{user.name}</p>
            <p className="text-sm text-slate-500">{user.school}</p>
          </div>
          <div className="space-y-2">
            <p className="font-black text-blue-700">{user.xp.toLocaleString()} XP</p>
            <RankBadge xp={user.xp} />
          </div>
          <span className="hidden items-center gap-1 font-bold text-slate-600 sm:inline-flex">
            <Flame size={16} className="text-blue-600" /> {user.streak} days
          </span>
        </div>
      ))}
    </div>
  );
}
