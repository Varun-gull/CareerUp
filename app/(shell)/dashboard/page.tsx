import { CheckCircle2, Flame, Sparkles, Trophy } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { ChallengeCard } from "@/components/ChallengeCard";
import { WeeklyCalendarSnapshot } from "@/components/WeeklyCalendarSnapshot";
import { getApplications, getCalendarEvents, getChallenges, getCurrentProfile } from "@/lib/data";

function StatCard({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <section className="card flex min-h-40 flex-col justify-between gap-6 p-5 transition hover:-translate-y-0.5 hover:bg-white/95">
      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#8b5e3c] text-white shadow-sm">
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
          { label: "Messages", href: "/messages" }
        ]}
      />
      {searchParams?.message && (
        <p className="rounded-2xl border border-[#d7a86e]/30 bg-[#fff7ed] p-3 text-sm font-bold text-[#7c4f2d]">{searchParams.message}</p>
      )}

      <section className="dashboard-overlap space-y-5">
        <div className="dashboard-layer">
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard icon={Sparkles} label="Total XP" value={profile.xp.toLocaleString()} />
            <StatCard icon={Flame} label="Day streak" value={profile.streak.toLocaleString()} />
            <StatCard icon={CheckCircle2} label="Applications sent" value={appliedCount.toLocaleString()} />
            <StatCard icon={Trophy} label="Offers" value={offerCount.toLocaleString()} />
          </div>
        </div>

        <div className="dashboard-layer grid gap-5 xl:grid-cols-[minmax(0,1fr)_420px] xl:items-stretch">
          <WeeklyCalendarSnapshot events={calendarEvents} />
          <section className="card flex h-full flex-col p-5">
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="eyebrow">XP quests</p>
                <h2 className="mt-1 text-2xl font-bold text-ink">Daily challenges</h2>
              </div>
              <span className="rounded-full bg-[#fff7ed] px-3 py-1 text-xs font-bold text-[#7c4f2d] ring-1 ring-[#ead7bf]">3 today</span>
            </div>
            <div className="mt-4 grid flex-1 content-start gap-4">
              {[...challenges.tiered, ...challenges.oneOff].slice(0, 3).map((challenge) => (
                <ChallengeCard key={challenge.id} challenge={challenge} />
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
