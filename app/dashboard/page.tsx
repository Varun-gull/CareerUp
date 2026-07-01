import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { ChallengeCard } from "@/components/ChallengeCard";
import { Navbar } from "@/components/Navbar";
import { StreakCard } from "@/components/StreakCard";
import { WeeklyCalendarSnapshot } from "@/components/WeeklyCalendarSnapshot";
import { XpProgressBar } from "@/components/XpProgressBar";
import { getCalendarEvents, getChallenges, getCurrentProfile } from "@/lib/data";

export default async function DashboardPage({ searchParams }: { searchParams?: { message?: string } }) {
  const [profile, challenges, calendarEvents] = await Promise.all([getCurrentProfile(), getChallenges(), getCalendarEvents()]);

  return (
    <>
      <Navbar />
      <main className="page-shell">
        <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white/90 shadow-soft backdrop-blur-xl">
          <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="eyebrow">Command center</p>
              <h1 className="mt-3 max-w-4xl text-4xl font-black leading-tight text-ink sm:text-6xl">Welcome back, {profile.name}</h1>
              <p className="mt-4 max-w-2xl text-base font-semibold leading-7 text-slate-600">
                Keep today simple: check your streak, scan the week, finish a challenge, and move one application forward.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/postings/internships" className="secondary-button">
                Find roles
              </Link>
              <Link href="/applications/new" className="primary-button">
                Add role <ArrowRight className="ml-2" size={17} />
              </Link>
            </div>
          </div>
          <div className="border-t border-slate-200 bg-slate-50/80 px-6 py-4 sm:px-8">
            <div className="flex flex-wrap items-center gap-3 text-sm font-bold text-slate-600">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-sky/10 text-sky">
                <Sparkles size={18} />
              </span>
              <span>{profile.xp.toLocaleString()} XP earned · {profile.streak} day streak · {profile.school || "CareerUp student"}</span>
            </div>
          </div>
        </section>
        {searchParams?.message && <p className="mt-5 rounded-2xl border border-sky/20 bg-sky/10 p-3 text-sm font-bold text-sky">{searchParams.message}</p>}

        <section className="mt-6 grid gap-5 xl:grid-cols-[1fr_380px]">
          <div className="space-y-5">
            <XpProgressBar xp={profile.xp} />
            <WeeklyCalendarSnapshot events={calendarEvents} />
          </div>
          <aside className="space-y-5">
            <StreakCard
              streak={profile.streak}
              xp={profile.xp}
              streakBroken={profile.streakBroken}
              freeReviveUsed={profile.streakFreeReviveUsed}
              paidRevives={profile.streakPaidRevives}
              reviveRequiredApplications={profile.streakReviveRequiredApplications}
            />
            <section className="card p-5">
              <div className="flex items-end justify-between gap-3">
                <div>
                  <p className="eyebrow">XP quests</p>
                  <h2 className="mt-1 text-2xl font-black text-ink">Challenges</h2>
                </div>
                <Link href="/rewards" className="text-sm font-black text-sky">
                  Rewards
                </Link>
              </div>
              <div className="mt-4 grid gap-4">
                {[...challenges.tiered, ...challenges.oneOff].slice(0, 4).map((challenge) => (
                  <ChallengeCard key={challenge.id} challenge={challenge} />
                ))}
              </div>
            </section>
          </aside>
        </section>
      </main>
    </>
  );
}
