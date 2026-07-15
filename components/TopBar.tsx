import { Flame, TrendingUp } from "lucide-react";
import Link from "next/link";
import { ProfileDropdown } from "@/components/ProfileDropdown";
import { getCurrentProfile, getCurrentUser, getUnreadPeerMessageCount } from "@/lib/data";
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
  const [profile, unreadMessages] = user ? await Promise.all([getCurrentProfile(), getUnreadPeerMessageCount()]) : [null, 0];
  const rank = getRank(profile?.xp ?? 0);
  const progress = getRankProgress(profile?.xp ?? 0);
  const profileName = profile?.name ?? user?.email ?? "CareerUp";
  const initials = user ? getInitials(profileName) : "";
  const firstName = user ? getFirstName(profile?.name ?? "") : "";
  const currentXp = profile?.xp ?? 0;
  const nextXp = progress.next?.minXp ?? currentXp;

  return (
    <header className="sticky top-0 z-40 hidden items-center justify-between gap-4 border-b border-[#ded4c8]/80 bg-[#f3efea]/90 px-7 py-3 backdrop-blur-xl lg:flex">
      <Link href="/dashboard" className="group leading-none">
        <span className="block text-4xl font-black tracking-tight text-[#4f3524] transition group-hover:text-[#8b5e3c]">CareerUp</span>
      </Link>

      <div className="flex items-center gap-3">
        <span className="inline-flex h-11 items-center gap-2 rounded-2xl bg-white/85 px-4 text-sm font-black text-[#3d2d23] shadow-sm ring-1 ring-[#ded4c8]">
          <Flame size={16} className={profile && profile.streak > 0 ? "fill-[#b9824a] text-[#b9824a]" : "text-slate-400"} />
          {profile?.streak ?? 0} day streak
        </span>
        <div className="hidden min-w-[17rem] rounded-2xl bg-white/85 px-4 py-2 shadow-sm ring-1 ring-[#ded4c8] xl:block">
          <div className="flex items-center justify-between gap-3 text-xs font-black text-slate-700">
            <span className="inline-flex items-center gap-1">
              <TrendingUp size={13} className="text-[#8b5e3c]" />
              {rank.name}
            </span>
            <span>
              {currentXp.toLocaleString()}
              {progress.next ? `/${nextXp.toLocaleString()}` : ""}
            </span>
          </div>
          <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-[#eee6dc] ring-1 ring-[#ded4c8]">
            <div className="h-full rounded-full bg-gradient-to-r from-[#7c4f2d] via-[#b9824a] to-[#d7a86e]" style={{ width: `${progress.percent}%` }} />
          </div>
        </div>
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
