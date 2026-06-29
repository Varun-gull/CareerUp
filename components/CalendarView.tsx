"use client";

import { ChevronLeft, ChevronRight, CalendarDays, List, X, CalendarPlus, Plus } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { addCalendarEvent, deleteCalendarEvent, moveCalendarEvent, promoteAndMoveCalendarEvent } from "@/lib/calendar/actions";
import { ApplicationStatusBadge } from "@/components/ApplicationStatusBadge";
import { InterviewModal } from "@/components/InterviewModal";
import { CalendarCreateModal } from "@/components/CalendarCreateModal";
import { addInterviewEvent } from "@/lib/calendar/actions";
import { INTERVIEW_SCHEDULED_EVENT, dispatchInterviewScheduled, getStoredInterviewDate, clearStoredInterview } from "@/lib/interviewEvents";
import type { Application, CalendarEvent } from "@/lib/types";

type View = "month" | "week";

const EVENT_TYPE_COLORS: Record<string, string> = {
  submitted: "bg-slate-200 text-slate-700 border-slate-400",
  interview: "bg-yellow-100 text-yellow-800 border-yellow-300",
  offer: "bg-green-100 text-green-800 border-green-300",
  deadline: "bg-slate-100 text-slate-600 border-slate-300",
  custom: "bg-sky/10 text-brand border-sky/25",
};

const EVENT_TYPE_LABEL: Record<string, string> = {
  deadline: "Deadline",
  submitted: "Applied",
  interview: "Interview",
  offer: "Offer",
  custom: "Event",
};

