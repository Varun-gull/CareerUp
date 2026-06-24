import { RotateCcw, Search } from "lucide-react";
import Link from "next/link";
import { EmptyState } from "@/components/EmptyState";
import { Navbar } from "@/components/Navbar";
import { PostingsSearchForm } from "@/components/PostingsSearchForm";
import { PostingsTable } from "@/components/PostingsTable";
import { getApplications, getCurrentProfile } from "@/lib/data";
import { searchInternshipPostings, type PostingKind } from "@/lib/postings";
import type { InternshipPosting } from "@/lib/types";

type RemoteFilter = "all" | "remote" | "hybrid" | "onsite";
type PostingSort = "fit" | "newest" | "company";

const internshipRoleExamples = [
  "Software Engineering Intern",
  "Data Science Intern",
  "Machine Learning Intern",
  "AI Intern",
  "Product Management Intern",
  "Data Analyst Intern",
  "Frontend Intern",
  "Backend Intern",
  "Cybersecurity Intern"
];

const newGradRoleExamples = [
  "Software Engineer New Grad",
  "Data Analyst New Grad",
  "Machine Learning Engineer New Grad",
  "Associate Product Manager",
  "Business Analyst New Grad",
  "Cloud Engineer Entry Level",
  "AI Engineer New Grad"
];

const locationExamples = ["Remote", "Hybrid", "New York", "San Francisco", "Washington DC", "Seattle", "Boston", "Austin", "Chicago"];

function uniqueExamples(values: string[]) {
  return Array.from(new Set(values.map((value) => value.trim()).filter(Boolean))).slice(0, 12);
}

function filterPostings(postings: InternshipPosting[], remote: RemoteFilter, minFit: number) {
  return postings.filter((posting) => {
    const remoteMatch = remote === "all" || posting.workMode === remote;
    return remoteMatch && posting.fitScore >= minFit;
  });
}

function sortPostings(postings: InternshipPosting[], sort: PostingSort) {
  return [...postings].sort((a, b) => {
    if (sort === "company") {
      return a.company.localeCompare(b.company);
    }

    if (sort === "newest") {
      const bDate = Date.parse(b.postedAt) || 0;
      const aDate = Date.parse(a.postedAt) || 0;
      return bDate - aDate;
    }

    return b.fitScore - a.fitScore;
  });
}

function activeTabClass(active: boolean) {
  return active ? "bg-purple-800 text-white shadow-lg shadow-purple-800/20" : "bg-white text-slate-700 ring-1 ring-slate-200 hover:text-purple-800";
}

function buildReturnHref(kind: PostingKind, searchParams?: { q?: string; location?: string; remote?: RemoteFilter; minFit?: string; sort?: PostingSort }) {
  const basePath = kind === "new-grad" ? "/postings/new-grad" : "/postings/internships";
  const params = new URLSearchParams();

  if (searchParams?.q) params.set("q", searchParams.q);
  if (searchParams?.location) params.set("location", searchParams.location);
  if (searchParams?.remote) params.set("remote", searchParams.remote);
  if (searchParams?.minFit) params.set("minFit", searchParams.minFit);
  params.set("sort", "fit");

  return `${basePath}?${params.toString()}`;
}

export async function PostingsPageView({
  kind,
  searchParams,
}: {
  kind: PostingKind;
  searchParams?: {
    q?: string;
    location?: string;
    remote?: RemoteFilter;
    minFit?: string;
    sort?: PostingSort;
    message?: string;
  };
}) {
  const profile = await getCurrentProfile();
  const remoteFilter = searchParams?.remote === "remote" || searchParams?.remote === "hybrid" || searchParams?.remote === "onsite" ? searchParams.remote : "all";
  const sort = searchParams?.sort === "newest" || searchParams?.sort === "company" ? searchParams.sort : "fit";
  const minFit = Math.min(95, Math.max(0, Number(searchParams?.minFit ?? 0) || 0));
  const submittedQuery = typeof searchParams?.q === "string" ? searchParams.q.trim() : "";
  const submittedLocation = typeof searchParams?.location === "string" ? searchParams.location.trim() : "";
  const roleExamples = kind === "new-grad" ? newGradRoleExamples : internshipRoleExamples;
  const roleSuggestions = uniqueExamples([...profile.targetRoles, ...profile.resumeKeywords, ...roleExamples]);
  const locationSuggestions = uniqueExamples([...profile.targetLocations, ...locationExamples]);
  const searchResult = await searchInternshipPostings({
    query: submittedQuery,
    location: submittedLocation,
    profile,
    kind
  });
  const applications = await getApplications();
  const savedSourceUrls = new Set(applications.map((application) => application.source).filter((source) => source.startsWith("http")));
  const postings = sortPostings(filterPostings(searchResult.postings, remoteFilter, minFit), sort);
  const pageTitle = kind === "new-grad" ? "New grad postings" : "Internship postings";
  const pageCopy =
    kind === "new-grad"
      ? "Search current entry-level and new graduate roles from Jobright, Intern-list, GitHub, and live job APIs."
      : "Search current internship-style roles from Jobright, Intern-list, GitHub, and live job APIs.";
  const resetHref = kind === "new-grad" ? "/postings/new-grad" : "/postings/internships";
  const returnHref = buildReturnHref(kind, searchParams);

  return (
    <>
      <Navbar />
      <main className="page-shell">
        <div className="flex flex-wrap items-start justify-between gap-5 border-b border-slate-200 pb-6">
          <div>
            <p className="eyebrow">Live search</p>
            <h1 className="mt-2 text-4xl font-black text-ink">{pageTitle}</h1>
            <p className="mt-2 max-w-3xl text-slate-600">{pageCopy}</p>
          </div>
          <div className="flex gap-2">
            <Link href="/postings/internships" className={`rounded-lg px-4 py-2 text-sm font-black transition ${activeTabClass(kind === "internship")}`}>
              Internships
            </Link>
            <Link href="/postings/new-grad" className={`rounded-lg px-4 py-2 text-sm font-black transition ${activeTabClass(kind === "new-grad")}`}>
              New Grad
            </Link>
          </div>
        </div>

        {searchParams?.message && <p className="mt-5 rounded-lg bg-purple-50 p-3 text-sm font-bold text-purple-900">{searchParams.message}</p>}

        <PostingsSearchForm
          roleSuggestions={roleSuggestions}
          locationSuggestions={locationSuggestions}
          defaultQuery={submittedQuery}
          defaultLocation={submittedLocation}
          locationPlaceholder={profile.targetLocations[0] ?? "Remote"}
          remoteFilter={remoteFilter}
          minFit={minFit}
        />

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm font-bold text-slate-600">
          <Link href={resetHref} className="inline-flex items-center rounded-full bg-white px-3 py-1 text-xs text-slate-700 ring-1 ring-slate-200 hover:text-purple-800">
            <RotateCcw className="mr-1" size={14} /> Reset
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <span>
              Showing {postings.length} of {searchResult.postings.length} results
            </span>
            <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-black text-purple-800 ring-1 ring-purple-100">Sorted by best fit</span>
          </div>
        </div>

        {postings.length > 0 ? (
          <PostingsTable postings={postings} returnTo={returnHref} savedSourceUrls={savedSourceUrls} />
        ) : (
          <div className="mt-8">
            <EmptyState icon={Search} title="No postings found" description="Try a broader keyword, clear the location, or lower the minimum fit." actionHref={resetHref} actionLabel="Reset search" />
          </div>
        )}
      </main>
    </>
  );
}
