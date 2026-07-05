import { ArrowRight, CheckCircle2, Flame, MessageSquareText, Trophy } from "lucide-react";
import Link from "next/link";
import { ChallengeCard } from "@/components/ChallengeCard";
import { DashboardCard } from "@/components/DashboardCard";
import { Navbar } from "@/components/Navbar";
import { StreakCard } from "@/components/StreakCard";
import { WeeklyCalendarSnapshot } from "@/components/WeeklyCalendarSnapshot";
import { XpProgressBar } from "@/components/XpProgressBar";
import { getApplications, getCalendarEvents, getChallenges, getCurrentProfile } from "@/lib/data";

export default async function DashboardPage({ searchParams }: { searchParams?: { message?: string } }) {
  const [profile, challenges, calendarEvents, applications] = await Promise.all([
    getCurrentProfile(),
    getChallenges(),
    getCalendarEvents(),
    getApplications()
  ]);

  const appliedCount = applications.filter((application) => application.status !== "saved").length;
  const interviewingCount = applications.filter((application) => application.status === "interviewing").length;
  const offerCount = applications.filter((application) => application.status === "offer").length;

  return (
    <>
      <Navbar />
      <main className="page-shell">
        <section className="page-hero flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Command center</p>
            <h1 className="mt-2 text-3xl font-bold leading-tight text-ink sm:text-4xl">Welcome back, {profile.name}</h1>
            <p className="mt-2 max-w-2xl leading-7 text-slate-600">
              Keep today simple: finish a challenge and move one application forward.
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
        </section>
        {searchParams?.message && <p className="mt-5 rounded-2xl border border-sky/20 bg-sky/10 p-3 text-sm font-bold text-sky-600">{searchParams.message}</p>}

        <section className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <DashboardCard
            title="Streak"
            value={`${profile.streak} ${profile.streak === 1 ? "day" : "days"}`}
            helper={profile.streak > 0 ? "Apply to one role today to keep it alive." : "Apply to one role today to start it."}
            icon={Flame}
          />
          <DashboardCard title="Applied" value={appliedCount.toString()} helper="Roles moved beyond saved." icon={CheckCircle2} />
          <DashboardCard title="Interviewing" value={interviewingCount.toString()} helper="Active interview loops." icon={MessageSquareText} />
          <DashboardCard title="Offers" value={offerCount.toString()} helper="Unlocked wins." icon={Trophy} />
        </section>

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
          </aside>
        </section>
      </main>
    </>
  );
}
