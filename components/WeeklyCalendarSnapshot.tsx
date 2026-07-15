import { CalendarDays, Clock3 } from "lucide-react";
import Link from "next/link";
import type { CalendarEvent } from "@/lib/types";

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

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

function eventLabel(type: CalendarEvent["eventType"]) {
  if (type === "submitted") return "Applied";
  if (type === "interview") return "Interview";
  if (type === "offer") return "Offer";
  if (type === "deadline") return "Deadline";
  return "Event";
}

function eventTone(type: CalendarEvent["eventType"]) {
  if (type === "interview") return "border-sky/40 bg-sky/12 text-sky-600";
  if (type === "offer") return "border-emerald-400/40 bg-emerald-400/10 text-emerald-700";
  if (type === "deadline") return "border-[#B8A99A]/40 bg-[#E2D2BF]/70 text-[#7A5438]";
  return "border-slate-600 bg-slate-100 text-slate-700";
}

export function WeeklyCalendarSnapshot({ events }: { events: CalendarEvent[] }) {
  const today = new Date();
  const weekStart = startOfWeek(today);
  const days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + i);
    const ymd = toYMD(date);
    return {
      date,
      ymd,
      events: events.filter((event) => event.date === ymd).slice(0, 3),
    };
  });

  const upcoming = events
    .filter((event) => event.date >= toYMD(today))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 3);

  return (
    <section className="card p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="eyebrow">This week</p>
          <h2 className="mt-1 text-2xl font-bold text-ink">Weekly calendar</h2>
        </div>
        <Link href="/calendar" className="secondary-button min-h-10 px-4 text-sm">
          Open calendar
        </Link>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
        {days.map((day) => {
          const isToday = day.ymd === toYMD(today);
          return (
            <div
              key={day.ymd}
              className={`min-h-32 rounded-2xl border p-3 ${
                isToday ? "border-sky/50 bg-sky/10" : "border-[#B8A99A]/35 bg-[#F3EDE5]/65"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-bold uppercase text-slate-600">{DAY_LABELS[day.date.getDay()]}</p>
                <p className={isToday ? "text-sm font-bold text-sky-600" : "text-sm font-bold text-[#B8A99A]"}>{day.date.getDate()}</p>
              </div>
              <div className="mt-3 space-y-2">
                {day.events.length > 0 ? (
                  day.events.map((event) => (
                    <div key={event.id} className={`rounded-xl border px-2 py-1.5 text-[11px] font-bold ${eventTone(event.eventType)}`}>
                      <p className="truncate">{eventLabel(event.eventType)}</p>
                      <p className="truncate font-bold opacity-80">{event.company}</p>
                    </div>
                  ))
                ) : (
                  <p className="rounded-xl border border-dashed border-slate-200 px-2 py-2 text-xs font-bold text-slate-500">Open</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 rounded-2xl border border-[#B8A99A]/35 bg-[#F3EDE5]/65 p-4">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
          <CalendarDays size={17} className="text-sky-600" />
          Upcoming
        </div>
        <div className="mt-3 grid gap-2">
          {upcoming.length > 0 ? (
            upcoming.map((event) => (
              <div key={event.id} className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-3 py-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-ink">{event.role}</p>
                  <p className="truncate text-xs font-bold text-slate-600">{event.company}</p>
                </div>
                <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-sky/10 px-2.5 py-1 text-xs font-bold text-sky-600">
                  <Clock3 size={13} /> {event.date.slice(5)}
                </span>
              </div>
            ))
          ) : (
            <p className="text-sm font-bold text-slate-500">No upcoming events yet.</p>
          )}
        </div>
      </div>
    </section>
  );
}
