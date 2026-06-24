import { CalendarDays, ExternalLink, MapPin, Sparkles, Trash2 } from "lucide-react";
import { ApplicationStatusBadge } from "./ApplicationStatusBadge";
import { StatusUpdateForm } from "./StatusUpdateForm";
import { deleteApplication } from "@/lib/applications/actions";
import type { Application, CalendarEvent } from "@/lib/types";

export function ApplicationCard({ application, compact = false, onInterviewScheduled }: { application: Application; compact?: boolean; onInterviewScheduled?: (event: CalendarEvent) => void }) {
  const sourceIsUrl = application.source.startsWith("http://") || application.source.startsWith("https://");

  return (
    <article className={compact ? "rounded-lg border border-slate-200 bg-white p-4 shadow-sm" : "card p-5"}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-blue-600">{application.company}</p>
          <h3 className="mt-1 text-lg font-black text-ink">{application.role}</h3>
        </div>
        {!compact && <ApplicationStatusBadge status={application.status} />}
      </div>
      <div className={compact ? "mt-4 grid gap-3 text-sm text-slate-600" : "mt-4 grid gap-3 text-sm text-slate-600 sm:grid-cols-2"}>
        <span className="inline-flex items-center gap-2">
          <MapPin size={16} /> {application.location}
        </span>
        <span className="inline-flex items-center gap-2">
          <CalendarDays size={16} /> Due {application.deadline}
        </span>
        {sourceIsUrl ? (
          <a className="inline-flex items-center gap-2 font-bold text-blue-700 hover:text-blue-900" href={application.source} target="_blank" rel="noreferrer">
            <ExternalLink size={16} /> Posting
          </a>
        ) : (
          <span className="inline-flex items-center gap-2">
            <ExternalLink size={16} /> {application.source}
          </span>
        )}
        <span className="inline-flex items-center gap-2 font-bold text-blue-700">
          <Sparkles size={16} /> {application.fitScore}% fit
        </span>
      </div>
      <div className={compact ? "mt-5 grid gap-3 border-t border-slate-100 pt-4" : "mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4"}>
        <StatusUpdateForm application={application} compact={compact} onInterviewScheduled={onInterviewScheduled} />
        <form action={deleteApplication} className={compact ? "justify-self-end" : undefined}>
          <input type="hidden" name="applicationId" value={application.id} />
          <button type="submit" className="inline-flex min-h-10 items-center justify-center rounded-lg border border-slate-200 px-3 text-sm font-bold text-slate-500 transition hover:border-red-200 hover:text-red-600" aria-label={`Delete ${application.company} application`}>
            <Trash2 size={16} />
          </button>
        </form>
      </div>
    </article>
  );
}
