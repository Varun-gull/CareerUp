import { BookmarkPlus, CalendarDays, ExternalLink, FileText, MapPin, Radio } from "lucide-react";
import { savePostingApplication } from "@/lib/applications/actions";
import type { InternshipPosting } from "@/lib/types";

export function PostingCard({ posting }: { posting: InternshipPosting }) {
  const fitTone = posting.fitScore >= 80 ? "bg-emerald-50 text-emerald-700" : posting.fitScore >= 70 ? "bg-[#C8D9E6]/40 text-[#2F4156]" : "bg-slate-100 text-slate-700";
  const workModeLabel = posting.workMode === "remote" ? "Remote" : posting.workMode === "hybrid" ? "Hybrid" : "On-site";

  return (
    <article className="card p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-black text-[#567C8D]">{posting.company}</p>
          <h3 className="mt-1 text-xl font-black text-ink">{posting.title}</h3>
        </div>
        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${fitTone}`}>
          {posting.fitScore}% fit
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-3 text-sm font-bold text-slate-600">
        <span className="inline-flex items-center gap-2">
          <MapPin size={16} /> {posting.location}
        </span>
        <span className="inline-flex items-center gap-2">
          <Radio size={16} /> {workModeLabel}
        </span>
        <span className="inline-flex items-center gap-2">
          <CalendarDays size={16} /> {posting.postedAt}
        </span>
      </div>

      <p className="mt-4 text-sm leading-6 text-slate-600">{posting.description || "Open the posting to review role details and application requirements."}</p>

      {posting.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {posting.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
        <a href={posting.url} target="_blank" rel="noreferrer" className="secondary-button">
          <ExternalLink className="mr-2" size={18} /> Open posting
        </a>
        <div className="flex flex-wrap justify-end gap-3">
          <form action="/resume-optimization" method="get">
            <input type="hidden" name="company" value={posting.company} />
            <input type="hidden" name="role" value={posting.title} />
            <input type="hidden" name="description" value={posting.description.slice(0, 1200)} />
            <input type="hidden" name="tags" value={posting.tags.join(", ")} />
            <input type="hidden" name="url" value={posting.url} />
            <button type="submit" className="secondary-button">
              <FileText className="mr-2" size={18} /> Resume optimization
            </button>
          </form>
          <form action={savePostingApplication}>
            <input type="hidden" name="company" value={posting.company} />
            <input type="hidden" name="role" value={posting.title} />
            <input type="hidden" name="location" value={posting.location} />
            <input type="hidden" name="sourceUrl" value={posting.url} />
            <input type="hidden" name="fitScore" value={posting.fitScore} />
            <button type="submit" className="primary-button">
              <BookmarkPlus className="mr-2" size={18} /> Save +5 XP
            </button>
          </form>
        </div>
      </div>
    </article>
  );
}
