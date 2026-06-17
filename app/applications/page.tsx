import { BriefcaseBusiness, CheckCircle2, Clock3, MessageSquareText, Plus } from "lucide-react";
import Link from "next/link";
import { ApplicationCard } from "@/components/ApplicationCard";
import { DashboardCard } from "@/components/DashboardCard";
import { EmptyState } from "@/components/EmptyState";
import { Navbar } from "@/components/Navbar";
import { getApplications } from "@/lib/data";

export default async function ApplicationsPage() {
  const applications = await getApplications();
  const savedCount = applications.filter((application) => application.status === "saved").length;
  const appliedCount = applications.filter((application) => application.status === "applied").length;
  const interviewingCount = applications.filter((application) => application.status === "interviewing").length;

  return (
    <>
      <Navbar />
      <main className="page-shell">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Pipeline</p>
            <h1 className="mt-2 text-4xl font-black text-ink">Applications</h1>
            <p className="mt-2 text-slate-600">Track every role from saved to offer without losing momentum.</p>
          </div>
          <Link href="/applications/new" className="primary-button">
            <Plus className="mr-2" size={18} /> Add role
          </Link>
        </div>
        {applications.length > 0 ? (
          <>
            <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <DashboardCard title="Tracked" value={applications.length.toString()} helper="Total roles in your pipeline." icon={BriefcaseBusiness} />
              <DashboardCard title="Saved" value={savedCount.toString()} helper="Review and apply when ready." icon={Clock3} />
              <DashboardCard title="Applied" value={appliedCount.toString()} helper="Applications submitted." icon={CheckCircle2} />
              <DashboardCard title="Interviewing" value={interviewingCount.toString()} helper="Active interview loops." icon={MessageSquareText} />
            </section>
            <div className="mt-6 grid gap-4">
              {applications.map((application) => (
                <ApplicationCard key={application.id} application={application} />
              ))}
            </div>
          </>
        ) : (
          <div className="mt-8">
            <EmptyState icon={Plus} title="No applications yet" description="Add your first internship to start earning XP and building your streak." actionHref="/applications/new" actionLabel="Add first role" />
          </div>
        )}
      </main>
    </>
  );
}
