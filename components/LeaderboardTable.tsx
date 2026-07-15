import { Crown, Gem, List, Rocket, UserPlus } from "lucide-react";
import Link from "next/link";
import { ProfileLink } from "./ProfileLink";
import { TopBadge } from "./BadgeDisplay";
import { getRank, getRankProgress } from "@/lib/rank";
import type { LeaderboardUser } from "@/lib/types";

function getInitial(name: string) {
  return name.trim().charAt(0).toUpperCase() || "C";
}

function getLevel(xp: number) {
  return Math.max(1, Math.floor(xp / 100) + 1);
}

function leagueLabel(xp: number) {
  return getRank(xp).name.toUpperCase();
}

function Avatar({ user, size = "md" }: { user: LeaderboardUser; size?: "md" | "lg" }) {
  return (
    <div
      className={
        size === "lg"
          ? "flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-4 border-[#91B6AF] bg-[#E1EFEB] shadow-glow"
          : "flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-[#5E7681]/35 bg-[#E1EFEB]"
      }
    >
      {user.schoolLogoUrl ? (
        <img src={user.schoolLogoUrl} alt="" className="h-full w-full object-contain p-1.5" />
      ) : (
        <span className={size === "lg" ? "text-2xl font-black text-[#1B3C53]" : "text-sm font-black text-[#1B3C53]"}>{getInitial(user.name)}</span>
      )}
    </div>
  );
}

