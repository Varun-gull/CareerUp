import { ArrowUpDown, RotateCcw, Search, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { EmptyState } from "@/components/EmptyState";
import { Navbar } from "@/components/Navbar";
import { PostingCard } from "@/components/PostingCard";
import { getCurrentProfile } from "@/lib/data";
import { searchInternshipPostings } from "@/lib/postings";
import type { InternshipPosting } from "@/lib/types";

type RemoteFilter = "all" | "remote" | "onsite";
type PostingSort = "fit" | "newest" | "company";

function filterPostings(postings: InternshipPosting[], remote: RemoteFilter, minFit: number) {
  return postings.filter((posting) => {
    const remoteMatch = remote === "all" || (remote === "remote" ? posting.remote : !posting.remote);
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

export default async function PostingsPage({
  searchParams
}: {
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
  const remoteFilter = searchParams?.remote === "remote" || searchParams?.remote === "onsite" ? searchParams.remote : "all";
  const sort = searchParams?.sort === "newest" || searchParams?.sort === "company" ? searchParams.sort : "fit";
  const minFit = Math.min(95, Math.max(0, Number(searchParams?.minFit ?? 0) || 0));
  const searchResult = await searchInternshipPostings({
    query: searchParams?.q,
    location: searchParams?.location,
    profile
  });
  const postings = sortPostings(filterPostings(searchResult.postings, remoteFilter, minFit), sort);

  return (
    <>
      <Navbar />
      <main className="page-shell">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Live search</p>
            <h1 className="mt-2 text-4xl font-black text-ink">Internship postings</h1>
            <p className="mt-2 max-w-2xl text-slate-600">Search current internship-style roles and save the best fits straight into your tracker.</p>
          </div>
        </div>

        {searchParams?.message && <p className="mt-5 rounded-lg bg-blue-50 p-3 text-sm font-bold text-blue-800">{searchParams.message}</p>}

        <div className="mt-5 grid gap-3 md:grid-cols-[1fr_auto]">
          <div className="rounded-lg border border-slate-200 bg-white/80 px-4 py-3 text-sm font-bold text-slate-600">
            Source: <span className="text-blue-700">{searchResult.provider}</span>
            {searchResult.usingFallback ? " fallback results" : " live results"}
          </div>
          <div className="rounded-lg border border-slate-200 bg-white/80 px-4 py-3 text-sm font-bold text-slate-600">
            Showing <span className="text-ink">{postings.length}</span> of <span className="text-ink">{searchResult.postings.length}</span> results
          </div>
        </div>

        <form className="card mt-8 grid gap-4 p-5 lg:grid-cols-[1.15fr_1fr_0.75fr_0.75fr_0.75fr_auto]">
          <label className="grid gap-2 text-sm font-bold text-slate-700">
            Role or keyword
            <input name="q" defaultValue={searchParams?.q ?? profile.targetRoles[0] ?? ""} className="rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-blue-500" placeholder="Data science intern" />
          </label>
          <label className="grid gap-2 text-sm font-bold text-slate-700">
            Location
            <input name="location" defaultValue={searchParams?.location ?? profile.targetLocations[0] ?? ""} className="rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-blue-500" placeholder="Remote" />
          </label>
          <label className="grid gap-2 text-sm font-bold text-slate-700">
            Work mode
            <select name="remote" defaultValue={remoteFilter} className="rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-blue-500">
              <option value="all">All roles</option>
              <option value="remote">Remote only</option>
              <option value="onsite">On-site only</option>
            </select>
          </label>
          <label className="grid gap-2 text-sm font-bold text-slate-700">
            Minimum fit
            <select name="minFit" defaultValue={minFit.toString()} className="rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-blue-500">
              <option value="0">Any fit</option>
              <option value="60">60%+</option>
              <option value="70">70%+</option>
              <option value="80">80%+</option>
            </select>
          </label>
          <label className="grid gap-2 text-sm font-bold text-slate-700">
            Sort
            <select name="sort" defaultValue={sort} className="rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-blue-500">
              <option value="fit">Best fit</option>
              <option value="newest">Newest</option>
              <option value="company">Company</option>
            </select>
          </label>
          <button type="submit" className="primary-button self-end">
            <Search className="mr-2" size={18} /> Search
          </button>
        </form>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm font-bold text-slate-600">
          <span className="inline-flex items-center gap-2">
            <SlidersHorizontal size={16} /> Search controls
          </span>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center rounded-full bg-white px-3 py-1 text-xs text-slate-700 ring-1 ring-slate-200">
              <ArrowUpDown className="mr-1" size={14} /> {sort === "fit" ? "Best fit" : sort === "newest" ? "Newest" : "Company"}
            </span>
            <Link href="/postings" className="inline-flex items-center rounded-full bg-white px-3 py-1 text-xs text-slate-700 ring-1 ring-slate-200 hover:text-blue-700">
              <RotateCcw className="mr-1" size={14} /> Reset
            </Link>
          </div>
        </div>

        {postings.length > 0 ? (
          <section className="mt-6 grid gap-4">
            {postings.map((posting) => (
              <PostingCard key={posting.id} posting={posting} />
            ))}
          </section>
        ) : (
          <div className="mt-8">
            <EmptyState icon={Search} title="No postings found" description="Try a broader keyword like software intern, data intern, product intern, or remote." actionHref="/postings" actionLabel="Reset search" />
          </div>
        )}
      </main>
    </>
  );
}
