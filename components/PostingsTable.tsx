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
    return "bg-blue-50 text-blue-700 ring-blue-200";
  }

  return "bg-violet-50 text-brand ring-violet-200";
}

function fitTone(fitScore: number) {
  if (fitScore >= 80) {
    return "bg-emerald-50 text-emerald-700";
  }

  if (fitScore >= 70) {
    return "bg-violet-50 text-brand";
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
    <div className="mt-6 overflow-hidden rounded-3xl border border-white/70 bg-white/95 shadow-strong backdrop-blur-xl">
      <div className="divide-y divide-slate-100 md:hidden">
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
            <article key={posting.id} className="p-4">
              <div className="flex items-start gap-3">
                <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-xs font-black text-white">{index + 1}</span>
                <div className="min-w-0 flex-1">
                  <p className="font-black leading-tight text-ink">{posting.title}</p>
                  <p className="mt-1 text-xs font-bold text-brand">{posting.company}</p>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold text-slate-600">
                    <span className={`rounded-full px-2.5 py-1 font-black ring-1 ${workModeTone(posting.workMode)}`}>{workModeLabel(posting.workMode)}</span>
                    <span className={`rounded-full px-2.5 py-1 font-black ${fitTone(posting.fitScore)}`}>{posting.fitScore}% fit</span>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1">{posting.postedAt}</span>
                  </div>
                  <p className="mt-3 line-clamp-2 text-sm font-semibold text-slate-600">{posting.location}</p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <a
                  href={posting.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-10 items-center justify-center rounded-2xl bg-emerald-600 px-3 text-sm font-black text-white shadow-sm transition hover:bg-emerald-700"
                >
                  <ExternalLink className="mr-1.5" size={15} /> Apply
                </a>
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
                        ? "inline-flex min-h-10 w-full cursor-default items-center justify-center rounded-2xl bg-emerald-50 px-3 text-sm font-black text-emerald-700 ring-1 ring-emerald-200"
                        : "inline-flex min-h-10 w-full items-center justify-center rounded-2xl bg-brand px-3 text-sm font-black text-white shadow-sm transition hover:bg-violet-800"
                    }
                  >
                    {saved ? <CheckCircle2 className="mr-1.5" size={15} /> : <BookmarkPlus className="mr-1.5" size={15} />}
                    {saved ? "Saved" : "Save"}
                  </button>
                </form>
              </div>

              <Link
                href={insightHref}
                className="mt-2 inline-flex min-h-9 w-full items-center justify-center rounded-2xl bg-violet-50 px-3 text-xs font-black text-brand ring-1 ring-violet-200"
              >
                <UsersRound className="mr-1.5" size={14} />
                {peerInsight?.trackedCount ?? 0} tracked · {peerInsight?.interviewedCount ?? 0} interviewing
              </Link>
            </article>
          );
        })}
      </div>

      <div className="hidden overflow-hidden md:block">
        <table className="w-full table-fixed border-collapse text-left text-sm">
          <thead className="bg-slate-950 text-xs font-black uppercase text-slate-300">
            <tr>
              <th className="hidden w-10 px-2 py-4 lg:table-cell">#</th>
              <th className="w-[32%] px-3 py-4">Position</th>
              <th className="hidden w-20 px-2 py-4 xl:table-cell">Date</th>
              <th className="w-24 px-2 py-4">Apply</th>
              <th className="hidden w-28 px-2 py-4 md:table-cell">Mode</th>
              <th className="w-[20%] px-3 py-4">Location</th>
              <th className="hidden w-[16%] px-3 py-4 lg:table-cell">Company</th>
              <th className="hidden w-28 px-2 py-4 xl:table-cell">Peers</th>
              <th className="w-16 px-2 py-4">Fit</th>
              <th className="w-24 px-2 py-4">Save</th>
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
              <tr key={posting.id} className="align-middle transition hover:bg-violet-50/45">
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
                    className="inline-flex min-h-9 items-center justify-center rounded-2xl bg-emerald-600 px-3 text-xs font-black text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-700"
                  >
                    <ExternalLink className="mr-1" size={14} /> Apply
                  </a>
                </td>
                <td className="hidden whitespace-nowrap px-2 py-3 md:table-cell">
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-black ring-1 ${workModeTone(posting.workMode)}`}>{workModeLabel(posting.workMode)}</span>
                </td>
                <td className="px-3 py-3">
                  <p className="truncate font-bold text-slate-700" title={posting.location}>
                    {posting.location}
                  </p>
                </td>
                <td className="hidden px-3 py-3 lg:table-cell">
                  <p className="truncate font-black text-brand" title={posting.company}>
                    {posting.company}
                  </p>
                </td>
                <td className="hidden px-2 py-3 xl:table-cell">
                  <Link
                    href={insightHref}
                    className="inline-flex min-h-9 w-full items-center justify-center rounded-2xl bg-violet-50 px-2 text-xs font-black text-brand ring-1 ring-violet-200 transition hover:bg-violet-100"
                    title="See who else tracked this role"
                  >
                    <UsersRound className="mr-1" size={14} />
                    {peerInsight?.trackedCount ?? 0}
                    <span className="ml-1 text-[10px] text-brand">/{peerInsight?.interviewedCount ?? 0} int</span>
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
                          ? "inline-flex min-h-9 w-full cursor-default items-center justify-center rounded-2xl bg-emerald-50 px-2 text-xs font-black text-emerald-700 ring-1 ring-emerald-200"
                          : "inline-flex min-h-9 w-full items-center justify-center rounded-2xl bg-brand px-2 text-xs font-black text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-violet-800"
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
