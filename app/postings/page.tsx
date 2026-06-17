import { Search } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";
import { Navbar } from "@/components/Navbar";
import { PostingCard } from "@/components/PostingCard";
import { getCurrentProfile } from "@/lib/data";
import { searchInternshipPostings } from "@/lib/postings";

export default async function PostingsPage({
  searchParams
}: {
  searchParams?: {
    q?: string;
    location?: string;
    message?: string;
  };
}) {
  const profile = await getCurrentProfile();
  const searchResult = await searchInternshipPostings({
    query: searchParams?.q,
    location: searchParams?.location,
    profile
  });
  const { postings } = searchResult;

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

        <div className="mt-5 rounded-lg border border-slate-200 bg-white/80 px-4 py-3 text-sm font-bold text-slate-600">
          Source: <span className="text-blue-700">{searchResult.provider}</span>
          {searchResult.usingFallback ? " fallback results" : " live results"}
        </div>

        <form className="card mt-8 grid gap-4 p-5 md:grid-cols-[1fr_1fr_auto]">
          <label className="grid gap-2 text-sm font-bold text-slate-700">
            Role or keyword
            <input name="q" defaultValue={searchParams?.q ?? profile.targetRoles[0] ?? ""} className="rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-blue-500" placeholder="Data science intern" />
          </label>
          <label className="grid gap-2 text-sm font-bold text-slate-700">
            Location
            <input name="location" defaultValue={searchParams?.location ?? profile.targetLocations[0] ?? ""} className="rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-blue-500" placeholder="Remote" />
          </label>
          <button type="submit" className="primary-button self-end">
            <Search className="mr-2" size={18} /> Search
          </button>
        </form>

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
