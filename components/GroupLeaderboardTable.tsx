import { Trophy, UsersRound } from "lucide-react";
import Link from "next/link";
import type { GroupLeaderboardRow } from "@/lib/types";

export function GroupLeaderboardTable({ groups }: { groups: GroupLeaderboardRow[] }) {
  if (groups.length === 0) {
    return (
      <div className="rounded-3xl border border-[#7E739F]/30 bg-[#FBFAFD] p-8 text-center text-[#13112D] shadow-soft">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EFE9F4] text-[#231942] ring-1 ring-[#7E739F]/25">
          <UsersRound size={22} />
        </div>
        <h2 className="mt-4 text-2xl font-black text-[#13112D]">No groups yet</h2>
        <p className="mx-auto mt-2 max-w-md text-sm font-semibold leading-6 text-[#7E739F]">Create a group with friends, then group rankings will show up here.</p>
        <Link href="/friends" className="mt-5 inline-flex min-h-11 items-center justify-center rounded-xl bg-[#231942] px-5 font-black text-white shadow-sm transition hover:bg-[#1A1233]">
          Create group
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-[#7E739F]/30 bg-[#FBFAFD] text-[#13112D] shadow-soft">
      <div className="grid grid-cols-[56px_1fr_130px] gap-4 border-b border-[#7E739F]/20 bg-[#EFE9F4]/55 px-5 py-4 text-xs font-black uppercase tracking-wider text-[#7E739F] sm:grid-cols-[56px_1fr_140px_140px]">
        <span>#</span>
        <span>Group</span>
        <span>Total XP</span>
        <span className="hidden sm:block">Members</span>
      </div>
      {groups.map((group, index) => (
        <div key={group.id} className="grid grid-cols-[56px_1fr_130px] gap-4 border-b border-[#7E739F]/15 px-5 py-4 transition last:border-0 hover:bg-[#EFE9F4]/45 sm:grid-cols-[56px_1fr_140px_140px]">
          <span className="flex items-center gap-1 text-lg font-black text-[#7E739F]">
            {index < 3 && <Trophy size={16} className={index === 0 ? "text-[#231942]" : index === 1 ? "text-[#9F86C0]" : "text-[#7E739F]"} />}
            {index + 1}
          </span>
          <div className="min-w-0">
            <p className="truncate font-black text-[#13112D]">
              {group.name}
              {group.currentUserMember && <span className="ml-2 rounded-full bg-[#EFE9F4] px-2 py-0.5 text-xs font-black text-[#231942] ring-1 ring-[#7E739F]/25">Your group</span>}
            </p>
            <p className="truncate text-sm text-slate-500">{group.description || "CareerUp squad"}</p>
          </div>
          <div>
            <p className="font-black text-[#231942]">{group.totalXp.toLocaleString()} XP</p>
            <p className="text-xs font-black text-[#7E739F]">{group.averageXp.toLocaleString()} avg</p>
          </div>
          <span className="hidden items-center gap-1 font-black text-[#7E739F] sm:inline-flex">
            <UsersRound size={16} className="text-[#231942]" /> {group.memberCount}
          </span>
        </div>
      ))}
    </div>
  );
}
