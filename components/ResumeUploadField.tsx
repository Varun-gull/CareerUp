"use client";

import { UploadCloud } from "lucide-react";
import { useState } from "react";

export function ResumeUploadField() {
  const [fileName, setFileName] = useState("");

  return (
    <label className="group grid cursor-pointer gap-2 rounded-2xl border border-dashed border-slate-300 bg-white p-4 text-center transition hover:border-sky hover:bg-sky/5">
      <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-sky/10 text-brand">
        <UploadCloud size={20} />
      </span>
      <span className="text-sm font-black text-slate-800">{fileName || "Upload resume file"}</span>
      <span className="text-xs font-bold text-slate-500">PDF, DOCX, TXT, MD, and CSV. Text-based PDFs work best.</span>
      <input
        name="resumeFile"
        type="file"
        accept=".txt,.md,.csv,.pdf,.docx"
        className="sr-only"
        onChange={(event) => setFileName(event.currentTarget.files?.[0]?.name ?? "")}
      />
    </label>
  );
}
