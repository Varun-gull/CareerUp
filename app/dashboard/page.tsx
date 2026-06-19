import {
  Bell,
  CheckCircle2,
  ChevronRight,
  Flame,
  Plus,
  Target,
  Trophy
} from "lucide-react";
import Link from "next/link";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { deleteApplication, updateApplicationStatus } from "@/lib/applications/actions";
import { getApplications, getCurrentProfile } from "@/lib/data";
import { challenges, leaderboard } from "@/lib/mock-data";
import { getRankProgress } from "@/lib/rank";
import type { Application } from "@/lib/types";

const PIPELINE = ["saved", "applied", "interviewing", "offer"] as const;

const COMPANY_COLORS = [
  "bg-blue-600",
  "bg-emerald-600",
  "bg-orange-500",
  "bg-purple-600",
  "bg-pink-600",
  "bg-cyan-600",
];

const MINI_BARS = [5, 8, 6, 10, 7, 9, 11];

function MiniBarChart() {
  const max = Math.max(...MINI_BARS);
  return (
    <div className="flex items-end gap-0.5 h-8">
      {MINI_BARS.map((h, i) => (
        <div
          key={i}
          className="w-2 rounded-sm bg-blue-500/60"
          style={{ height: `${(h / max) * 100}%` }}
        />
      ))}
    </div>
  );
}

function PipelineDots({ status }: { status: string }) {
  const idx = PIPELINE.indexOf(status as typeof PIPELINE[number]);
  return (
    <div className="flex items-center gap-1 mt-3">
      {PIPELINE.map((s, i) => (
        <div key={s} className="flex items-center gap-1">
          <div
            className={`h-3 w-3 rounded-full border-2 transition-colors ${
              i < idx
                ? "border-blue-500 bg-blue-500"
                : i === idx
                ? "border-blue-400 bg-blue-400"
                : "border-slate-600 bg-transparent"
            }`}
          />
          {i < PIPELINE.length - 1 && (
            <div className={`h-0.5 w-5 ${i < idx ? "bg-blue-500" : "bg-slate-600"}`} />
          )}
        </div>
      ))}
      <ChevronRight size={14} className="text-slate-500 ml-1" />
    </div>
  );
}

