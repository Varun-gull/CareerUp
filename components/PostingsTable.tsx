import { BookmarkPlus, ExternalLink, FileText } from "lucide-react";
import { savePostingApplication } from "@/lib/applications/actions";
import type { InternshipPosting } from "@/lib/types";

function workModeTone(workMode: InternshipPosting["workMode"]) {
  if (workMode === "remote") {
    return "bg-emerald-50 text-emerald-700 ring-emerald-200";
  }

  if (workMode === "hybrid") {
    return "bg-blue-50 text-blue-700 ring-blue-200";
  }

  return "bg-violet-50 text-violet-700 ring-violet-200";
}

function fitTone(fitScore: number) {
  if (fitScore >= 80) {
    return "bg-emerald-50 text-emerald-700";
  }

  if (fitScore >= 70) {
    return "bg-blue-50 text-blue-700";
  }

  return "bg-slate-100 text-slate-700";
}

function workModeLabel(workMode: InternshipPosting["workMode"]) {
  return workMode === "remote" ? "Remote" : workMode === "hybrid" ? "Hybrid" : "On-site";
}

export function PostingsTable({ postings }: { postings: InternshipPosting[] }) {
  return (
    <div className="mt-6 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] border-collapse text-left text-sm">
          <thead className="bg-slate-50 text-xs font-black uppercase tracking-wide text-slate-500">
            <tr>
              <th className="w-12 border-b border-slate-200 px-4 py-3">#</th>
              <th className="border-b border-slate-200 px-4 py-3">Position Title</th>
              <th className="border-b border-slate-200 px-4 py-3">Date</th>
              <th className="border-b border-slate-200 px-4 py-3">Apply</th>
              <th className="border-b border-slate-200 px-4 py-3">Work Model</th>
              <th className="border-b border-slate-200 px-4 py-3">Location</th>
              <th className="border-b border-slate-200 px-4 py-3">Company</th>
              <th className="border-b border-slate-200 px-4 py-3">Fit</th>
              <th className="border-b border-slate-200 px-4 py-3">CareerUp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {postings.map((posting, index) => (
              <tr key={posting.id} className="align-middle transition hover:bg-blue-50/40">
                <td className="px-4 py-3 text-center font-bold text-slate-400">{index + 1}</td>
                <td className="max-w-[340px] px-4 py-3">
                  <p className="truncate font-black text-ink" title={posting.title}>
                    {posting.title}
                  </p>
                  <p className="mt-1 truncate text-xs font-bold text-slate-500">{posting.source}</p>
                </td>
                <td className="whitespace-nowrap px-4 py-3 font-bold text-slate-600">{posting.postedAt}</td>
                <td className="px-4 py-3">
                  <a
                    href={posting.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-8 items-center justify-center rounded-md bg-emerald-600 px-3 text-xs font-black text-white shadow-sm transition hover:bg-emerald-700"
                  >
                    <ExternalLink className="mr-1" size={14} /> Apply
                  </a>
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  <span className={`inline-flex rounded-md px-2.5 py-1 text-xs font-black ring-1 ${workModeTone(posting.workMode)}`}>{workModeLabel(posting.workMode)}</span>
                </td>
                <td className="max-w-[230px] px-4 py-3">
                  <p className="truncate font-bold text-slate-700" title={posting.location}>
                    {posting.location}
                  </p>
                </td>
                <td className="max-w-[220px] px-4 py-3">
                  <p className="truncate font-black text-blue-700" title={posting.company}>
                    {posting.company}
                  </p>
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-black ${fitTone(posting.fitScore)}`}>{posting.fitScore}%</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <form action="/resume-optimization" method="get">
                      <input type="hidden" name="company" value={posting.company} />
                      <input type="hidden" name="role" value={posting.title} />
                      <input type="hidden" name="description" value={posting.description.slice(0, 1200)} />
                      <input type="hidden" name="tags" value={posting.tags.join(", ")} />
                      <input type="hidden" name="url" value={posting.url} />
                      <button
                        type="submit"
                        className="inline-flex min-h-8 items-center justify-center rounded-md border border-slate-200 px-2.5 text-xs font-black text-slate-700 transition hover:border-blue-300 hover:text-blue-700"
                      >
                        <FileText size={14} />
                      </button>
                    </form>
                    <form action={savePostingApplication}>
                      <input type="hidden" name="company" value={posting.company} />
                      <input type="hidden" name="role" value={posting.title} />
                      <input type="hidden" name="location" value={posting.location} />
                      <input type="hidden" name="sourceUrl" value={posting.url} />
                      <input type="hidden" name="fitScore" value={posting.fitScore} />
                      <button
                        type="submit"
                        className="inline-flex min-h-8 items-center justify-center rounded-md bg-blue-600 px-2.5 text-xs font-black text-white shadow-sm transition hover:bg-blue-700"
                      >
                        <BookmarkPlus className="mr-1" size={14} /> Save
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
