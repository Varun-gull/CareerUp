"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { ApplicationCard } from "@/components/ApplicationCard";
import { InterviewModal } from "@/components/InterviewModal";
import { addInterviewEvent } from "@/lib/calendar/actions";
import { updateApplicationStatus } from "@/lib/applications/actions";
import { dispatchInterviewScheduled } from "@/lib/interviewEvents";
import type { Application, ApplicationStatus } from "@/lib/types";

type PipelineColumn = {
  status: ApplicationStatus;
  title: string;
  helper: string;
};

export function ApplicationPipelineBoard({ applications, columns }: { applications: Application[]; columns: PipelineColumn[] }) {
  const router = useRouter();
  const [boardApplications, setBoardApplications] = useState(applications);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [activeStatus, setActiveStatus] = useState<ApplicationStatus | null>(null);
  const [isPending, startTransition] = useTransition();
  const [pendingInterview, setPendingInterview] = useState<{ applicationId: string; app: Application } | null>(null);

  const groupedApplications = useMemo(() => {
    return columns.reduce<Record<ApplicationStatus, Application[]>>(
      (groups, column) => {
        groups[column.status] = boardApplications.filter((application) => application.status === column.status);
        return groups;
      },
      {
        saved: [],
        applied: [],
        interviewing: [],
        offer: [],
        rejected: []
      }
    );
  }, [boardApplications, columns]);

  function moveApplication(applicationId: string, nextStatus: ApplicationStatus) {
    const previousApplications = boardApplications;
    const application = previousApplications.find((item) => item.id === applicationId);

    if (!application || application.status === nextStatus) {
      return;
    }

    // Intercept interviewing drop — show modal to collect date/time/notes
    if (nextStatus === "interviewing" && application.status !== "interviewing") {
      setPendingInterview({ applicationId, app: application });
      return;
    }

    setBoardApplications((currentApplications) =>
      currentApplications.map((item) => (item.id === applicationId ? { ...item, status: nextStatus } : item))
    );

    startTransition(async () => {
      const formData = new FormData();
      formData.set("applicationId", applicationId);
      formData.set("status", nextStatus);
      try {
        await updateApplicationStatus(formData);
        router.refresh();
      } catch {
        setBoardApplications(previousApplications);
      }
    });
  }

  function confirmInterview(date: string, time: string, notes: string) {
    if (!pendingInterview) return;
    const { applicationId, app } = pendingInterview;
    setPendingInterview(null);
    setBoardApplications((curr) => curr.map((item) => item.id === applicationId ? { ...item, status: "interviewing" } : item));
    dispatchInterviewScheduled({
      id: `pending-${Date.now()}`,
      applicationId,
      company: app.company,
      role: app.role,
      status: "interviewing",
      eventType: "interview",
      date,
      time,
      notes,
    });
    startTransition(async () => {
      const fd = new FormData();
      fd.set("applicationId", applicationId);
      fd.set("status", "interviewing");
      await updateApplicationStatus(fd);
      await addInterviewEvent({ applicationId, company: app.company, role: app.role, date, time, notes });
      router.refresh();
    });
  }

  return (
    <>
    {pendingInterview && (
      <InterviewModal
        company={pendingInterview.app.company}
        role={pendingInterview.app.role}
        onConfirm={confirmInterview}
        onCancel={() => setPendingInterview(null)}
      />
    )}
    <section className="mt-6 overflow-x-auto pb-4">
      <div className="grid min-w-[1120px] gap-4 xl:grid-cols-5">
        {columns.map((column) => {
          const columnApplications = groupedApplications[column.status];
          const isActive = activeStatus === column.status;

          return (
            <div
              key={column.status}
              onDragOver={(event) => {
                event.preventDefault();
                setActiveStatus(column.status);
              }}
              onDragLeave={() => setActiveStatus(null)}
              onDrop={(event) => {
                event.preventDefault();
                const applicationId = event.dataTransfer.getData("text/plain") || draggedId;
                setActiveStatus(null);
                setDraggedId(null);

                if (applicationId) {
                  moveApplication(applicationId, column.status);
                }
              }}
              className={clsx(
                "min-w-0 rounded-3xl border border-white/70 bg-white/60 p-3 shadow-sm backdrop-blur-xl transition",
                isActive && "border-brand/40 bg-violet-50/85 shadow-glow",
                isPending && "opacity-90"
              )}
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-sm font-black text-ink">{column.title}</h2>
                  <p className="text-xs font-bold text-slate-500">{column.helper}</p>
                </div>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-slate-700 ring-1 ring-slate-200">{columnApplications.length}</span>
              </div>

              {columnApplications.length > 0 ? (
                <div className="grid min-w-0 gap-3">
                  {columnApplications.map((application) => (
                    <div
                      key={application.id}
                      draggable
                      onDragStart={(event) => {
                        event.dataTransfer.setData("text/plain", application.id);
                        event.dataTransfer.effectAllowed = "move";
                        setDraggedId(application.id);
                      }}
                      onDragEnd={() => {
                        setDraggedId(null);
                        setActiveStatus(null);
                      }}
                      className={clsx("min-w-0 cursor-grab active:cursor-grabbing", draggedId === application.id && "opacity-50")}
                    >
                      <ApplicationCard application={application} compact />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-white/60 p-4 text-sm font-bold text-slate-500">Drop roles here.</div>
              )}
            </div>
          );
        })}
      </div>
    </section>
    </>
  );
}
