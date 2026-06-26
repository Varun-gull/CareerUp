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
  saved: "bg-slate-800 text-slate-300 ring-slate-700",
  applied: "bg-sky/10 text-sky ring-sky/25",
  interviewing: "bg-cyan-400/10 text-cyan-200 ring-cyan-300/25",
  offer: "bg-emerald-400/10 text-emerald-200 ring-emerald-300/25",
  rejected: "bg-slate-800 text-slate-400 ring-slate-700"
};

export function ApplicationStatusBadge({ status }: { status: ApplicationStatus }) {
  return (
    <span className={clsx("inline-flex rounded-full px-3 py-1 text-xs font-bold ring-1", styles[status])}>
      {labels[status]}
    </span>
  );
}
