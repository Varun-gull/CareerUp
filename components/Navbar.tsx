import { Bell, BriefcaseBusiness } from "lucide-react";
import Link from "next/link";
import { ProfileDropdown } from "@/components/ProfileDropdown";
import { NavLinks } from "@/components/NavLinks";
import { getCurrentProfile, getCurrentUser, getUnreadPeerMessageCount } from "@/lib/data";

const MONTH_ABBR = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];

function CalendarWidget() {
  const now = new Date();
  const month = MONTH_ABBR[now.getMonth()];
  const day = now.getDate();
  return (
    <Link
      href="/calendar"
      className="relative hidden h-11 w-11 select-none items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/95 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:flex flex-col gap-0"
      aria-label="Calendar"
    >
      <span className="absolute left-0 right-0 top-0 flex h-[16px] items-center justify-center bg-purple-700">
        <span className="text-[8px] font-black tracking-widest text-white uppercase leading-none">{month}</span>
      </span>
      <span className="relative mt-3 text-[15px] font-black text-ink leading-none">{day}</span>
    </Link>
  );
}

function NotificationButton({ unreadMessages }: { unreadMessages: number }) {
  return (
    <Link
      href="/messages"
      className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/95 text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:text-purple-800 hover:shadow-md"
      aria-label={unreadMessages > 0 ? `Messages, ${unreadMessages} unread` : "Messages"}
    >
      <Bell size={19} />
      {unreadMessages > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-purple-700 px-1 text-[10px] font-black text-white ring-2 ring-slate-950">
          {unreadMessages > 9 ? "9+" : unreadMessages}
        </span>
      )}
    </Link>
  );
}

function getInitials(name: string) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return initials || "CU";
}

function getFirstName(name: string) {
  return name.split(/\s+/).filter(Boolean)[0] ?? "";
}

export async function Navbar() {
  const user = await getCurrentUser();
  const [profile, unreadMessages] = user ? await Promise.all([getCurrentProfile(), getUnreadPeerMessageCount()]) : [null, 0];
  const profileName = profile?.name ?? user?.email ?? "CareerUp";
  const initials = user ? getInitials(profileName) : "";
  const firstName = user ? getFirstName(profile?.name ?? "") : "";

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#070b17]/95 shadow-lg shadow-slate-950/10 backdrop-blur-xl">
      <nav className="flex w-full items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/dashboard" className="group flex shrink-0 items-center gap-3 font-black text-white">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-violet-800 text-white shadow-glow transition group-hover:-translate-y-0.5">
            <BriefcaseBusiness size={22} />
          </span>
          <span className="text-lg tracking-tight">CareerUp</span>
        </Link>
        <NavLinks />
        <div className="flex shrink-0 items-center gap-2">
          {user && <NotificationButton unreadMessages={unreadMessages} />}
          <CalendarWidget />
          <ProfileDropdown initials={initials} displayName={firstName} loggedIn={!!user} unreadMessages={unreadMessages} />
        </div>
      </nav>
    </header>
  );
}
