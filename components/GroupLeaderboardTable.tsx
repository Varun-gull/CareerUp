import { Trophy, UsersRound } from "lucide-react";
import Link from "next/link";
import type { GroupLeaderboardRow } from "@/lib/types";

export function GroupLeaderboardTable({ groups }: { groups: GroupLeaderboardRow[] }) {
  if (groups.length === 0) {
    return (
      <div className="card p-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-sky/10 text-brand">
          <UsersRound size={22} />
        </div>
        <h2 className="mt-4 text-2xl font-bold text-ink">No groups yet</h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">Create a group with friends, then group rankings will show up here.</p>
        <Link href="/friends" className="primary-button mt-5">
          Create group
        </Link>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <div className="grid grid-cols-[56px_1fr_130px] gap-4 border-b border-slate-200 bg-white px-5 py-4 text-xs font-bold uppercase text-slate-700 sm:grid-cols-[56px_1fr_140px_140px]">
        <span>#</span>
        <span>Group</span>
        <span>Total XP</span>
        <span className="hidden sm:block">Members</span>
      </div>
      {groups.map((group, index) => (
        <div key={group.id} className="grid grid-cols-[56px_1fr_130px] gap-4 border-b border-slate-200 px-5 py-4 transition last:border-0 hover:bg-sky/10 sm:grid-cols-[56px_1fr_140px_140px]">
          <span className="flex items-center gap-1 text-lg font-bold text-slate-600">
            {index < 3 && <Trophy size={16} className={index === 0 ? "text-amber-500" : index === 1 ? "text-slate-600" : "text-orange-500"} />}
            {index + 1}
          </span>
          <div className="min-w-0">
            <p className="truncate font-bold text-ink">
              {group.name}
              {group.currentUserMember && <span className="ml-2 rounded-full bg-sky/10 px-2 py-0.5 text-xs font-bold text-brand">Your group</span>}
            </p>
            <p className="truncate text-sm text-slate-500">{group.description || "CareerUp squad"}</p>
          </div>
          <div>
            <p className="font-bold text-brand">{group.totalXp.toLocaleString()} XP</p>
            <p className="text-xs font-bold text-slate-500">{group.averageXp.toLocaleString()} avg</p>
          </div>
          <span className="hidden items-center gap-1 font-bold text-slate-600 sm:inline-flex">
            <UsersRound size={16} className="text-brand" /> {group.memberCount}
          </span>
        </div>
      ))}
    </div>
  );
}
