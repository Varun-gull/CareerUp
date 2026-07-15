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
    <section className="card flex min-h-40 flex-col justify-between gap-6 p-5 transition hover:-translate-y-0.5 hover:bg-white/95">
      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-sky shadow-sm">
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
      <section className="relative overflow-hidden rounded-[2.25rem] border border-white/85 bg-white/70 p-5 shadow-soft backdrop-blur-2xl sm:p-7">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_84%_18%,rgba(125,211,252,0.34),transparent_24rem),linear-gradient(135deg,rgba(15,23,42,0.04),transparent_45%)]" />
        <div className="relative grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-stretch">
          <div className="flex min-h-[20rem] flex-col justify-between rounded-[1.75rem] bg-slate-950 p-6 text-white shadow-strong sm:p-8">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-sky ring-1 ring-white/15">
                  <Sparkles size={22} />
                </span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-sky">Command center</p>
                  <p className="mt-1 text-sm font-semibold text-slate-300">{profile.school || "CareerUp student"}</p>
                </div>
              </div>
              <span
                className={
                  streakActive
                    ? "rounded-full bg-lime-200 px-3 py-1 text-xs font-bold text-slate-950"
                    : "rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-slate-200 ring-1 ring-white/15"
                }
              >
                {streakActive ? "Streak active" : "Streak paused"}
              </span>
            </div>
            <div>
              <h1 className="max-w-3xl text-4xl font-bold leading-tight sm:text-6xl">Welcome back, {profile.name}</h1>
              <p className="mt-4 max-w-2xl text-base font-semibold leading-7 text-slate-300">
                Keep your search focused: review today&apos;s quests, move one role forward, and protect your recruiting momentum.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/postings/internships" className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-sky px-5 font-bold text-slate-950 shadow-glow transition hover:-translate-y-0.5">
                Find roles
              </Link>
              <Link href="/applications/new" className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-white/10 px-5 font-bold text-white ring-1 ring-white/15 transition hover:-translate-y-0.5 hover:bg-white/15">
                Add role <ArrowRight className="ml-2" size={17} />
              </Link>
            </div>
          </div>
          <div className="rounded-[1.75rem] bg-lime-200/90 p-6 text-slate-950 shadow-soft ring-1 ring-lime-100">
            <div className="flex items-center justify-between gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-lime-200">
                <Sparkles size={20} />
              </span>
              <Link href="/rewards" className="rounded-full bg-white/65 px-3 py-1.5 text-xs font-bold text-slate-700">
                Rewards
              </Link>
            </div>
            <p className="mt-10 text-sm font-bold uppercase tracking-wider text-slate-600">Today&apos;s assistant</p>
            <h2 className="mt-2 text-3xl font-bold leading-tight">Ready to complete your next challenge?</h2>
            <p className="mt-4 text-sm font-semibold leading-6 text-slate-700">
              Start with one high-quality application, then update your application board so XP and streak progress stay accurate.
            </p>
            <div className="mt-8 flex flex-wrap gap-2">
              <span className="rounded-full bg-white/65 px-3 py-1.5 text-xs font-bold text-slate-700">Daily sprint</span>
              <span className="rounded-full bg-white/65 px-3 py-1.5 text-xs font-bold text-slate-700">+40 XP</span>
            </div>
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
