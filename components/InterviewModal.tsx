"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useMemo, useState } from "react";
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

const timeSlots = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"];

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
  const [customDate, setCustomDate] = useState(initialDate ?? todayLocal());
  const [customTime, setCustomTime] = useState(initialTime ?? "");
  const [customTimeOpen, setCustomTimeOpen] = useState(false);
  const weekDays = useMemo(() => {
    const start = addDays(new Date(`${todayLocal()}T12:00:00`), weekOffset * 6);
    return Array.from({ length: 6 }, (_, index) => addDays(start, index));
  }, [weekOffset]);
  const weekRange = formatWeekRange(weekDays[0], weekDays[weekDays.length - 1]);

  function handleConfirm() {
    onConfirm(selectedDate || todayLocal(), selectedTime || "", initialNotes ?? "");
  }

  function selectCustomTime() {
    setSelectedDate(customDate || todayLocal());
    setSelectedTime(customTime);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-4xl rounded-[2rem] bg-white p-5 shadow-2xl sm:p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-black text-ink">Schedule interview</h2>
            <p className="mt-1 text-sm text-slate-500">{company} — {role}</p>
          </div>
          <button onClick={onCancel} className="rounded-xl p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700" aria-label="Close interview scheduler">
            <X size={20} />
          </button>
        </div>

        <div className="mt-5">
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setWeekOffset((current) => Math.max(0, current - 1))}
              disabled={weekOffset === 0}
              className="flex h-10 w-10 items-center justify-center rounded-2xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-30"
              aria-label="Previous interview slots"
            >
              <ChevronLeft size={20} />
            </button>
            <p className="text-base font-black text-ink sm:text-lg">{weekRange}</p>
            <button
              type="button"
              onClick={() => setWeekOffset((current) => current + 1)}
              className="flex h-10 w-10 items-center justify-center rounded-2xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              aria-label="Next interview slots"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="mt-4 max-h-[22rem] space-y-5 overflow-y-auto pr-1">
            {weekDays.map((day, dayIndex) => {
              const dateKey = toDateKey(day);
              return (
                <section key={dateKey}>
                  <h3 className="text-xs font-black uppercase tracking-wide text-slate-400">{formatDayLabel(day, dayIndex)}</h3>
                  <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-6 md:grid-cols-9 [&>*]:w-full">
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
                            "rounded-xl px-2 py-2 text-xs font-black transition",
                            selected
                              ? "bg-sky text-slate-950 shadow-sm"
                              : "bg-slate-100 text-slate-700 hover:bg-sky/20 hover:text-slate-900"
                          )}
                        >
                          {formatSlotLabel(time)}
                        </button>
                      );
                    })}
                    <button
                      type="button"
                      onClick={() => {
                        setCustomDate(dateKey);
                        setCustomTimeOpen(true);
                      }}
                      className={clsx(
                        "rounded-xl px-2 py-2 text-xs font-black transition",
                        customTimeOpen && customDate === dateKey
                          ? "bg-brand/20 text-slate-900 ring-1 ring-brand/40"
                          : "bg-slate-50 text-slate-500 ring-1 ring-slate-200 hover:bg-slate-100 hover:text-slate-700"
                      )}
                    >
                      Custom
                    </button>
                  </div>
                </section>
              );
            })}
          </div>

          {customTimeOpen && (
            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-black text-slate-700">Custom interview time</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
                <input
                  type="date"
                  value={customDate}
                  onChange={(event) => setCustomDate(event.target.value)}
                  className="field text-sm"
                  aria-label="Custom interview date"
                />
                <input
                  type="time"
                  value={customTime}
                  onChange={(event) => setCustomTime(event.target.value)}
                  className="field text-sm"
                  aria-label="Custom interview time"
                />
                <button
                  type="button"
                  onClick={selectCustomTime}
                  className="rounded-2xl bg-sky px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-brand"
                >
                  Use time
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-5 flex gap-3">
          <button onClick={handleConfirm} className="primary-button flex-1">
            Add Calendar
          </button>
        </div>
      </div>
    </div>
  );
}
