"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import clsx from "clsx";

type Props = {
  company: string;
  role: string;
  initialDate?: string;
  initialTime?: string;
  initialNotes?: string;
  onConfirm: (date: string, time: string, notes: string) => void;
  onCancel: () => void;
};

function todayLocal() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function toDateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function formatDayLabel(date: Date, index: number) {
  const month = date.toLocaleDateString("en-US", { month: "short" });
  const day = date.getDate();

  if (index === 0 && toDateKey(date) === todayLocal()) {
    return `Today, ${month} ${day}`;
  }

  return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

function formatWeekRange(start: Date, end: Date) {
  const startMonth = start.toLocaleDateString("en-US", { month: "short" });
  const endMonth = end.toLocaleDateString("en-US", { month: "short" });
  return startMonth === endMonth ? `${startMonth} ${start.getDate()} - ${end.getDate()}` : `${startMonth} ${start.getDate()} - ${endMonth} ${end.getDate()}`;
}

const timeSlots = ["10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00"];

function formatSlotLabel(time: string) {
  const [hourValue, minute] = time.split(":").map(Number);
  const period = hourValue >= 12 ? "PM" : "AM";
  const hour = hourValue % 12 || 12;
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")} ${period}`;
}

export function InterviewModal({ company, role, initialDate, initialTime, initialNotes, onConfirm, onCancel }: Props) {
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedDate, setSelectedDate] = useState(initialDate ?? todayLocal());
  const [selectedTime, setSelectedTime] = useState(initialTime ?? "");
  const dateRef = useRef<HTMLInputElement>(null);
  const timeRef = useRef<HTMLInputElement>(null);
  const notesRef = useRef<HTMLTextAreaElement>(null);
  const weekDays = useMemo(() => {
    const start = addDays(new Date(`${todayLocal()}T12:00:00`), weekOffset * 6);
    return Array.from({ length: 6 }, (_, index) => addDays(start, index));
  }, [weekOffset]);
  const weekRange = formatWeekRange(weekDays[0], weekDays[weekDays.length - 1]);

  function handleConfirm() {
    const date = dateRef.current?.value || selectedDate || todayLocal();
    const time = timeRef.current?.value || selectedTime || "";
    const notes = notesRef.current?.value || "";
    onConfirm(date, time, notes);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-3xl rounded-[2rem] bg-white p-5 shadow-2xl sm:p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-black text-ink">Schedule interview</h2>
            <p className="mt-1 text-sm text-slate-500">{company} — {role}</p>
          </div>
          <button onClick={onCancel} className="rounded-xl p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700" aria-label="Close interview scheduler">
            <X size={20} />
          </button>
        </div>

        <div className="mt-5 rounded-3xl bg-slate-950 p-4 text-white sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setWeekOffset((current) => Math.max(0, current - 1))}
              disabled={weekOffset === 0}
              className="flex h-11 w-11 items-center justify-center rounded-2xl text-slate-300 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
              aria-label="Previous interview slots"
            >
              <ChevronLeft size={22} />
            </button>
            <p className="text-lg font-black sm:text-2xl">{weekRange}</p>
            <button
              type="button"
              onClick={() => setWeekOffset((current) => current + 1)}
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/20 text-slate-300 transition hover:bg-white/10 hover:text-white"
              aria-label="Next interview slots"
            >
              <ChevronRight size={22} />
            </button>
          </div>

          <div className="mt-5 max-h-[22rem] space-y-6 overflow-y-auto pr-1">
            {weekDays.map((day, dayIndex) => {
              const dateKey = toDateKey(day);
              return (
                <section key={dateKey}>
                  <h3 className="text-lg font-black text-white">{formatDayLabel(day, dayIndex)}</h3>
                  <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5">
                    {timeSlots.map((time) => {
                      const selected = selectedDate === dateKey && selectedTime === time;
                      return (
                        <button
                          key={`${dateKey}-${time}`}
                          type="button"
                          onClick={() => {
                            setSelectedDate(dateKey);
                            setSelectedTime(time);
                          }}
                          className={clsx(
                            "rounded-2xl px-3 py-3 text-sm font-black transition sm:text-base",
                            selected
                              ? "bg-sky text-slate-950 shadow-glow"
                              : "bg-black text-white ring-1 ring-white/5 hover:bg-white/10 hover:ring-white/20"
                          )}
                        >
                          {formatSlotLabel(time)}
                        </button>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="grid gap-1.5 text-sm font-bold text-slate-700">
            Custom date
            <input ref={dateRef} type="date" value={selectedDate} onChange={(event) => setSelectedDate(event.target.value)} className="field" />
          </label>
          <label className="grid gap-1.5 text-sm font-bold text-slate-700">
            Custom time <span className="font-normal text-slate-600">(optional)</span>
            <input ref={timeRef} type="time" value={selectedTime} onChange={(event) => setSelectedTime(event.target.value)} className="field" />
          </label>
        </div>

        <div className="mt-4">
          <label className="grid gap-1.5 text-sm font-bold text-slate-700">
            Notes <span className="font-normal text-slate-600">(optional)</span>
            <textarea
              ref={notesRef}
              rows={3}
              defaultValue={initialNotes ?? ""}
              placeholder="Interviewer name, format, things to prepare..."
              className="field resize-none text-sm"
            />
          </label>
        </div>

        <div className="mt-5 flex gap-3">
          <button onClick={handleConfirm} className="primary-button flex-1">
            Add to Calendar
          </button>
        </div>
      </div>
    </div>
  );
}
