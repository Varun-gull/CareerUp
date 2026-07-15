import { CheckCircle2, Flame, Sparkles, Trophy } from "lucide-react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { ChallengeCard } from "@/components/ChallengeCard";
import { WeeklyCalendarSnapshot } from "@/components/WeeklyCalendarSnapshot";
import { XpProgressBar } from "@/components/XpProgressBar";
import { getApplications, getCalendarEvents, getChallenges, getCurrentProfile } from "@/lib/data";

function StatCard({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <section className="card flex min-h-40 flex-col justify-between gap-6 p-5 transition hover:-translate-y-0.5 hover:bg-white/95">
      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-sm">
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

  return (
    <main className="page-shell space-y-5">
      <PageHero
        eyebrow={profile.school || "CareerUp student"}
        title={`Welcome back, ${profile.name}`}
        description="Keep your search focused: review today's quests, move one role forward, and protect your recruiting momentum."
        tabs={[
          { label: "Dashboard", href: "/dashboard", active: true },
          { label: "Applications", href: "/applications" },
          { label: "Postings", href: "/postings/internships" },
          { label: "Interview Prep", href: "/interview" },
          { label: "Calendar", href: "/calendar" },
          { label: "Rewards", href: "/rewards" },
          { label: "Settings", href: "/settings" }
        ]}
      />
      {searchParams?.message && (
        <p className="rounded-2xl border border-sky/20 bg-sky/10 p-3 text-sm font-bold text-sky-600">{searchParams.message}</p>
      )}

      <section className="dashboard-overlap grid gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">
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
        </aside>
      </section>
    </main>
  );
}