function PodiumCard({ user, place }: { user: LeaderboardUser; place: number }) {
  const isFirst = place === 1;
  const border = place === 1 ? "border-[#91B6AF]" : place === 2 ? "border-[#6BBCE8]/70" : "border-[#9B6A32]/70";
  const badge = place === 1 ? "bg-[#91B6AF] text-[#13112D]" : place === 2 ? "bg-slate-300 text-slate-950" : "bg-amber-500 text-slate-950";

  return (
    <article className={`relative flex min-h-72 flex-col items-center justify-center rounded-3xl border bg-[#151923] p-6 text-center shadow-strong ${border} ${isFirst ? "md:-mt-8" : ""}`}>
      {isFirst && (
        <span className="absolute right-5 top-5 rounded-full border border-[#91B6AF]/60 bg-[#91B6AF]/15 p-2 text-[#91B6AF]">
          <Crown size={18} />
        </span>
      )}
      <div className="relative">
        <Avatar user={user} size="lg" />
        <span className={`absolute -bottom-3 left-1/2 flex h-9 w-9 -translate-x-1/2 items-center justify-center rounded-full text-lg font-black ${badge}`}>
          {place}
        </span>
      </div>
      <ProfileLink profileId={user.id} name={user.name} className={`mt-7 block truncate text-2xl font-black ${isFirst ? "text-[#8FD8FF]" : "text-slate-100"}`}>
        {user.name}
      </ProfileLink>
      <p className="mt-1 text-xs font-black uppercase tracking-wider text-[#91B6AF]">{leagueLabel(user.xp)}</p>
      <div className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-[#1B3C53]/70 px-4 py-2 text-lg font-black text-[#8FD8FF]">
        <Gem size={18} /> {user.xp.toLocaleString()} XP
      </div>
    </article>
  );
}

export function LeaderboardTable({ users, currentUserId, emptyMode = "global" }: { users: LeaderboardUser[]; currentUserId?: string; emptyMode?: "global" | "friends" }) {
  const sorted = [...users].sort((a, b) => b.xp - a.xp);
  const topThree = sorted.slice(0, 3);
  const podium = [topThree[1], topThree[0], topThree[2]].filter(Boolean);
  const rest = sorted.slice(3);
  const currentIndex = currentUserId ? sorted.findIndex((user) => user.id === currentUserId) : -1;
  const currentUser = currentIndex >= 0 ? sorted[currentIndex] : null;
  const nextUser = currentIndex > 0 ? sorted[currentIndex - 1] : null;
  const currentProgress = currentUser ? getRankProgress(currentUser.xp) : null;

  if (sorted.length === 0) {
    return (
      <div className="card p-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-sky/10 text-brand">
          <UserPlus size={22} />
        </div>
        <h2 className="mt-4 text-2xl font-bold text-ink">{emptyMode === "friends" ? "No friends on the board yet" : "No leaderboard data yet"}</h2>
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
    <section className="overflow-hidden rounded-3xl border border-[#5E7681]/35 bg-[#0f141b] text-slate-100 shadow-strong">
      {podium.length > 0 && (
        <div className="grid gap-6 p-6 md:grid-cols-3 md:items-end md:p-8">
          {podium.map((user) => {
            const place = sorted.findIndex((candidate) => candidate.id === user.id) + 1;
            return <PodiumCard key={user.id} user={user} place={place} />;
          })}
        </div>
      )}

      <div className="border-t border-white/10">
        <div className="flex items-center justify-between gap-3 px-6 py-5">
          <div className="flex items-center gap-3">
            <List size={20} className="text-[#91B6AF]" />
            <h2 className="text-lg font-black text-slate-200">Top contributors</h2>
          </div>
          <span className="rounded-xl bg-[#13112D] px-4 py-2 text-xs font-black text-slate-200 ring-1 ring-white/10">Monthly</span>
        </div>

        <div className="grid grid-cols-[64px_minmax(0,1fr)_86px_120px] gap-4 border-y border-white/10 px-6 py-4 text-[11px] font-black uppercase tracking-wider text-slate-400 md:grid-cols-[80px_minmax(0,1fr)_140px_160px_140px]">
          <span>Rank</span>
          <span>Username</span>
          <span>Level</span>
          <span>Total XP</span>
          <span className="hidden md:block text-right">Badge</span>
        </div>

        {(rest.length > 0 ? rest : sorted).map((user, index) => {
          const rankNumber = rest.length > 0 ? index + 4 : index + 1;
          return (
            <div
              key={user.id}
              className="grid grid-cols-[64px_minmax(0,1fr)_86px_120px] gap-4 border-b border-white/10 px-6 py-4 transition last:border-0 hover:bg-white/5 md:grid-cols-[80px_minmax(0,1fr)_140px_160px_140px]"
            >
              <span className="flex items-center text-lg font-black text-slate-400">{String(rankNumber).padStart(2, "0")}</span>
              <div className="flex min-w-0 items-center gap-3">
                <Avatar user={user} />
                <div className="min-w-0">
                  <ProfileLink profileId={user.id} name={user.name} className="block truncate text-base font-black text-slate-200">
                    {user.name}
                  </ProfileLink>
                  <p className="truncate text-[11px] font-black uppercase text-slate-500">{leagueLabel(user.xp)}</p>
                  {currentUserId === user.id && <span className="mt-1 inline-flex rounded-full bg-[#91B6AF]/15 px-2 py-0.5 text-[10px] font-black text-[#91B6AF]">You</span>}
                </div>
              </div>
              <span className="flex items-center text-base font-black text-[#91B6AF]">LVL {getLevel(user.xp)}</span>
              <span className="flex items-center font-black text-slate-200">{user.xp.toLocaleString()} XP</span>
              <div className="hidden items-center justify-end md:flex">
                <TopBadge applicationsApplied={user.applicationsApplied} />
              </div>
            </div>
          );
        })}
      </div>

      {currentUser && currentProgress && (
        <div className="grid gap-4 border-t border-[#5E7681]/35 bg-[#131a23] px-6 py-5 md:grid-cols-[minmax(0,1fr)_minmax(240px,420px)_160px] md:items-center">
          <div className="flex min-w-0 items-center gap-4">
            <span className="text-xl font-black text-slate-300">{currentIndex + 1}</span>
            <Avatar user={currentUser} />
            <div className="min-w-0">
              <p className="truncate text-base font-black text-[#8FD8FF]">{currentUser.name} <span className="text-slate-300">(You)</span></p>
              <p className="text-xs font-black uppercase text-[#91B6AF]">{leagueLabel(currentUser.xp)} · Top {Math.max(1, Math.round(((currentIndex + 1) / sorted.length) * 100))}%</p>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between gap-3 text-xs font-black text-slate-300">
              <span>{nextUser ? `Next Rank: ${currentIndex} (${nextUser.name})` : "You are at the top"}</span>
              <span>{nextUser ? `${Math.max(0, nextUser.xp - currentUser.xp).toLocaleString()} XP to pass` : "Leader"}</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-700">
              <div className="h-full rounded-full bg-[#91B6AF]" style={{ width: `${currentProgress.percent}%` }} />
            </div>
          </div>
          <div className="flex items-center justify-between gap-4 md:justify-end">
            <div className="text-right">
              <p className="text-xs font-black uppercase text-slate-400">Current XP</p>
              <p className="text-xl font-black text-slate-100">{currentUser.xp.toLocaleString()}</p>
            </div>
            <Link href="/rewards" className="inline-flex min-h-11 items-center gap-2 rounded-2xl border border-[#6BBCE8]/40 bg-[#1B3C53] px-4 text-sm font-black text-[#8FD8FF] transition hover:bg-[#162D41]">
              <Rocket size={16} /> Boost Rank
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}
