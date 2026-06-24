"use client";

import { X } from "lucide-react";
import { useRef } from "react";

type Props = {
  company: string;
  role: string;
  onConfirm: (date: string, time: string, notes: string) => void;
  onCancel: () => void;
};

function todayLocal() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function InterviewModal({ company, role, onConfirm, onCancel }: Props) {
  const dateRef = useRef<HTMLInputElement>(null);
  const timeRef = useRef<HTMLInputElement>(null);
  const notesRef = useRef<HTMLTextAreaElement>(null);

  function handleConfirm() {
    const date = dateRef.current?.value || todayLocal();
    const time = timeRef.current?.value || "";
    const notes = notesRef.current?.value || "";
    onConfirm(date, time, notes);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-black text-ink">Schedule Interview</h2>
            <p className="mt-1 text-sm text-slate-500">{company} — {role}</p>
          </div>
          <button onClick={onCancel} className="text-slate-400 hover:text-slate-700 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="mt-5 space-y-4">
          <label className="grid gap-1.5 text-sm font-bold text-slate-700">
            Interview date
            <input
              ref={dateRef}
              type="date"
              defaultValue={todayLocal()}
              className="rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-purple-600"
            />
          </label>
          <label className="grid gap-1.5 text-sm font-bold text-slate-700">
            Time <span className="font-normal text-slate-400">(optional)</span>
            <input
              ref={timeRef}
              type="time"
              className="rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-purple-600"
            />
          </label>
          <label className="grid gap-1.5 text-sm font-bold text-slate-700">
            Notes <span className="font-normal text-slate-400">(optional)</span>
            <textarea
              ref={notesRef}
              rows={3}
              placeholder="Interviewer name, format, things to prepare..."
              className="resize-none rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-purple-600"
            />
          </label>
        </div>

        <div className="mt-6 flex gap-3">
          <button onClick={handleConfirm} className="primary-button flex-1">
            Add to Calendar
          </button>
        </div>
      </div>
    </div>
  );
}
