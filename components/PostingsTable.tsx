import { BookmarkPlus, CheckCircle2, ExternalLink, UsersRound } from "lucide-react";
import Link from "next/link";
import { savePostingApplication } from "@/lib/applications/actions";
import { buildRoleKey } from "@/lib/role-key";
import type { InternshipPosting, RolePeerInsight } from "@/lib/types";

function workModeTone(workMode: InternshipPosting["workMode"]) {
  if (workMode === "remote") {
    return "bg-emerald-50 text-emerald-700 ring-emerald-200";
  }

  if (workMode === "hybrid") {
    return "bg-purple-50 text-purple-800 ring-purple-200";
  }

  return "bg-purple-50 text-purple-800 ring-purple-200";
}

function fitTone(fitScore: number) {
  if (fitScore >= 80) {
    return "bg-emerald-50 text-emerald-700";
  }

  if (fitScore >= 70) {
    return "bg-purple-50 text-purple-800";
  }

  return "bg-slate-100 text-slate-700";
}

function workModeLabel(workMode: InternshipPosting["workMode"]) {
  return workMode === "remote" ? "Remote" : workMode === "hybrid" ? "Hybrid" : "On-site";
}

export function PostingsTable({
  postings,
  returnTo,
  savedSourceUrls,
  peerInsights,
}: {
  postings: InternshipPosting[];
  returnTo: string;
  savedSourceUrls: Set<string>;
  peerInsights: Map<string, RolePeerInsight>;
}) {
  return (
    <div className="mt-6 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="overflow-hidden">
        <table className="w-full table-fixed border-collapse text-left text-sm">
          <thead className="bg-slate-50 text-xs font-black uppercase tracking-wide text-slate-500">
            <tr>
              <th className="hidden w-10 border-b border-slate-200 px-2 py-3 lg:table-cell">#</th>
              <th className="w-[32%] border-b border-slate-200 px-3 py-3">Position Title</th>
              <th className="hidden w-20 border-b border-slate-200 px-2 py-3 xl:table-cell">Date</th>
              <th className="w-24 border-b border-slate-200 px-2 py-3">Apply</th>
              <th className="hidden w-28 border-b border-slate-200 px-2 py-3 md:table-cell">Work Model</th>
              <th className="w-[20%] border-b border-slate-200 px-3 py-3">Location</th>
              <th className="hidden w-[16%] border-b border-slate-200 px-3 py-3 lg:table-cell">Company</th>
              <th className="hidden w-28 border-b border-slate-200 px-2 py-3 xl:table-cell">Peers</th>
              <th className="w-16 border-b border-slate-200 px-2 py-3">Fit</th>
              <th className="w-24 border-b border-slate-200 px-2 py-3">Save</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {postings.map((posting, index) => {
              const saved = savedSourceUrls.has(posting.url);
              const roleKey = buildRoleKey(posting.company, posting.title);
              const peerInsight = peerInsights.get(roleKey);
              const insightHref = `/postings/insights?${new URLSearchParams({
                roleKey,
                company: posting.company,
                role: posting.title,
                returnTo
              }).toString()}`;

              return (
              <tr key={posting.id} className="align-middle transition hover:bg-purple-50/40">
                <td className="hidden px-2 py-3 text-center font-bold text-slate-400 lg:table-cell">{index + 1}</td>
                <td className="px-3 py-3">
                  <p className="truncate font-black text-ink" title={posting.title}>
                    {posting.title}
                  </p>
                  <p className="mt-1 truncate text-xs font-bold text-slate-500" title={`${posting.company} · ${posting.source}`}>
                    {posting.company} · {posting.source}
                  </p>
                </td>
                <td className="hidden whitespace-nowrap px-2 py-3 font-bold text-slate-600 xl:table-cell">{posting.postedAt}</td>
                <td className="px-2 py-3">
                  <a
                    href={posting.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-8 items-center justify-center rounded-md bg-emerald-600 px-3 text-xs font-black text-white shadow-sm transition hover:bg-emerald-700"
                  >
                    <ExternalLink className="mr-1" size={14} /> Apply
                  </a>
                </td>
                <td className="hidden whitespace-nowrap px-2 py-3 md:table-cell">
                  <span className={`inline-flex rounded-md px-2.5 py-1 text-xs font-black ring-1 ${workModeTone(posting.workMode)}`}>{workModeLabel(posting.workMode)}</span>
                </td>
                <td className="px-3 py-3">
                  <p className="truncate font-bold text-slate-700" title={posting.location}>
                    {posting.location}
                  </p>
                </td>
                <td className="hidden px-3 py-3 lg:table-cell">
                  <p className="truncate font-black text-purple-800" title={posting.company}>
                    {posting.company}
                  </p>
                </td>
                <td className="hidden px-2 py-3 xl:table-cell">
                  <Link
                    href={insightHref}
                    className="inline-flex min-h-8 w-full items-center justify-center rounded-md bg-purple-50 px-2 text-xs font-black text-purple-800 ring-1 ring-purple-200 transition hover:bg-purple-100"
                    title="See who else tracked this role"
                  >
                    <UsersRound className="mr-1" size={14} />
                    {peerInsight?.trackedCount ?? 0}
                    <span className="ml-1 text-[10px] text-purple-600">/{peerInsight?.interviewedCount ?? 0} int</span>
                  </Link>
                </td>
                <td className="whitespace-nowrap px-2 py-3">
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-black ${fitTone(posting.fitScore)}`}>{posting.fitScore}%</span>
                </td>
                <td className="px-2 py-3">
                  <form action={savePostingApplication}>
                    <input type="hidden" name="company" value={posting.company} />
                    <input type="hidden" name="role" value={posting.title} />
                    <input type="hidden" name="location" value={posting.location} />
                    <input type="hidden" name="sourceUrl" value={posting.url} />
                    <input type="hidden" name="fitScore" value={posting.fitScore} />
                    <input type="hidden" name="returnTo" value={returnTo} />
                    <button
                      type="submit"
                      disabled={saved}
                      className={
                        saved
                          ? "inline-flex min-h-8 w-full cursor-default items-center justify-center rounded-md bg-emerald-50 px-2 text-xs font-black text-emerald-700 ring-1 ring-emerald-200"
                          : "inline-flex min-h-8 w-full items-center justify-center rounded-md bg-purple-800 px-2 text-xs font-black text-white shadow-sm transition hover:bg-purple-900"
                      }
                    >
                      {saved ? <CheckCircle2 className="mr-1" size={14} /> : <BookmarkPlus className="mr-1" size={14} />}
                      {saved ? "Saved" : "Save"}
                    </button>
                  </form>
                </td>
              </tr>
            );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
