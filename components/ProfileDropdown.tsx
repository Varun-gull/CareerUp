"use client";

import { UserRound, Users, User, LogOut, Mail, Settings } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { logOut } from "@/lib/auth/actions";

export function ProfileDropdown({
  initials,
  displayName,
  loggedIn,
  schoolLogoUrl = "",
  unreadMessages = 0
}: {
  initials: string;
  displayName?: string;
  loggedIn: boolean;
  schoolLogoUrl?: string;
  unreadMessages?: number;
}) {
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
        className="flex h-11 min-w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white px-2 text-sm font-black text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:border-sky/40 hover:text-sky"
      >
        <UserRound size={20} />
      </Link>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex h-11 min-w-11 max-w-44 items-center justify-center gap-2 truncate rounded-2xl border border-slate-200 bg-white px-3 text-sm font-black text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:border-sky/40 hover:text-sky"
        aria-label="Open profile menu"
      >
        {schoolLogoUrl ? (
          <span className="flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-white">
            <img src={schoolLogoUrl} alt="" className="h-full w-full object-contain p-0.5" />
          </span>
        ) : null}
        <span className="truncate">{displayName || initials}</span>
      </button>

      {open && (
        <div className="absolute right-0 top-14 z-50 w-56 overflow-hidden rounded-3xl border border-slate-200 bg-white/95 p-1 shadow-strong backdrop-blur-xl">
          <Link
            href="/profile"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 hover:bg-sky/10 hover:text-sky"
          >
            <User size={16} /> Profile
          </Link>
          <Link
            href="/friends"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 hover:bg-sky/10 hover:text-sky"
          >
            <Users size={16} /> Friends
          </Link>
          <Link
            href="/messages"
            onClick={() => setOpen(false)}
            className="flex items-center justify-between gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 hover:bg-sky/10 hover:text-sky"
          >
            <span className="inline-flex items-center gap-3">
              <Mail size={16} /> Messages
            </span>
            {unreadMessages > 0 && <span className="rounded-full bg-sky px-2 py-0.5 text-xs font-black text-white">{unreadMessages}</span>}
          </Link>
          <Link
            href="/settings"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 hover:bg-sky/10 hover:text-sky"
          >
            <Settings size={16} /> Settings
          </Link>
          <div className="border-t border-slate-200" />
          <form action={logOut}>
            <button
              type="submit"
              onClick={() => setOpen(false)}
            className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-bold text-red-600 hover:bg-red-50"
            >
              <LogOut size={16} /> Log out
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
