import { ArrowRight, CheckCircle2, Flame, Sparkles, Star } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { ChallengeCard } from "@/components/ChallengeCard";
import { getApplications, getChallenges, getCurrentProfile } from "@/lib/data";
import { searchCachedPostings, searchInternshipPostings } from "@/lib/postings";
import type { PostingKind } from "@/lib/postings";
import type { InternshipPosting } from "@/lib/types";

function StatCard({ icon: Icon, label, value, tone }: { icon: LucideIcon; label: string; value: string; tone: string }) {
  return (
    <section className="card flex min-h-40 flex-col justify-between gap-6 p-5 transition hover:-translate-y-0.5 hover:bg-white/95">
      <span className={`flex h-11 w-11 items-center justify-center rounded-2xl shadow-sm ${tone}`}>
        <Icon size={20} />
      </span>
      <div>
        <p className="text-sm font-semibold text-slate-600">{label}</p>
        <p className="font-display mt-1 text-3xl font-bold tracking-tight text-ink">{value}</p>
      </div>
    </section>
  );
}

function TopFitPostings({ postings }: { postings: InternshipPosting[] }) {
  return (
    <section className="card flex h-full flex-col p-5">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="eyebrow">Best matches</p>
          <h2 className="mt-1 text-2xl font-bold text-ink">Top postings for you</h2>
        </div>
        <Link href="/postings/internships?sort=fit" className="text-sm font-bold text-[#2A6384]">
          View all
        </Link>
      </div>

      <div className="mt-4 grid flex-1 content-start gap-3">
        {postings.length > 0 ? (
          postings.map((posting, index) => (
            <article key={posting.id} className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-wide text-[#2A6384]">#{index + 1} match</p>
                  <h3 className="mt-1 truncate text-base font-bold text-ink">{posting.title}</h3>
                  <p className="mt-1 truncate text-sm font-semibold text-slate-600">{posting.company} · {posting.location}</p>
                </div>
                <span className="shrink-0 rounded-full bg-[#EAF2F8] px-3 py-1 text-xs font-bold text-[#2A6384] ring-1 ring-[#5E7681]/25">
                  {posting.fitScore}% fit
                </span>
              </div>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs font-semibold text-slate-500">{posting.source} · {posting.postedAt}</p>
                <a href={posting.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm font-bold text-[#2A6384]">
                  Open <ArrowRight size={14} />
                </a>
              </div>
            </article>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 p-5 text-sm font-semibold text-slate-600">
            Upload a resume and sync postings to surface your strongest matches here.
          </div>
        )}
      </div>
    </section>
  );
}

async function getDashboardMatches(profile: Awaited<ReturnType<typeof getCurrentProfile>>, kind: PostingKind) {
  const targetedCached = await searchCachedPostings({ profile, kind, sort: "fit", limit: 8 });

  if (targetedCached?.postings.length) {
    return targetedCached.postings;
  }

  const broadCached = await searchCachedPostings({
    profile,
    kind,
    query: "",
    location: "",
    sort: "fit",
    limit: 8
  });

  if (broadCached?.postings.length) {
    return broadCached.postings;
  }

  const liveMatches = await searchInternshipPostings({
    profile,
    kind,
    query: "",
    location: ""
  });

  return liveMatches.postings
    .sort((a, b) => b.fitScore - a.fitScore)
    .slice(0, 8);
}

export default async function DashboardPage({ searchParams }: { searchParams?: { message?: string } }) {
  const [profile, challenges, applications] = await Promise.all([
    getCurrentProfile(),
    getChallenges(),
    getApplications()
  ]);
  const [internshipMatches, newGradMatches] = await Promise.all([
    getDashboardMatches(profile, "internship"),
    getDashboardMatches(profile, "new-grad")
  ]);
  const topFitPostings = [...internshipMatches, ...newGradMatches]
    .sort((a, b) => b.fitScore - a.fitScore)
    .slice(0, 3);

  const appliedCount = applications.filter((application) => application.status !== "saved").length;

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
        <p className="rounded-2xl border border-[#5E7681]/30 bg-[#F8FBFA] p-3 text-sm font-bold text-[#2A6384]">{searchParams.message}</p>
      )}

      <section className="dashboard-overlap space-y-5">
        <div className="dashboard-layer">
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard icon={Sparkles} label="Lifetime XP" value={profile.xp.toLocaleString()} tone="bg-[#2A6384] text-white" />
            <StatCard icon={Star} label="Reward Points" value={profile.rewardPoints.toLocaleString()} tone="bg-[#EAF2F8] text-[#2A6384]" />
            <StatCard icon={Flame} label="Day streak" value={profile.streak.toLocaleString()} tone="bg-[#5E7681] text-white" />
            <StatCard icon={CheckCircle2} label="Applications sent" value={appliedCount.toLocaleString()} tone="bg-[#F8FBFA] text-[#2A6384] ring-1 ring-[#5E7681]/35" />
          </div>
        </div>

        <div className="dashboard-layer grid gap-5 xl:grid-cols-[minmax(0,1fr)_420px] xl:items-stretch">
          <TopFitPostings postings={topFitPostings} />
          <section className="card flex h-full flex-col p-5">
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="eyebrow">XP quests</p>
                <h2 className="mt-1 text-2xl font-bold text-ink">Daily challenges</h2>
              </div>
              <span className="rounded-full bg-[#EAF2F8] px-3 py-1 text-xs font-bold text-[#2A6384] ring-1 ring-[#5E7681]/30">3 today</span>
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