function toYMD(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function startOfWeek(date: Date) {
  const d = new Date(date);
  d.setDate(d.getDate() - d.getDay());
  return d;
}

function addDays(date: Date, n: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

function getMonthGrid(year: number, month: number): Date[] {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const start = startOfWeek(first);
  const cells: Date[] = [];
  const d = new Date(start);
  while (d <= last || cells.length % 7 !== 0) {
    cells.push(new Date(d));
    d.setDate(d.getDate() + 1);
    if (cells.length > 42) break;
  }
  return cells;
}

function getWeekDays(anchor: Date): Date[] {
  const start = startOfWeek(anchor);
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function buildEvents(applications: Application[], dbEvents: CalendarEvent[], todayStr: string): CalendarEvent[] {
  const derived: CalendarEvent[] = [];
  for (const app of applications) {
    if (app.deadline && /^\d{4}-\d{2}-\d{2}$/.test(app.deadline)) {
      derived.push({ id: `derived-dl-${app.id}`, applicationId: app.id, company: app.company, role: app.role, status: app.status, eventType: "deadline", date: app.deadline });
    }
    if (["applied", "interviewing", "offer"].includes(app.status)) {
      derived.push({ id: `derived-sub-${app.id}`, applicationId: app.id, company: app.company, role: app.role, status: app.status, eventType: "submitted", date: todayStr });
    }
    if (app.status === "interviewing" || app.status === "offer") {
      const storedDate = getStoredInterviewDate(app.id);
      derived.push({ id: `derived-int-${app.id}`, applicationId: app.id, company: app.company, role: app.role, status: app.status, eventType: "interview", date: storedDate ?? todayStr });
    }
    if (app.status === "offer") {
      derived.push({ id: `derived-offer-${app.id}`, applicationId: app.id, company: app.company, role: app.role, status: app.status, eventType: "offer", date: todayStr });
    }
  }
  const dbKeys = new Set(dbEvents.map((e) => `${e.applicationId}-${e.eventType}`));
  return [...dbEvents, ...derived.filter((e) => !dbKeys.has(`${e.applicationId}-${e.eventType}`))];
}

export function CalendarView({ applications, dbEvents }: { applications: Application[]; dbEvents: CalendarEvent[] }) {
  const today = new Date();
  const todayStr = toYMD(today);
  const [view, setView] = useState<View>("month");
  const [anchor, setAnchor] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [events, setEvents] = useState<CalendarEvent[]>(() => buildEvents(applications, dbEvents, todayStr));

  // Re-derive when server pushes fresh dbEvents, but preserve any locally-added interview events
  // that haven't been persisted to DB yet (pending-* ids from dispatchInterviewScheduled)
  useEffect(() => {
    setEvents((prev) => {
      const rebuilt = buildEvents(applications, dbEvents, todayStr);
      const dbInterviewKeys = new Set(dbEvents.filter((e) => e.eventType === "interview").map((e) => e.applicationId));
      // Once DB has the real event, clear localStorage so derived events stop overriding
      dbInterviewKeys.forEach((appId) => clearStoredInterview(appId));
      // Keep pending interview events (from modal) that haven't reached DB yet
      const pendingInterviews = prev.filter(
        (e) => e.eventType === "interview" && e.id.startsWith("pending-") && !dbInterviewKeys.has(e.applicationId)
      );
      const pendingAppIds = new Set(pendingInterviews.map((e) => e.applicationId));
      // Drop the derived-today fallback for apps that have a pending real date
      const base = rebuilt.filter(
        (e) => !(e.eventType === "interview" && e.id.startsWith("derived-") && pendingAppIds.has(e.applicationId))
      );
      return [...base, ...pendingInterviews];
    });
  }, [dbEvents]);

  // Immediately add interview event to calendar when modal is confirmed anywhere in the app
  // Always replaces derived/pending events so the user's chosen date takes effect immediately
  useEffect(() => {
    function handleInterviewScheduled(e: Event) {
      const ev = (e as CustomEvent<CalendarEvent>).detail;
      setEvents((prev) => [
        ...prev.filter((p) => !(p.applicationId === ev.applicationId && p.eventType === "interview")),
        ev,
      ]);
    }
    window.addEventListener(INTERVIEW_SCHEDULED_EVENT, handleInterviewScheduled);
    return () => window.removeEventListener(INTERVIEW_SCHEDULED_EVENT, handleInterviewScheduled);
  }, []);
  const router = useRouter();
  const [dragApp, setDragApp] = useState<Application | null>(null);
  const [dragEvent, setDragEvent] = useState<CalendarEvent | null>(null);
  const [activeDate, setActiveDate] = useState<string | null>(null);
  const [scheduleApp, setScheduleApp] = useState<Application | null>(null);
  const [createDate, setCreateDate] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const scheduledAppIds = new Set(events.filter((e) => e.eventType === "interview").map((e) => e.applicationId));

  function handleScheduleInterview(date: string, time: string, notes: string) {
    if (!scheduleApp) return;
    const app = scheduleApp;
    setScheduleApp(null);
    const newEvent: CalendarEvent = {
      id: `pending-${Date.now()}`,
      applicationId: app.id,
      company: app.company,
      role: app.role,
      status: "interviewing",
      eventType: "interview",
      date,
      time,
      notes,
    };
    // Replace any existing interview event (derived or pending) for this app
    setEvents((prev) => [
      ...prev.filter((e) => !(e.applicationId === app.id && e.eventType === "interview")),
      newEvent,
    ]);
    startTransition(async () => {
      await addInterviewEvent({ applicationId: app.id, company: app.company, role: app.role, date, time, notes });
    });
  }

  const days = view === "month"
    ? getMonthGrid(anchor.getFullYear(), anchor.getMonth())
    : getWeekDays(anchor);

  function navigate(dir: -1 | 1) {
    setAnchor((prev) => {
      const d = new Date(prev);
      if (view === "month") d.setMonth(d.getMonth() + dir);
      else d.setDate(d.getDate() + dir * 7);
      return d;
    });
  }

  function handleDrop(dateStr: string) {
    setActiveDate(null);

    if (dragApp) {
      const tempId = `temp-${Date.now()}`;
      const newEvent: CalendarEvent = {
        id: tempId,
        applicationId: dragApp.id,
        company: dragApp.company,
        role: dragApp.role,
        status: dragApp.status,
        eventType: "custom",
        date: dateStr,
      };
      // Add immediately to local state
      setEvents((prev) => [...prev, newEvent]);

      startTransition(async () => {
        const fd = new FormData();
        fd.set("applicationId", dragApp.id);
        fd.set("company", dragApp.company);
        fd.set("role", dragApp.role);
        fd.set("status", dragApp.status);
        fd.set("eventType", "custom");
        fd.set("date", dateStr);
        await addCalendarEvent(fd);
      });
      setDragApp(null);
    }

    if (dragEvent && dragEvent.date !== dateStr) {
      const ev = dragEvent;
      const movedEvent = { ...ev, date: dateStr };

      // Move immediately in local state
      setEvents((prev) => prev.map((e) => e.id === ev.id ? movedEvent : e));

      // If it's an interview event, update localStorage + notify listeners so
      // the rest of the app reflects the new date immediately
      if (ev.eventType === "interview") {
        dispatchInterviewScheduled(movedEvent);
      }

      startTransition(async () => {
        if (ev.id.startsWith("derived-") || ev.id.startsWith("temp-") || ev.id.startsWith("pending-")) {
          await promoteAndMoveCalendarEvent({
            applicationId: ev.applicationId,
            company: ev.company,
            role: ev.role,
            status: ev.status,
            eventType: ev.eventType,
            date: dateStr,
          });
        } else {
          await moveCalendarEvent(ev.id, dateStr);
        }
      });
      setDragEvent(null);
    }
  }

  function handleDelete(id: string) {
    // Remove immediately from local state
    setEvents((prev) => prev.filter((e) => e.id !== id));
    startTransition(async () => {
      await deleteCalendarEvent(id);
    });
  }

  const headerLabel =
    view === "month"
      ? `${MONTH_NAMES[anchor.getMonth()]} ${anchor.getFullYear()}`
      : (() => {
          const week = getWeekDays(anchor);
          return `${MONTH_NAMES[week[0].getMonth()]} ${week[0].getDate()} – ${MONTH_NAMES[week[6].getMonth()]} ${week[6].getDate()}, ${week[6].getFullYear()}`;
        })();

  return (
    <div className="flex h-[calc(100vh-80px)] gap-5 overflow-hidden">
      {createDate && (
        <CalendarCreateModal
          defaultDate={createDate}
          onClose={() => setCreateDate(null)}
          onCreated={() => router.refresh()}
        />
      )}
      {scheduleApp && (() => {
        const existing = events.find((e) => e.applicationId === scheduleApp.id && e.eventType === "interview");
        return (
          <InterviewModal
            company={scheduleApp.company}
            role={scheduleApp.role}
            initialDate={existing?.date}
            initialTime={existing?.time}
            initialNotes={existing?.notes}
            onConfirm={handleScheduleInterview}
            onCancel={() => setScheduleApp(null)}
          />
        );
      })()}
      {/* Left sidebar */}
      <aside className="flex w-72 flex-none flex-col rounded-3xl border border-slate-200 bg-white/90 backdrop-blur">
        <div className="border-b border-slate-200 px-4 py-4">
          <p className="eyebrow">Your applications</p>
          <p className="mt-1 text-xs text-slate-500">Drag onto any date to add an event</p>
        </div>
        <div className="flex-1 space-y-3 overflow-y-auto p-3">
          {applications.length === 0 && (
            <p className="p-4 text-center text-sm text-slate-500">No applications yet.</p>
          )}
          {applications.map((app) => (
            <div
              key={app.id}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.effectAllowed = "move";
                setDragApp(app);
              }}
              onDragEnd={() => setDragApp(null)}
              className={clsx(
                "cursor-grab select-none rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition active:cursor-grabbing",
                dragApp?.id === app.id && "opacity-40"
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-black text-brand">{app.company}</p>
                  <p className="truncate text-sm font-bold text-slate-700">{app.role}</p>
                </div>
                <ApplicationStatusBadge status={app.status} />
              </div>
              {app.deadline && app.deadline !== "No deadline" && (
                <p className="mt-2 text-xs font-bold text-slate-600">Due {app.deadline}</p>
              )}
              {app.status === "interviewing" && (
                <button
                  onClick={(e) => { e.stopPropagation(); setScheduleApp(app); }}
                  className="mt-2 flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-800 transition-colors"
                >
                  <CalendarPlus size={12} /> {scheduledAppIds.has(app.id) ? "Edit interview date" : "Set interview date"}
                </button>
              )}
            </div>
          ))}
        </div>
      </aside>

      {/* Calendar main */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(-1)}
              className="flex h-9 w-9 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 hover:border-sky/40 hover:text-brand transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="min-w-56 text-center text-lg font-black text-ink">{headerLabel}</span>
            <button
              onClick={() => navigate(1)}
              className="flex h-9 w-9 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 hover:border-sky/40 hover:text-brand transition-colors"
            >
              <ChevronRight size={18} />
            </button>
            <button
              onClick={() => setAnchor(view === "week" ? startOfWeek(today) : new Date(today.getFullYear(), today.getMonth(), 1))}
              className="ml-2 rounded-2xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 hover:border-sky/40 hover:text-brand transition-colors"
            >
              Today
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCreateDate(todayStr)}
              className="flex h-9 w-9 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 hover:border-sky/40 hover:text-brand transition-colors"
              aria-label="Add event"
            >
              <Plus size={18} />
            </button>
            <div className="flex rounded-2xl border border-slate-200 bg-white p-1">
            <button
              onClick={() => {
                setView("month");
                // Snap anchor to the 1st of the month currently visible in week view
                setAnchor((prev) => new Date(prev.getFullYear(), prev.getMonth(), 1));
              }}
              className={clsx(
                "flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-colors",
                view === "month" ? "bg-sky text-slate-950" : "text-slate-600 hover:text-brand"
              )}
            >
              <CalendarDays size={14} /> Month
            </button>
            <button
              onClick={() => {
                setView("week");
                // Snap anchor to the current week so events placed this month are visible
                setAnchor(startOfWeek(today));
              }}
              className={clsx(
                "flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-colors",
                view === "week" ? "bg-sky text-slate-950" : "text-slate-600 hover:text-brand"
              )}
            >
              <List size={14} /> Week
            </button>
            </div>
          </div>
        </div>

        {/* Day header row */}
        <div className="mb-1 grid grid-cols-7 gap-1">
          {DAY_NAMES.map((d) => (
            <div key={d} className="py-1 text-center text-xs font-black uppercase text-slate-600">
              {d}
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="grid flex-1 grid-cols-7 gap-1 overflow-y-auto">
          {days.map((day) => {
            const dateStr = toYMD(day);
            const isToday = dateStr === toYMD(today);
            const isCurrentMonth = view === "week" || day.getMonth() === anchor.getMonth();
            const dayEvents = events.filter((e) => e.date === dateStr);
            const isActive = activeDate === dateStr;

            return (
              <div
                key={dateStr}
                onDragOver={(e) => { e.preventDefault(); setActiveDate(dateStr); }}
                onDragLeave={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                    setActiveDate(null);
                  }
                }}
                onDrop={(e) => { e.preventDefault(); handleDrop(dateStr); }}
                onClick={() => setCreateDate(dateStr)}
                className={clsx(
                  "min-h-[90px] cursor-pointer rounded-2xl border p-1.5 transition-colors hover:border-sky/40",
                  isActive ? "border-brand bg-sky/10" : "border-slate-200 bg-white/85",
                  !isCurrentMonth && "opacity-40"
                )}
              >
                <span
                  onClick={(e) => e.stopPropagation()}
                  className={clsx(
                  "inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold",
                  isToday ? "bg-sky text-slate-950" : "text-slate-500"
                )}>
                  {day.getDate()}
                </span>

                <div className="mt-1 space-y-1">
                  {dayEvents.map((ev) => (
                    <div
                      key={ev.id}
                      draggable
                      onClick={(e) => e.stopPropagation()}
                      onDragStart={(e) => {
                        e.dataTransfer.effectAllowed = "move";
                        setDragEvent(ev);
                      }}
                      onDragEnd={() => setDragEvent(null)}
                      className={clsx(
                        "group cursor-grab rounded border px-1.5 py-1 active:cursor-grabbing active:opacity-50",
                        EVENT_TYPE_COLORS[ev.eventType] ?? EVENT_TYPE_COLORS.custom
                      )}
                    >
                      <div className="flex items-start justify-between gap-1">
                        <p className="truncate text-xs font-black leading-tight">{ev.company}</p>
                        <button
                          onClick={() => handleDelete(ev.id)}
                          className="flex-none opacity-0 transition-opacity group-hover:opacity-100"
                          aria-label="Remove event"
                        >
                          <X size={10} />
                        </button>
                      </div>
                      <p className="truncate text-xs font-medium opacity-80 leading-tight mt-0.5">{ev.role}</p>
                      <p className="text-xs opacity-60 leading-tight mt-0.5">
                        {EVENT_TYPE_LABEL[ev.eventType] ?? ev.eventType}
                        {ev.time && ` · ${ev.time}`}
                      </p>
                      {ev.notes && <p className="truncate text-xs opacity-50 leading-tight mt-0.5 italic">{ev.notes}</p>}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
