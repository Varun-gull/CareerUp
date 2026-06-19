"use client";

import { ChevronLeft, ChevronRight, CalendarDays, List, X } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import clsx from "clsx";
import { addCalendarEvent, deleteCalendarEvent, moveCalendarEvent } from "@/lib/calendar/actions";
import { ApplicationStatusBadge } from "@/components/ApplicationStatusBadge";
import type { Application, CalendarEvent } from "@/lib/types";

type View = "month" | "week";

const STATUS_COLORS: Record<string, string> = {
  saved: "bg-slate-100 text-slate-700 border-slate-300",
  applied: "bg-blue-50 text-blue-700 border-blue-300",
  interviewing: "bg-emerald-50 text-emerald-700 border-emerald-300",
  offer: "bg-amber-50 text-amber-700 border-amber-300",
  rejected: "bg-red-50 text-red-600 border-red-200",
};

const EVENT_TYPE_LABEL: Record<string, string> = {
  deadline: "Deadline",
  submitted: "Applied",
  custom: "Event",
};

function toYMD(date: Date) {
  return date.toISOString().slice(0, 10);
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

export function CalendarView({ applications, initialEvents }: { applications: Application[]; initialEvents: CalendarEvent[] }) {
  const today = new Date();
  const [view, setView] = useState<View>("month");
  const [anchor, setAnchor] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);

  // Merge in any new events pushed from the server (e.g. status changed to applied)
  useEffect(() => {
    setEvents((prev) => {
      const existingIds = new Set(prev.map((e) => e.id));
      const incoming = initialEvents.filter((e) => !existingIds.has(e.id));
      return incoming.length > 0 ? [...prev, ...incoming] : prev;
    });
  }, [initialEvents]);
  const [dragApp, setDragApp] = useState<Application | null>(null);
  const [dragEvent, setDragEvent] = useState<CalendarEvent | null>(null);
  const [activeDate, setActiveDate] = useState<string | null>(null);
  const [, startTransition] = useTransition();

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
      // Move immediately in local state
      setEvents((prev) => prev.map((e) => e.id === dragEvent.id ? { ...e, date: dateStr } : e));

      startTransition(async () => {
        await moveCalendarEvent(dragEvent.id, dateStr);
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
      {/* Left sidebar */}
      <aside className="flex w-72 flex-none flex-col rounded-xl border border-slate-200 bg-white/80 backdrop-blur">
        <div className="border-b border-slate-100 px-4 py-4">
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
                "cursor-grab select-none rounded-lg border border-slate-200 bg-white p-3 shadow-sm transition active:cursor-grabbing",
                dragApp?.id === app.id && "opacity-40"
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-black text-blue-600">{app.company}</p>
                  <p className="truncate text-sm font-bold text-slate-700">{app.role}</p>
                </div>
                <ApplicationStatusBadge status={app.status} />
              </div>
              {app.deadline && app.deadline !== "No deadline" && (
                <p className="mt-2 text-xs font-bold text-slate-400">Due {app.deadline}</p>
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
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:text-blue-700 transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="min-w-56 text-center text-lg font-black text-ink">{headerLabel}</span>
            <button
              onClick={() => navigate(1)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:text-blue-700 transition-colors"
            >
              <ChevronRight size={18} />
            </button>
            <button
              onClick={() => setAnchor(new Date(today.getFullYear(), today.getMonth(), 1))}
              className="ml-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 hover:border-blue-300 hover:text-blue-700 transition-colors"
            >
              Today
            </button>
          </div>

          <div className="flex rounded-lg border border-slate-200 bg-white p-1">
            <button
              onClick={() => setView("month")}
              className={clsx(
                "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-bold transition-colors",
                view === "month" ? "bg-blue-600 text-white" : "text-slate-600 hover:text-blue-700"
              )}
            >
              <CalendarDays size={14} /> Month
            </button>
            <button
              onClick={() => setView("week")}
              className={clsx(
                "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-bold transition-colors",
                view === "week" ? "bg-blue-600 text-white" : "text-slate-600 hover:text-blue-700"
              )}
            >
              <List size={14} /> Week
            </button>
          </div>
        </div>

        {/* Day header row */}
        <div className="mb-1 grid grid-cols-7 gap-1">
          {DAY_NAMES.map((d) => (
            <div key={d} className="py-1 text-center text-xs font-black uppercase tracking-wide text-slate-400">
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
                className={clsx(
                  "min-h-[90px] rounded-lg border p-1.5 transition-colors",
                  isActive ? "border-blue-400 bg-blue-50" : "border-slate-100 bg-white/70",
                  !isCurrentMonth && "opacity-40"
                )}
              >
                <span className={clsx(
                  "inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold",
                  isToday ? "bg-blue-600 text-white" : "text-slate-500"
                )}>
                  {day.getDate()}
                </span>

                <div className="mt-1 space-y-1">
                  {dayEvents.map((ev) => (
                    <div
                      key={ev.id}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.effectAllowed = "move";
                        setDragEvent(ev);
                      }}
                      onDragEnd={() => setDragEvent(null)}
                      className={clsx(
                        "group cursor-grab rounded border px-1.5 py-1 active:cursor-grabbing active:opacity-50",
                        STATUS_COLORS[ev.status] ?? STATUS_COLORS.saved
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
                      <p className="text-xs opacity-60 leading-tight mt-0.5">{EVENT_TYPE_LABEL[ev.eventType] ?? ev.eventType}</p>
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
