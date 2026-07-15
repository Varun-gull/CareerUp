import { ChevronLeft, ChevronRight, RotateCcw, Search } from "lucide-react";
import Link from "next/link";
import { EmptyState } from "@/components/EmptyState";
import { Navbar } from "@/components/Navbar";
import { PostingsSearchForm } from "@/components/PostingsSearchForm";
import { PostingsTable } from "@/components/PostingsTable";
import { RolePeerSetupNotice } from "@/components/RolePeerSetupNotice";
import { getApplications, getCurrentProfile, getRolePeerFeatureStatus, getRolePeerInsights } from "@/lib/data";
import { getPostingRecencyScore, searchCachedPostings, searchInternshipPostings, type PostingKind } from "@/lib/postings";
import { buildRoleKey } from "@/lib/role-key";
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
const POSTINGS_PER_PAGE = 50;
const POSTINGS_FETCH_LIMIT = 2000;

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
      const aRecency = getPostingRecencyScore(a.postedAt);
      const bRecency = getPostingRecencyScore(b.postedAt);

      if (aRecency === bRecency) {
        return 0;
      }

      return aRecency - bRecency;
    }

    const fitDifference = b.fitScore - a.fitScore;

    if (fitDifference !== 0) {
      return fitDifference;
    }

    const aRecency = getPostingRecencyScore(a.postedAt);
    const bRecency = getPostingRecencyScore(b.postedAt);

    if (aRecency === bRecency) {
      return 0;
    }

    return aRecency - bRecency;
  });
}

function activeTabClass(active: boolean) {
  return active ? "bg-sky text-white shadow-glow" : "bg-slate-50 text-slate-700 ring-1 ring-slate-200 hover:text-sky";
}

function buildPostingsHref(
  kind: PostingKind,
  searchParams?: { q?: string; location?: string; remote?: RemoteFilter; minFit?: string; sort?: PostingSort },
  overrides?: { sort?: PostingSort; page?: number }
) {
  const basePath = kind === "new-grad" ? "/postings/new-grad" : "/postings/internships";
  const params = new URLSearchParams();

  if (searchParams?.q) params.set("q", searchParams.q);
  if (searchParams?.location) params.set("location", searchParams.location);
  if (searchParams?.remote) params.set("remote", searchParams.remote);
  if (searchParams?.minFit) params.set("minFit", searchParams.minFit);
  params.set("sort", overrides?.sort ?? searchParams?.sort ?? "newest");
  if (overrides?.page && overrides.page > 1) params.set("page", String(overrides.page));

  return `${basePath}?${params.toString()}`;
}

