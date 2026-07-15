import { CheckCircle2, Flame, Sparkles, Trophy } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { ChallengeCard } from "@/components/ChallengeCard";
import { WeeklyCalendarSnapshot } from "@/components/WeeklyCalendarSnapshot";
import { getApplications, getCalendarEvents, getChallenges, getCurrentProfile } from "@/lib/data";

function StatCard({ icon: Icon, label, value, tone }: { icon: LucideIcon; label: string; value: string; tone: string }) {
  return (
    <section className="card flex min-h-40 flex-col justify-between gap-6 p-5 transition hover:-translate-y-0.5 hover:bg-white/95">
      <span className={`flex h-11 w-11 items-center justify-center rounded-2xl text-white shadow-sm ${tone}`}>
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
        <p className="rounded-2xl border border-[#6B7C98]/25 bg-white/70 p-3 text-sm font-bold text-[#5E5653]">{searchParams.message}</p>
      )}

      <section className="dashboard-overlap space-y-5">
        <div className="dashboard-layer">
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard icon={Sparkles} label="Total XP" value={profile.xp.toLocaleString()} tone="bg-[#5E5653]" />
            <StatCard icon={Flame} label="Day streak" value={profile.streak.toLocaleString()} tone="bg-[#6B7C98]" />
            <StatCard icon={CheckCircle2} label="Applications sent" value={appliedCount.toLocaleString()} tone="bg-[#7B7F8A]" />
            <StatCard icon={Trophy} label="Offers" value={offerCount.toLocaleString()} tone="bg-[#AB978C]" />
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
              <span className="rounded-full bg-[#E9E6E7] px-3 py-1 text-xs font-bold text-[#5E5653] ring-1 ring-[#7B7F8A]/20">3 today</span>
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
