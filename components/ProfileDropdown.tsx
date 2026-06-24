"use client";

import { UserRound, Users, User, LogOut } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export function ProfileDropdown({ initials, loggedIn }: { initials: string; loggedIn: boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  if (!loggedIn) {
    return (
      <Link
        href="/login"
        className="flex h-10 min-w-10 items-center justify-center rounded-lg border border-slate-200 px-2 text-sm font-black text-slate-700 transition hover:border-[#8AAEC0] hover:text-[#2F4156]"
      >
        <UserRound size={20} />
      </Link>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex h-10 min-w-10 items-center justify-center rounded-lg border border-slate-200 px-2 text-sm font-black text-slate-700 transition hover:border-[#8AAEC0] hover:text-[#2F4156]"
        aria-label="Open profile menu"
      >
        {initials}
      </button>

      {open && (
        <div className="absolute right-0 top-12 z-50 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
          <Link
            href="/profile"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-[#2F4156]"
          >
            <User size={16} /> Profile
          </Link>
          <Link
            href="/friends"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-[#2F4156]"
          >
            <Users size={16} /> Friends
          </Link>
          <div className="border-t border-slate-100" />
          <Link
            href="/login"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50"
          >
            <LogOut size={16} /> Log out
          </Link>
        </div>
      )}
    </div>
  );
}
