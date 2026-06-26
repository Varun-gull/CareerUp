import clsx from "clsx";
import type { ApplicationStatus } from "@/lib/types";

const labels: Record<ApplicationStatus, string> = {
  saved: "Saved",
  applied: "Applied",
  interviewing: "Interviewing",
  offer: "Offer",
  rejected: "Rejected"
};

const styles: Record<ApplicationStatus, string> = {
  saved: "bg-slate-100 text-slate-700 ring-slate-200",
  applied: "bg-violet-50 text-brand ring-violet-200",
  interviewing: "bg-cyan-50 text-cyan-700 ring-cyan-200",
  offer: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  rejected: "bg-slate-200 text-slate-600 ring-slate-300"
};

export function ApplicationStatusBadge({ status }: { status: ApplicationStatus }) {
  return (
    <span className={clsx("inline-flex rounded-full px-3 py-1 text-xs font-bold ring-1", styles[status])}>
      {labels[status]}
    </span>
  );
}
