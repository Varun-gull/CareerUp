"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { ApplicationCard } from "@/components/ApplicationCard";
import { updateApplicationStatus } from "@/lib/applications/actions";
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

    setBoardApplications((currentApplications) =>
      currentApplications.map((item) => (item.id === applicationId ? { ...item, status: nextStatus } : item))
    );

    startTransition(async () => {
      const formData = new FormData();
      formData.set("applicationId", applicationId);
      formData.set("status", nextStatus);

      try {
        await updateApplicationStatus(formData);
        if (nextStatus === "applied") {
          router.refresh();
        }
      } catch {
        setBoardApplications(previousApplications);
      }
    });
  }

  return (
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
                "rounded-lg border border-slate-200 bg-white/70 p-3 transition",
                isActive && "border-blue-300 bg-blue-50/70 shadow-lg shadow-blue-200/40",
                isPending && "opacity-90"
              )}
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-sm font-black text-ink">{column.title}</h2>
                  <p className="text-xs font-bold text-slate-500">{column.helper}</p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-700">{columnApplications.length}</span>
              </div>

              {columnApplications.length > 0 ? (
                <div className="grid gap-3">
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
                      className={clsx("cursor-grab active:cursor-grabbing", draggedId === application.id && "opacity-50")}
                    >
                      <ApplicationCard application={application} compact />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-slate-200 bg-white/70 p-4 text-sm font-bold text-slate-500">Drop roles here.</div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
