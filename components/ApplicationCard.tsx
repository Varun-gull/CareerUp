"use client";

import { useState } from "react";
import { CalendarDays, ChevronDown, ExternalLink, MapPin, Sparkles, Trash2 } from "lucide-react";
import { ApplicationStatusBadge } from "./ApplicationStatusBadge";
import { StatusUpdateForm } from "./StatusUpdateForm";
import { deleteApplication } from "@/lib/applications/actions";
import type { Application } from "@/lib/types";

export function ApplicationCard({ application, compact = false }: { application: Application; compact?: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const sourceIsUrl = application.source.startsWith("http://") || application.source.startsWith("https://");

  if (compact) {
    return (
      <article className="min-w-0 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <button
          type="button"
          onClick={() => setExpanded((current) => !current)}
          className="flex w-full min-w-0 items-center justify-between gap-2 px-3 py-3 text-left transition hover:bg-purple-50/50"
          aria-expanded={expanded}
        >
          <div className="min-w-0">
            <p className="truncate text-xs font-black text-purple-700">{application.company}</p>
            <h3 className="mt-0.5 truncate text-sm font-black text-ink">{application.role}</h3>
            <p className="mt-1 truncate text-xs font-bold text-slate-500">{application.location}</p>
          </div>
          <div className="flex shrink-0 items-center">
            <ChevronDown className={`text-slate-400 transition ${expanded ? "rotate-180" : ""}`} size={18} />
          </div>
        </button>

        {expanded && (
          <div className="border-t border-slate-100 px-3 py-3">
            <div className="grid gap-3 text-sm text-slate-600">
              <span className="inline-flex items-center gap-2">
                <MapPin size={16} /> {application.location}
              </span>
              <span className="inline-flex items-center gap-2">
                <CalendarDays size={16} /> Due {application.deadline}
              </span>
              {sourceIsUrl ? (
                <a className="inline-flex items-center gap-2 font-bold text-purple-800 hover:text-purple-950" href={application.source} target="_blank" rel="noreferrer">
                  <ExternalLink size={16} /> Posting
                </a>
              ) : (
                <span className="inline-flex items-center gap-2">
                  <ExternalLink size={16} /> {application.source}
                </span>
              )}
              <span className="inline-flex items-center gap-2 font-bold text-purple-800">
                <Sparkles size={16} /> {application.fitScore}% fit
              </span>
            </div>
            <div className="mt-4 grid gap-3 border-t border-slate-100 pt-4">
              <StatusUpdateForm application={application} compact />
              <form action={deleteApplication} className="justify-self-end">
                <input type="hidden" name="applicationId" value={application.id} />
                <button type="submit" className="inline-flex min-h-10 items-center justify-center rounded-lg border border-slate-200 px-3 text-sm font-bold text-slate-500 transition hover:border-red-200 hover:text-red-600" aria-label={`Delete ${application.company} application`}>
                  <Trash2 size={16} />
                </button>
              </form>
            </div>
          </div>
        )}
      </article>
    );
  }

  return (
    <article className="card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-purple-700">{application.company}</p>
          <h3 className="mt-1 text-lg font-black text-ink">{application.role}</h3>
        </div>
        <ApplicationStatusBadge status={application.status} />
      </div>
      <div className="mt-4 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
        <span className="inline-flex items-center gap-2">
          <MapPin size={16} /> {application.location}
        </span>
        <span className="inline-flex items-center gap-2">
          <CalendarDays size={16} /> Due {application.deadline}
        </span>
        {sourceIsUrl ? (
          <a className="inline-flex items-center gap-2 font-bold text-purple-800 hover:text-purple-950" href={application.source} target="_blank" rel="noreferrer">
            <ExternalLink size={16} /> Posting
          </a>
        ) : (
          <span className="inline-flex items-center gap-2">
            <ExternalLink size={16} /> {application.source}
          </span>
        )}
        <span className="inline-flex items-center gap-2 font-bold text-purple-800">
          <Sparkles size={16} /> {application.fitScore}% fit
        </span>
      </div>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
        <StatusUpdateForm application={application} />
        <form action={deleteApplication}>
          <input type="hidden" name="applicationId" value={application.id} />
          <button type="submit" className="inline-flex min-h-10 items-center justify-center rounded-lg border border-slate-200 px-3 text-sm font-bold text-slate-500 transition hover:border-red-200 hover:text-red-600" aria-label={`Delete ${application.company} application`}>
            <Trash2 size={16} />
          </button>
        </form>
      </div>
    </article>
  );
}
