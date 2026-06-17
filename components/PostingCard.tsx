import { BookmarkPlus, ExternalLink, MapPin, Radio, Sparkles } from "lucide-react";
import { savePostingApplication } from "@/lib/applications/actions";
import type { InternshipPosting } from "@/lib/types";

export function PostingCard({ posting }: { posting: InternshipPosting }) {
  return (
    <article className="card p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-black text-blue-600">{posting.company}</p>
          <h3 className="mt-1 text-xl font-black text-ink">{posting.title}</h3>
        </div>
        <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-700">
          {posting.fitScore}% fit
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-3 text-sm font-bold text-slate-600">
        <span className="inline-flex items-center gap-2">
          <MapPin size={16} /> {posting.location}
        </span>
        {posting.remote && (
          <span className="inline-flex items-center gap-2">
            <Radio size={16} /> Remote
          </span>
        )}
        <span className="inline-flex items-center gap-2 text-blue-700">
          <Sparkles size={16} /> {posting.source}
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
        <form action={savePostingApplication}>
          <input type="hidden" name="company" value={posting.company} />
          <input type="hidden" name="role" value={posting.title} />
          <input type="hidden" name="location" value={posting.location} />
          <input type="hidden" name="sourceUrl" value={posting.url} />
          <input type="hidden" name="fitScore" value={posting.fitScore} />
          <button type="submit" className="primary-button">
            <BookmarkPlus className="mr-2" size={18} /> Save to tracker
          </button>
        </form>
      </div>
    </article>
  );
}
