import { Flame, TrendingUp } from "lucide-react";
import Link from "next/link";
import { ProfileDropdown } from "@/components/ProfileDropdown";
import { getCurrentProfile, getCurrentUser, getLeaderboard, getUnreadPeerMessageCount } from "@/lib/data";
import { getRank, getRankProgress } from "@/lib/rank";

function getInitials(name: string) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return initials || "CU";
}

function getFirstName(name: string) {
  return name.split(/\s+/).filter(Boolean)[0] ?? "";
}

export async function TopBar() {
  const user = await getCurrentUser();
  const [profile, unreadMessages, leaderboard] = user ? await Promise.all([getCurrentProfile(), getUnreadPeerMessageCount(), getLeaderboard()]) : [null, 0, []];
  const rank = getRank(profile?.xp ?? 0);
  const progress = getRankProgress(profile?.xp ?? 0);
  const rankPosition = user ? leaderboard.findIndex((leader) => leader.id === user.id) + 1 : 0;
  const profileName = profile?.name ?? user?.email ?? "CareerUp";
  const initials = user ? getInitials(profileName) : "";
  const firstName = user ? getFirstName(profile?.name ?? "") : "";
  const currentXp = profile?.xp ?? 0;
  const nextXp = progress.next?.minXp ?? currentXp;

  return (
    <header className="sticky top-0 z-40 hidden items-center justify-between gap-4 border-b border-[#7E739F]/30 bg-[#FBFAFD]/92 px-7 py-3 backdrop-blur-xl lg:flex">
      <Link href="/dashboard" className="group leading-none">
        <span className="block text-4xl font-black tracking-tight text-[#231942] transition group-hover:text-[#1A1233]">CareerUp</span>
      </Link>

      <div className="flex items-center gap-3">
        <span className="inline-flex h-11 items-center gap-2 rounded-2xl bg-[#EFE9F4] px-4 text-sm font-black text-[#231942] shadow-sm ring-1 ring-[#7E739F]/30">
          <Flame size={16} className={profile && profile.streak > 0 ? "fill-[#231942] text-[#231942]" : "text-[#7E739F]"} />
          {profile?.streak ?? 0} day streak
        </span>
        <Link href="/leaderboard" className="hidden min-w-[17rem] rounded-2xl bg-[#FBFAFD] px-4 py-2 shadow-sm ring-1 ring-[#7E739F]/30 transition hover:-translate-y-0.5 hover:ring-[#231942]/40 xl:block">
          <div className="flex items-center justify-between gap-3 text-xs font-black text-slate-700">
            <span className="inline-flex items-center gap-1">
              <TrendingUp size={13} className="text-[#231942]" />
              {rankPosition > 0 ? `#${rankPosition}` : "Rank"} · {rank.name}
            </span>
            <span>
              {currentXp.toLocaleString()}
              {progress.next ? `/${nextXp.toLocaleString()}` : ""}
            </span>
          </div>
          <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-[#EFE9F4] ring-1 ring-[#7E739F]/30">
            <div className="h-full rounded-full bg-[#231942]" style={{ width: `${progress.percent}%` }} />
          </div>
        </Link>
        <ProfileDropdown
          initials={initials}
          displayName={firstName}
          loggedIn={!!user}
          schoolLogoUrl={profile?.schoolLogoUrl ?? ""}
          unreadMessages={unreadMessages}
        />
      </div>
    </header>
  );
}
