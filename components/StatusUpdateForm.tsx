"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { InterviewModal } from "@/components/InterviewModal";
import { addInterviewEvent } from "@/lib/calendar/actions";
import { updateApplicationStatus } from "@/lib/applications/actions";
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
  const [showModal, setShowModal] = useState(false);
  const [, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (selected === "interviewing" && application.status !== "interviewing") {
      setShowModal(true);
    } else {
      submitStatus(selected);
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

  async function handleModalConfirm(date: string, time: string, notes: string) {
    setShowModal(false);
    submitStatus("interviewing");
    startTransition(async () => {
      await addInterviewEvent({
        applicationId: application.id,
        company: application.company,
        role: application.role,
        date,
        time,
        notes,
      });
      router.refresh();
    });
  }

  return (
    <>
      {showModal && (
        <InterviewModal
          company={application.company}
          role={application.role}
          onConfirm={handleModalConfirm}
          onCancel={() => setShowModal(false)}
        />
      )}
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
