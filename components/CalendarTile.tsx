"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const MONTH_ABBR = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

function getCalendarParts() {
  const now = new Date();
  return {
    month: MONTH_ABBR[now.getMonth()],
    day: now.getDate(),
  };
}

export function CalendarTile() {
  const [parts, setParts] = useState(getCalendarParts);

  useEffect(() => {
    setParts(getCalendarParts());
  }, []);

  return (
    <Link
      href="/calendar"
      className="relative hidden h-11 w-11 select-none flex-col items-center justify-center gap-0 overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-950 shadow-sm transition hover:-translate-y-0.5 hover:border-sky/50 hover:shadow-md sm:flex"
      aria-label="Calendar"
      suppressHydrationWarning
    >
      <span className="absolute left-0 right-0 top-0 flex h-[16px] items-center justify-center bg-sky">
        <span className="text-[8px] font-black uppercase leading-none text-slate-950">{parts.month}</span>
      </span>
      <span className="relative mt-3 text-[15px] font-black leading-none">{parts.day}</span>
    </Link>
  );
}