function AppMiniCard({ app, index }: { app: Application; index: number }) {
  const color = COMPANY_COLORS[index % COMPANY_COLORS.length];
  const initial = app.company[0].toUpperCase();
  const isApplied = app.status !== "saved";

  return (
    <article className="rounded-xl bg-slate-800/70 p-4 border border-slate-700/50">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className={`flex h-10 w-10 flex-none items-center justify-center rounded-lg ${color} text-sm font-black text-white`}>
            {initial}
          </span>
          <div>
            <p className="text-sm font-black text-white">{app.company}</p>
            <p className="text-xs text-slate-400 mt-0.5">{app.role}</p>
          </div>
        </div>
        {isApplied && (
          <span className="rounded-full bg-blue-600/20 px-2 py-0.5 text-xs font-black text-blue-400 border border-blue-500/30">
            {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
          </span>
        )}
      </div>
      <PipelineDots status={app.status} />
    </article>
  );
}

export default async function DashboardPage() {
  const [applications, profile] = await Promise.all([getApplications(), getCurrentProfile()]);

  const appliedCount = applications.filter((a) => a.status === "applied" || a.status === "interviewing" || a.status === "offer").length;
  const interviewingCount = applications.filter((a) => a.status === "interviewing").length;
  const offerCount = applications.filter((a) => a.status === "offer").length;

  const progress = getRankProgress(profile.xp);
  const sorted = [...leaderboard].sort((a, b) => b.xp - a.xp);
  const firstChallenge = challenges[0];

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-white">
      <DashboardSidebar />

      {/* Main scroll area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex flex-none items-center justify-between border-b border-slate-700/50 bg-slate-900/80 px-8 py-4 backdrop-blur">
          <h1 className="text-xl font-black text-white">Dashboard</h1>
          <div className="flex items-center gap-3">
            <button className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors">
              <Bell size={17} />
            </button>
            <Link href="/profile" className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-black text-white">
              {profile.name[0].toUpperCase()}
            </Link>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-6xl space-y-5">

            {/* XP + Rank row */}
            <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
              {/* XP bar card */}
              <div className="rounded-xl bg-slate-800/70 border border-slate-700/50 p-5">
                <div className="flex items-center gap-5">
                  <div className="flex h-14 w-14 flex-none items-center justify-center rounded-xl bg-blue-600 text-2xl font-black text-white shadow-lg shadow-blue-600/30">
                    {Math.floor(profile.xp / 100)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-base font-black text-white">XP</span>
                      <span className="text-xs font-bold text-slate-400">Next Rank</span>
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-slate-700">
                      <div
                        className="h-full rounded-full bg-blue-500 shadow-lg shadow-blue-500/40 transition-all"
                        style={{ width: `${progress.percent}%` }}
                      />
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-300">
                        {profile.xp.toLocaleString()} / {progress.next ? progress.next.minXp.toLocaleString() : "MAX"} XP
                      </span>
                      <Trophy size={16} className="text-blue-400" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Your Rank */}
              <div className="rounded-xl bg-slate-800/70 border border-slate-700/50 p-5 text-center">
                <p className="text-xs font-black uppercase tracking-wide text-slate-400">Your Rank</p>
                <div className="mx-auto my-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/20 border border-blue-500/30">
                  <Trophy size={32} className="text-blue-400" />
                </div>
                <p className="font-black text-white">{progress.current.name}</p>
                <p className="mt-1 text-xs text-blue-400 font-bold">Top 15%</p>
                <div className="mt-3 flex justify-center gap-1.5">
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i} className={`h-1.5 w-1.5 rounded-full ${i === 0 ? "bg-blue-500" : "bg-slate-600"}`} />
                  ))}
                </div>
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
              {[
                { label: "Streak", value: profile.streak, unit: "days", icon: <Flame size={18} className="text-orange-400" />, color: "text-orange-400" },
                { label: "Applied", value: appliedCount, unit: "", icon: <CheckCircle2 size={18} className="text-blue-400" />, color: "text-blue-400" },
                { label: "Interviews", value: interviewingCount, unit: "", icon: <Target size={18} className="text-emerald-400" />, color: "text-emerald-400" },
                { label: "Offers", value: offerCount, unit: "", icon: <Trophy size={18} className="text-yellow-400" />, color: "text-yellow-400" },
              ].map(({ label, value, unit, icon, color }) => (
                <div key={label} className="rounded-xl bg-slate-800/70 border border-slate-700/50 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-700/60">
                      {icon}
                    </div>
                    <MiniBarChart />
                  </div>
                  <p className="mt-3 text-xs font-bold text-slate-400">{label}</p>
                  <p className={`mt-1 text-3xl font-black ${color}`}>
                    {value}
                    {unit && <span className="ml-1 text-sm font-bold text-slate-400">{unit}</span>}
                  </p>
                </div>
              ))}
            </div>

            {/* Applications + Right column */}
            <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
              {/* Recent Applications */}
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-black text-white">Recent Applications</h2>
                  <Link href="/applications" className="text-sm font-bold text-blue-400 hover:text-blue-300 transition-colors">
                    View All
                  </Link>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {applications.slice(0, 4).map((app, i) => (
                    <AppMiniCard key={app.id} app={app} index={i} />
                  ))}
                </div>
                <Link
                  href="/applications/new"
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800/40 py-3 text-sm font-bold text-slate-400 transition-colors hover:border-blue-500/50 hover:text-blue-400"
                >
                  <Plus size={16} />
                  View All Applications
                </Link>
              </div>

              {/* Right column: Leaderboard + Challenge */}
              <div className="space-y-4">
                {/* Leaderboard */}
                <div className="rounded-xl bg-slate-800/70 border border-slate-700/50 p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-sm font-black text-white">Leaderboard</h3>
                    <span className="rounded-lg bg-slate-700 px-2.5 py-1 text-xs font-bold text-slate-300">This Week</span>
                  </div>
                  <div className="space-y-3">
                    {sorted.slice(0, 5).map((user, i) => {
                      const medalColor = i === 0 ? "bg-yellow-500" : i === 1 ? "bg-slate-400" : i === 2 ? "bg-orange-500" : "bg-slate-700";
                      const maxXp = sorted[0].xp;
                      return (
                        <div key={user.id} className="flex items-center gap-3">
                          <span className={`flex h-5 w-5 flex-none items-center justify-center rounded-full ${medalColor} text-xs font-black text-white`}>
                            {i + 1}
                          </span>
                          <div className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-slate-600 text-xs font-black text-white">
                            {user.name[0]}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="h-1.5 overflow-hidden rounded-full bg-slate-700">
                              <div
                                className="h-full rounded-full bg-blue-500"
                                style={{ width: `${(user.xp / maxXp) * 100}%` }}
                              />
                            </div>
                          </div>
                          <span className="text-xs font-black text-slate-300 tabular-nums">{user.xp.toLocaleString()}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Daily Challenge */}
                <div className="rounded-xl bg-slate-800/70 border border-slate-700/50 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <Target size={15} className="text-blue-400" />
                        <p className="text-xs font-black uppercase tracking-wide text-slate-400">Daily Challenge</p>
                      </div>
                      <p className="mt-2 text-sm font-black text-white">{firstChallenge.title}</p>
                    </div>
                    <div className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-600/30">
                      <div className="text-center">
                        <p className="text-xs font-black text-white leading-none">XP</p>
                        <p className="text-xs font-black text-blue-200">{firstChallenge.xp}</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="h-1.5 overflow-hidden rounded-full bg-slate-700">
                      <div
                        className="h-full rounded-full bg-blue-500"
                        style={{ width: `${(firstChallenge.progress / firstChallenge.target) * 100}%` }}
                      />
                    </div>
                    <p className="mt-1.5 text-right text-xs font-bold text-slate-500">
                      {firstChallenge.progress} / {firstChallenge.target}
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
