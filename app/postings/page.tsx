import { RotateCcw, Search } from "lucide-react";
import Link from "next/link";
import { EmptyState } from "@/components/EmptyState";
import { Navbar } from "@/components/Navbar";
import { PostingCard } from "@/components/PostingCard";
import { getCurrentProfile } from "@/lib/data";
import { searchInternshipPostings } from "@/lib/postings";
import type { InternshipPosting } from "@/lib/types";

type RemoteFilter = "all" | "remote" | "hybrid" | "onsite";
type PostingSort = "fit" | "newest" | "company";

const roleExamples = [
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
  const remoteFilter = searchParams?.remote === "remote" || searchParams?.remote === "hybrid" || searchParams?.remote === "onsite" ? searchParams.remote : "all";
  const sort = searchParams?.sort === "newest" || searchParams?.sort === "company" ? searchParams.sort : "fit";
  const minFit = Math.min(95, Math.max(0, Number(searchParams?.minFit ?? 0) || 0));
  const roleSuggestions = uniqueExamples([...profile.targetRoles, ...profile.resumeKeywords, ...roleExamples]);
  const locationSuggestions = uniqueExamples([...profile.targetLocations, ...locationExamples]);
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

        {profile.resumeKeywords.length > 0 && (
          <div className="mt-5 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-bold text-blue-800">
            Resume matching active with {profile.resumeKeywords.length} keywords.
          </div>
        )}

        <form className="card mt-8 grid gap-4 p-5 lg:grid-cols-[1.15fr_1fr_0.75fr_0.75fr_auto]">
          <input type="hidden" name="sort" value="fit" />
          <label className="grid gap-2 text-sm font-bold text-slate-700">
            Role or keyword
            <input name="q" list="role-keyword-examples" defaultValue={searchParams?.q ?? profile.targetRoles[0] ?? ""} className="rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-blue-500" placeholder="Data science intern" />
            <datalist id="role-keyword-examples">
              {roleSuggestions.map((example) => (
                <option key={example} value={example} />
              ))}
            </datalist>
          </label>
          <label className="grid gap-2 text-sm font-bold text-slate-700">
            Location
            <input name="location" list="location-examples" defaultValue={searchParams?.location ?? profile.targetLocations[0] ?? ""} className="rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-blue-500" placeholder="Remote" />
            <datalist id="location-examples">
              {locationSuggestions.map((example) => (
                <option key={example} value={example} />
              ))}
            </datalist>
          </label>
          <label className="grid gap-2 text-sm font-bold text-slate-700">
            Work mode
            <select name="remote" defaultValue={remoteFilter} className="rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-blue-500">
              <option value="all">All roles</option>
              <option value="remote">Remote only</option>
              <option value="hybrid">Hybrid only</option>
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
          <button type="submit" className="primary-button self-end">
            <Search className="mr-2" size={18} /> Search
          </button>
        </form>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm font-bold text-slate-600">
          <Link href="/postings" className="inline-flex items-center rounded-full bg-white px-3 py-1 text-xs text-slate-700 ring-1 ring-slate-200 hover:text-blue-700">
            <RotateCcw className="mr-1" size={14} /> Reset
          </Link>
          <span className="text-sm font-bold text-slate-600">
            Showing <span className="text-ink">{postings.length}</span> of <span className="text-ink">{searchResult.postings.length}</span> results
          </span>
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
