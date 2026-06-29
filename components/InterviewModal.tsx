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
                    <button
                      type="button"
                      onClick={() => {
                        setCustomDate(dateKey);
                        setCustomTimeOpen(true);
                      }}
                      className={clsx(
                        "rounded-2xl px-3 py-3 text-sm font-black transition sm:text-base",
                        customTimeOpen && customDate === dateKey
                          ? "bg-white text-slate-950"
                          : "bg-slate-900 text-slate-200 ring-1 ring-white/10 hover:bg-white/10 hover:text-white"
                      )}
                    >
                      Custom time
                    </button>
                  </div>
                </section>
              );
            })}
          </div>

          {customTimeOpen && (
            <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm font-black text-white">Custom interview time</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
                <input
                  type="date"
                  value={customDate}
                  onChange={(event) => setCustomDate(event.target.value)}
                  className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm font-bold text-white outline-none focus:border-sky focus:ring-4 focus:ring-sky/20"
                  aria-label="Custom interview date"
                />
                <input
                  type="time"
                  value={customTime}
                  onChange={(event) => setCustomTime(event.target.value)}
                  className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm font-bold text-white outline-none focus:border-sky focus:ring-4 focus:ring-sky/20"
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
