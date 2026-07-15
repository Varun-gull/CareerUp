import { BriefcaseBusiness } from "lucide-react";
import Link from "next/link";
import { SidebarNavLinks } from "@/components/SidebarNavLinks";
import { getCurrentProfile, getCurrentUser, getUnreadPeerMessageCount } from "@/lib/data";
import { getRankProgress } from "@/lib/rank";

function getInitials(name: string) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return initials || "CU";
}

export async function AppSidebar() {
  const user = await getCurrentUser();
  const [profile, unreadMessages] = user ? await Promise.all([getCurrentProfile(), getUnreadPeerMessageCount()]) : [null, 0];
  const name = profile?.name ?? user?.email ?? "CareerUp";
  const progress = getRankProgress(profile?.xp ?? 0);

  return (
    <aside className="hidden border-r border-white/70 bg-white/55 backdrop-blur-2xl lg:sticky lg:top-0 lg:flex lg:h-[inherit] lg:max-h-[calc(100vh-2.5rem)] lg:flex-col lg:gap-5 lg:overflow-y-auto lg:p-4 xl:max-h-[calc(100vh-3.5rem)] xl:p-5">
      <Link href="/dashboard" className="flex items-center gap-3 rounded-[1.35rem] bg-white/65 px-3 py-3 font-bold text-ink shadow-sm ring-1 ring-white/75 transition hover:-translate-y-0.5 hover:bg-white">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-[0_12px_28px_rgba(15,23,42,0.22)]">
          <BriefcaseBusiness size={20} />
        </span>
        <span className="text-lg">CareerUp</span>
      </Link>

      <SidebarNavLinks unreadMessages={unreadMessages} />

      <div className="mt-auto grid gap-4 pt-4">
        <div className="rounded-[1.75rem] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-5 text-white shadow-strong">
          <p className="text-xs font-semibold uppercase tracking-wider text-sky-100">Current rank</p>
          <p className="font-display mt-1 text-xl font-bold">{progress.current.name}</p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/15">
            <div className="h-full rounded-full bg-gradient-to-r from-lime-200 via-sky to-white" style={{ width: `${progress.percent}%` }} />
          </div>
          <p className="mt-2 text-xs font-semibold text-sky-100">
            {progress.next ? `${progress.remaining} XP to ${progress.next.name}` : "Max rank unlocked"}
          </p>
          <Link
            href="/rewards"
            className="mt-4 flex min-h-10 items-center justify-center rounded-xl bg-white/12 text-sm font-semibold text-white ring-1 ring-white/20 transition hover:bg-white/20"
          >
            View rewards
          </Link>
        </div>

        <Link
          href="/profile"
          aria-label="Open your profile"
          className="flex items-center gap-3 rounded-[1.35rem] border border-white/75 bg-white/65 p-3 shadow-sm transition hover:border-sky/50 hover:bg-white"
        >
          {profile?.schoolLogoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.schoolLogoUrl}
              alt={profile.school ? `${profile.school} logo` : "School logo"}
              className="h-11 w-11 shrink-0 rounded-2xl border border-slate-200 bg-white object-contain p-1"
            />
          ) : (
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-800 via-slate-700 to-sky text-sm font-bold text-white">
              {getInitials(name)}
            </span>
          )}
          <span className="min-w-0">
            <span className="block truncate text-sm font-bold text-ink">{name}</span>
            <span className="block truncate text-xs text-slate-600">{user?.email ?? "Not signed in"}</span>
          </span>
        </Link>
      </div>
    </aside>
  );
}
