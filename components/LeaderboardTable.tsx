import { Flame, Medal, UserPlus } from "lucide-react";
import Link from "next/link";
import { RankBadge } from "./RankBadge";
import type { LeaderboardUser } from "@/lib/types";

export function LeaderboardTable({ users, currentUserId, emptyMode = "global" }: { users: LeaderboardUser[]; currentUserId?: string; emptyMode?: "global" | "friends" }) {
  const sorted = [...users].sort((a, b) => b.xp - a.xp);

  if (sorted.length === 0) {
    return (
      <div className="card p-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-purple-50 text-purple-800">
          <UserPlus size={22} />
        </div>
        <h2 className="mt-4 text-2xl font-black text-ink">{emptyMode === "friends" ? "No friends on the board yet" : "No leaderboard data yet"}</h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
          {emptyMode === "friends" ? "Add a friend, accept a request, and this board will turn into your personal competition." : "Once students start earning XP, rankings will appear here."}
        </p>
        {emptyMode === "friends" && (
          <Link href="/friends" className="primary-button mt-5">
            Add friends
          </Link>
        )}
      </div>
    );
  }

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
          <span className="flex items-center gap-1 text-lg font-black text-slate-400">
            {index < 3 && <Medal size={16} className={index === 0 ? "text-amber-500" : index === 1 ? "text-slate-400" : "text-orange-500"} />}
            {index + 1}
          </span>
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-white">
              {user.schoolLogoUrl ? (
                <img src={user.schoolLogoUrl} alt="" className="h-full w-full object-contain p-1" />
              ) : (
                <span className="text-sm font-black text-purple-800">{user.school.charAt(0)}</span>
              )}
            </div>
            <div className="min-w-0">
              <p className="truncate font-black text-ink">
                {user.name}
                {currentUserId === user.id && <span className="ml-2 rounded-full bg-purple-50 px-2 py-0.5 text-xs font-black text-purple-800">You</span>}
              </p>
              <p className="truncate text-sm text-slate-500">{user.school}</p>
            </div>
          </div>
          <div className="space-y-2">
            <p className="font-black text-purple-800">{user.xp.toLocaleString()} XP</p>
            <RankBadge xp={user.xp} />
          </div>
          <span className="hidden items-center gap-1 font-bold text-slate-600 sm:inline-flex">
            <Flame size={16} className="text-purple-700" /> {user.streak} days
          </span>
        </div>
      ))}
    </div>
  );
}
