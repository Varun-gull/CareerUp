"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { addInterviewEvent } from "@/lib/calendar/actions";
import { updateApplicationStatus } from "@/lib/applications/actions";
import { dispatchInterviewScheduled } from "@/lib/interviewEvents";
import type { Application } from "@/lib/types";

const statusOptions = [
  { value: "saved", label: "Saved" },
  { value: "applied", label: "Applied" },
  { value: "interviewing", label: "Interviewing" },
  { value: "offer", label: "Offer" },
  { value: "rejected", label: "Rejected" },
] as const;

export function StatusUpdateForm({ application, compact }: { application: Application; compact?: boolean }) {
  const router = useRouter();
  const [selected, setSelected] = useState(application.status);
  const [, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    submitStatus(selected);
    if (selected === "interviewing" && application.status !== "interviewing") {
      const today = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}-${String(new Date().getDate()).padStart(2, "0")}`;
      dispatchInterviewScheduled({
        id: `pending-${Date.now()}`,
        applicationId: application.id,
        company: application.company,
        role: application.role,
        status: "interviewing",
        eventType: "interview",
        date: today,
        time: undefined,
        notes: undefined,
      });
      startTransition(async () => {
        await addInterviewEvent({ applicationId: application.id, company: application.company, role: application.role, date: today, time: "", notes: "" });
        router.refresh();
      });
    }
  }

  function submitStatus(status: string) {
    startTransition(async () => {
      const fd = new FormData();
      fd.set("applicationId", application.id);
      fd.set("status", status);
      await updateApplicationStatus(fd);
    });
  }

  return (
    <>
      <form onSubmit={handleSubmit} className={compact ? "grid gap-2" : "flex flex-wrap items-center gap-2"}>
        <input type="hidden" name="applicationId" value={application.id} />
        <select
          name="status"
          value={selected}
          onChange={(e) => setSelected(e.target.value as Application["status"])}
          className="min-h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700 outline-none focus:border-blue-500"
        >
          {statusOptions.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
        <button type="submit" className="min-h-10 rounded-lg bg-ink px-4 text-sm font-bold text-white transition hover:bg-blue-700">
          Update
        </button>
      </form>
    </>
  );
}
