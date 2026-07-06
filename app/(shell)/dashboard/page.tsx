import { ArrowRight, CheckCircle2, Flame, Sparkles, Trophy } from "lucide-react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ChallengeCard } from "@/components/ChallengeCard";
import { StreakCard } from "@/components/StreakCard";
import { WeeklyCalendarSnapshot } from "@/components/WeeklyCalendarSnapshot";
import { XpProgressBar } from "@/components/XpProgressBar";
import { getApplications, getCalendarEvents, getChallenges, getCurrentProfile } from "@/lib/data";

function StatCard({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <section className="card flex flex-col justify-between gap-6 p-5">
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-sky/15 text-sky-700">
        <Icon size={20} />
      </span>
      <div>
        <p className="text-sm font-semibold text-slate-600">{label}</p>
        <p className="font-display mt-1 text-3xl font-bold tracking-tight text-ink">{value}</p>
      </div>
    </section>
  );
}

export default async function DashboardPage({ searchParams }: { searchParams?: { message?: string } }) {
  const [profile, challenges, calendarEvents, applications] = await Promise.all([
    getCurrentProfile(),
    getChallenges(),
    getCalendarEvents(),
    getApplications()
  ]);

  const appliedCount = applications.filter((application) => application.status !== "saved").length;
  const offerCount = applications.filter((application) => application.status === "offer").length;
  const streakActive = profile.streak > 0;

  return (
    <main className="page-shell space-y-5">
      <section className="page-hero flex flex-wrap items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-4">
          <span className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky/15 text-sky-700 sm:flex">
            <Sparkles size={22} />
          </span>
          <div className="min-w-0">
            <h1 className="truncate text-2xl font-bold text-ink sm:text-3xl">Welcome back, {profile.name}</h1>
            <p className="mt-1 text-sm text-slate-600">{profile.school || "CareerUp student"}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          <p className="flex items-center gap-2 text-sm font-semibold text-slate-600">
            Streak
            <span
              className={
                streakActive
                  ? "rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600 ring-1 ring-emerald-200"
                  : "rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600 ring-1 ring-slate-300"
              }
            >
              {streakActive ? "Active" : "Paused"}
            </span>
          </p>
          <div className="flex gap-3">
            <Link href="/postings/internships" className="secondary-button">
              Find roles
            </Link>
            <Link href="/applications/new" className="primary-button">
              Add role <ArrowRight className="ml-2" size={17} />
            </Link>
          </div>
        </div>
      </section>
      {searchParams?.message && (
        <p className="rounded-2xl border border-sky/20 bg-sky/10 p-3 text-sm font-bold text-sky-600">{searchParams.message}</p>
      )}

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <StatCard icon={Sparkles} label="Total XP" value={profile.xp.toLocaleString()} />
            <StatCard icon={Flame} label="Day streak" value={profile.streak.toLocaleString()} />
            <StatCard icon={CheckCircle2} label="Applications sent" value={appliedCount.toLocaleString()} />
            <StatCard icon={Trophy} label="Offers" value={offerCount.toLocaleString()} />
          </div>
          <WeeklyCalendarSnapshot events={calendarEvents} />
          <XpProgressBar xp={profile.xp} />
        </div>
        <aside className="space-y-5">
          <section className="card p-5">
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="eyebrow">XP quests</p>
                <h2 className="mt-1 text-2xl font-bold text-ink">Challenges</h2>
              </div>
              <Link href="/rewards" className="text-sm font-bold text-sky-600">
                Rewards
              </Link>
            </div>
            <div className="mt-4 grid gap-4">
              {[...challenges.tiered, ...challenges.oneOff].slice(0, 4).map((challenge) => (
                <ChallengeCard key={challenge.id} challenge={challenge} />
              ))}
            </div>
          </section>
          <StreakCard
            streak={profile.streak}
            xp={profile.xp}
            streakBroken={profile.streakBroken}
            freeReviveUsed={profile.streakFreeReviveUsed}
            paidRevives={profile.streakPaidRevives}
            reviveRequiredApplications={profile.streakReviveRequiredApplications}
          />
        </aside>
      </section>
    </main>
  );
}
