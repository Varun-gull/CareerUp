import { BriefcaseBusiness, CheckCircle2, Target, Trophy } from "lucide-react";
import Link from "next/link";
import { ApplicationCard } from "@/components/ApplicationCard";
import { ChallengeCard } from "@/components/ChallengeCard";
import { DashboardCard } from "@/components/DashboardCard";
import { Navbar } from "@/components/Navbar";
import { StreakCard } from "@/components/StreakCard";
import { XpProgressBar } from "@/components/XpProgressBar";
import { getApplications, getCurrentProfile } from "@/lib/data";
import { challenges } from "@/lib/mock-data";

export default async function DashboardPage() {
  const [applications, profile] = await Promise.all([getApplications(), getCurrentProfile()]);
  const appliedCount = applications.filter((application) => application.status !== "saved").length;

  return (
    <>
      <Navbar />
      <main className="page-shell">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Command center</p>
            <h1 className="mt-2 text-4xl font-black text-ink">Welcome back, {profile.name}</h1>
            <p className="mt-2 text-slate-600">Today’s goal: move one internship forward and protect your streak.</p>
          </div>
          <Link href="/applications/new" className="primary-button">
            Add internship
          </Link>
        </div>

        <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <DashboardCard title="Total XP" value={profile.xp.toString()} helper="Earned from applications and challenges." icon={Trophy} />
          <DashboardCard title="Applied" value={appliedCount.toString()} helper="Roles moved past saved status." icon={CheckCircle2} />
          <DashboardCard title="Tracked" value={applications.length.toString()} helper="Internships in your pipeline." icon={BriefcaseBusiness} />
          <DashboardCard title="Weekly goal" value="4/7" helper="Applications or updates this week." icon={Target} />
        </section>

        <section className="mt-6 grid gap-5 lg:grid-cols-[1fr_360px]">
          <div className="space-y-5">
            <XpProgressBar xp={profile.xp} />
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-2xl font-black text-ink">Recent applications</h2>
                <Link href="/applications" className="text-sm font-bold text-blue-700">
                  View all
                </Link>
              </div>
              <div className="grid gap-4">
                {applications.slice(0, 2).map((application) => (
                  <ApplicationCard key={application.id} application={application} />
                ))}
              </div>
            </div>
          </div>
          <aside className="space-y-5">
            <StreakCard streak={profile.streak} />
          </aside>
        </section>

        <section className="mt-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">XP quests</p>
              <h2 className="mt-2 text-2xl font-black text-ink">Challenges</h2>
              <p className="mt-2 text-slate-600">Small missions keep your internship search moving without needing a separate page.</p>
            </div>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {challenges.map((challenge) => (
              <ChallengeCard key={challenge.id} challenge={challenge} />
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