function getVisiblePages(currentPage: number, totalPages: number): (number | "…")[] {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
  const pages: (number | "…")[] = [1];
  if (currentPage > 3) pages.push("…");
  for (let p = Math.max(2, currentPage - 1); p <= Math.min(totalPages - 1, currentPage + 1); p++) pages.push(p);
  if (currentPage < totalPages - 2) pages.push("…");
  pages.push(totalPages);
  return pages;
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
    page?: string;
    message?: string;
  };
}) {
  const profile = await getCurrentProfile();
  const remoteFilter = searchParams?.remote === "remote" || searchParams?.remote === "hybrid" || searchParams?.remote === "onsite" ? searchParams.remote : "all";
  const sort = searchParams?.sort === "fit" || searchParams?.sort === "company" ? searchParams.sort : "newest";
  const minFit = Math.min(95, Math.max(0, Number(searchParams?.minFit ?? 0) || 0));
  const requestedPage = Math.max(1, Number(searchParams?.page ?? 1) || 1);
  const submittedQuery = typeof searchParams?.q === "string" ? searchParams.q.trim() : "";
  const submittedLocation = typeof searchParams?.location === "string" ? searchParams.location.trim() : "";
  const roleExamples = kind === "new-grad" ? newGradRoleExamples : internshipRoleExamples;
  const roleSuggestions = uniqueExamples([...profile.targetRoles, ...profile.resumeKeywords, ...roleExamples]);
  const locationSuggestions = uniqueExamples([...profile.targetLocations, ...locationExamples]);
  const cachedSearchResult = await searchCachedPostings({
    query: submittedQuery,
    location: submittedLocation,
    profile,
    kind,
    remote: remoteFilter,
    minFit,
    sort,
    limit: POSTINGS_FETCH_LIMIT
  });
  const searchResult = cachedSearchResult ?? await searchInternshipPostings({
    query: submittedQuery,
    location: submittedLocation,
    profile,
    kind
  });
  const applications = await getApplications();
  const savedSourceUrls = new Set(applications.map((application) => application.source).filter((source) => source.startsWith("http")));
  const allPostings = searchResult.cached ? searchResult.postings : sortPostings(filterPostings(searchResult.postings, remoteFilter, minFit), sort);
  const totalPages = Math.max(1, Math.ceil(allPostings.length / POSTINGS_PER_PAGE));
  const currentPage = Math.min(requestedPage, totalPages);
  const pageStart = (currentPage - 1) * POSTINGS_PER_PAGE;
  const postings = allPostings.slice(pageStart, pageStart + POSTINGS_PER_PAGE);
  const [peerInsights, peerFeatureStatus] = await Promise.all([
    getRolePeerInsights(postings.map((posting) => buildRoleKey(posting.company, posting.title))),
    getRolePeerFeatureStatus()
  ]);
  const pageTitle = kind === "new-grad" ? "New grad postings" : "Internship postings";
  const pageCopy =
    kind === "new-grad"
      ? "Search current entry-level and new graduate roles from Jobright, Intern-list, and curated GitHub sources."
      : "Search current internship-style roles from Jobright, Intern-list, and curated GitHub sources.";
  const resetHref = kind === "new-grad" ? "/postings/new-grad" : "/postings/internships";
  const returnHref = buildPostingsHref(kind, searchParams, { page: currentPage });
  const bestFitHref = buildPostingsHref(kind, searchParams, { sort: "fit", page: 1 });
  const newestHref = buildPostingsHref(kind, searchParams, { sort: "newest", page: 1 });
  const visiblePages = getVisiblePages(currentPage, totalPages);

  return (
    <>
      <Navbar />
      <main className="page-shell">
        <div className="page-hero flex flex-wrap items-start justify-between gap-5">
          <div>
            <p className="eyebrow">Live search</p>
            <h1 className="mt-2 text-4xl font-black text-ink sm:text-5xl">{pageTitle}</h1>
            <p className="mt-2 max-w-3xl text-slate-600">{pageCopy}</p>
          </div>
          <div className="flex gap-2">
            <Link href="/postings/internships" className={`rounded-xl px-4 py-2 text-sm font-black transition ${activeTabClass(kind === "internship")}`}>
              Internships
            </Link>
            <Link href="/postings/new-grad" className={`rounded-xl px-4 py-2 text-sm font-black transition ${activeTabClass(kind === "new-grad")}`}>
              New Grad
            </Link>
          </div>
        </div>

        {searchParams?.message && <p className="mt-5 rounded-2xl border border-sky/20 bg-sky/10 p-3 text-sm font-bold text-sky">{searchParams.message}</p>}
        <RolePeerSetupNotice status={peerFeatureStatus} />

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
          <Link href={resetHref} className="inline-flex items-center rounded-full bg-slate-50 px-3 py-1 text-xs text-slate-700 shadow-sm ring-1 ring-slate-200 hover:text-sky">
            <RotateCcw className="mr-1" size={14} /> Reset
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <span>
              {allPostings.length > 0 ? `Showing ${pageStart + 1}-${pageStart + postings.length} of ${allPostings.length} results` : "Showing 0 results"}
              {searchResult.cached ? " from cache" : ""}
            </span>
            {allPostings.length > 0 && (
              <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-black text-slate-700 shadow-sm ring-1 ring-slate-200">
                Page {currentPage} of {totalPages}
              </span>
            )}
            <span className="inline-flex overflow-hidden rounded-full bg-slate-50 text-xs font-black shadow-sm ring-1 ring-slate-200">
              <Link href={bestFitHref} className={sort === "fit" ? "bg-sky px-3 py-1 text-white" : "px-3 py-1 text-slate-600 hover:text-sky"}>
                Best fit
              </Link>
              <Link href={newestHref} className={sort === "newest" ? "bg-sky px-3 py-1 text-white" : "px-3 py-1 text-slate-600 hover:text-sky"}>
                Latest posted
              </Link>
            </span>
          </div>
        </div>

        {postings.length > 0 ? (
          <>
            <PostingsTable postings={postings} returnTo={returnHref} savedSourceUrls={savedSourceUrls} peerInsights={peerInsights} />
            {totalPages > 1 && (
              <nav className="mt-5 flex items-center justify-center gap-1 text-sm font-black" aria-label="Posting pages">
                <Link
                  href={buildPostingsHref(kind, searchParams, { page: Math.max(1, currentPage - 1) })}
                  className={`flex items-center gap-1 rounded-xl px-3 py-2 transition ${currentPage === 1 ? "pointer-events-none text-slate-300" : "text-slate-600 hover:bg-slate-100 hover:text-sky"}`}
                  aria-disabled={currentPage === 1}
                >
                  <ChevronLeft size={16} /> Previous
                </Link>

                {visiblePages.map((page, i) =>
                  page === "…" ? (
                    <span key={`ellipsis-${i}`} className="px-2 py-2 text-slate-400">···</span>
                  ) : (
                    <Link
                      key={page}
                      href={buildPostingsHref(kind, searchParams, { page })}
                      className={`min-w-[2.25rem] rounded-xl px-3 py-2 text-center transition ${
                        page === currentPage
                          ? "bg-slate-900 text-white shadow-sm ring-1 ring-slate-700"
                          : "text-slate-600 hover:bg-slate-100 hover:text-sky"
                      }`}
                      aria-current={page === currentPage ? "page" : undefined}
                    >
                      {page}
                    </Link>
                  )
                )}

                <Link
                  href={buildPostingsHref(kind, searchParams, { page: Math.min(totalPages, currentPage + 1) })}
                  className={`flex items-center gap-1 rounded-xl px-3 py-2 transition ${currentPage === totalPages ? "pointer-events-none text-slate-300" : "text-slate-600 hover:bg-slate-100 hover:text-sky"}`}
                  aria-disabled={currentPage === totalPages}
                >
                  Next <ChevronRight size={16} />
                </Link>
              </nav>
            )}
          </>
        ) : (
          <div className="mt-8">
            <EmptyState icon={Search} title="No postings found" description="Try a broader keyword, clear the location, or lower the minimum fit." actionHref={resetHref} actionLabel="Reset search" />
          </div>
        )}
      </main>
    </>
  );
}
