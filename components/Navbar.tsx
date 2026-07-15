import { BriefcaseBusiness, Mail } from "lucide-react";
import Link from "next/link";
import { CalendarTile } from "@/components/CalendarTile";
import { ProfileDropdown } from "@/components/ProfileDropdown";
import { NavLinks } from "@/components/NavLinks";
import { getCurrentProfile, getCurrentUser, getUnreadPeerMessageCount } from "@/lib/data";

function MessageButton({ unreadMessages }: { unreadMessages: number }) {
  return (
    <Link
      href="/messages"
      className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-sky/50 hover:text-sky-600 hover:shadow-md"
      aria-label={unreadMessages > 0 ? `Messages, ${unreadMessages} unread` : "Messages"}
    >
      <Mail size={19} />
      {unreadMessages > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-sky px-1 text-[10px] font-bold text-white ring-2 ring-navy">
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
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-navy/95 shadow-lg shadow-black/25 backdrop-blur-xl">
      <nav className="grid w-full grid-cols-[auto_auto] items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:grid-cols-[1fr_auto_1fr] lg:px-8">
        <Link href="/dashboard" className="group flex shrink-0 items-center gap-3 justify-self-start font-bold text-white">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-800 via-slate-700 to-sky text-white shadow-glow transition group-hover:-translate-y-0.5">
            <BriefcaseBusiness size={22} />
          </span>
          <span className="text-lg">CareerUp</span>
        </Link>
        <NavLinks />
        <div className="col-start-2 row-start-1 flex shrink-0 items-center justify-end gap-2 justify-self-end lg:col-start-3">
          {user && <MessageButton unreadMessages={unreadMessages} />}
          <CalendarTile />
          <ProfileDropdown
            initials={initials}
            displayName={firstName}
            loggedIn={!!user}
            schoolLogoUrl={profile?.schoolLogoUrl ?? ""}
            unreadMessages={unreadMessages}
          />
        </div>
      </nav>
    </header>
  );
}
