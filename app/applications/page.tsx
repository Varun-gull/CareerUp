import { BriefcaseBusiness, CheckCircle2, Clock3, MessageSquareText, Plus, Search, Trophy } from "lucide-react";
import Link from "next/link";
import { ApplicationPipelineBoard } from "@/components/ApplicationPipelineBoard";
import { DashboardCard } from "@/components/DashboardCard";
import { EmptyState } from "@/components/EmptyState";
import { Navbar } from "@/components/Navbar";
import { getApplications } from "@/lib/data";
import type { Application, ApplicationStatus } from "@/lib/types";

const pipelineColumns: Array<{
  status: ApplicationStatus;
  title: string;
  helper: string;
}> = [
  { status: "saved", title: "Saved", helper: "Ready to review" },
  { status: "applied", title: "Applied", helper: "Submitted" },
  { status: "interviewing", title: "Interviewing", helper: "Active loops" },
  { status: "offer", title: "Offer", helper: "Wins" },
  { status: "rejected", title: "Rejected", helper: "Closed" }
];

function matchesSearch(application: Application, query: string) {
  if (!query) {
    return true;
  }

  const haystack = `${application.company} ${application.role} ${application.location}`.toLowerCase();
  return haystack.includes(query.toLowerCase());
}

export default async function ApplicationsPage({
  searchParams
}: {
  searchParams?: {
    q?: string;
    status?: ApplicationStatus | "all";
    message?: string;
  };
}) {
  const applications = await getApplications();
  const query = searchParams?.q?.trim() ?? "";
  const statusFilter = pipelineColumns.some((column) => column.status === searchParams?.status) ? searchParams?.status : "all";
  const visibleApplications = applications.filter((application) => matchesSearch(application, query) && (statusFilter === "all" || application.status === statusFilter));
  const savedCount = applications.filter((application) => application.status === "saved").length;
  const appliedCount = applications.filter((application) => application.status !== "saved").length;
  const interviewingCount = applications.filter((application) => application.status === "interviewing").length;
  const offerCount = applications.filter((application) => application.status === "offer").length;

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
        {searchParams?.message && <p className="mt-5 rounded-lg bg-purple-50 p-3 text-sm font-bold text-purple-900">{searchParams.message}</p>}
        {applications.length > 0 ? (
          <>
            <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              <DashboardCard title="Tracked" value={applications.length.toString()} helper="Total roles in your pipeline." icon={BriefcaseBusiness} />
              <DashboardCard title="Saved" value={savedCount.toString()} helper="Review and apply when ready." icon={Clock3} />
              <DashboardCard title="Applied" value={appliedCount.toString()} helper="Roles moved beyond saved." icon={CheckCircle2} />
              <DashboardCard title="Interviewing" value={interviewingCount.toString()} helper="Active interview loops." icon={MessageSquareText} />
              <DashboardCard title="Offers" value={offerCount.toString()} helper="Unlocked wins." icon={Trophy} />
            </section>

            <form className="card mt-6 grid gap-4 p-5 md:grid-cols-[1fr_220px_auto]">
              <label className="grid gap-2 text-sm font-bold text-slate-700">
                Search
                <input name="q" defaultValue={query} className="rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-purple-600" placeholder="Company, role, or location" />
              </label>
              <label className="grid gap-2 text-sm font-bold text-slate-700">
                Status
                <select name="status" defaultValue={statusFilter} className="rounded-lg border border-slate-200 bg-white px-4 py-3 outline-none focus:border-purple-600">
                  <option value="all">All statuses</option>
                  {pipelineColumns.map((column) => (
                    <option key={column.status} value={column.status}>
                      {column.title}
                    </option>
                  ))}
                </select>
              </label>
              <button type="submit" className="primary-button self-end">
                <Search className="mr-2" size={18} /> Filter
              </button>
            </form>

            <ApplicationPipelineBoard applications={visibleApplications} columns={pipelineColumns} />
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
