import { BriefcaseBusiness, CalendarDays } from "lucide-react";
import Link from "next/link";
import { ProfileDropdown } from "@/components/ProfileDropdown";
import { NavLinks } from "@/components/NavLinks";
import { getCurrentProfile, getCurrentUser } from "@/lib/data";

const MONTH_ABBR = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];

function CalendarWidget() {
  const now = new Date();
  const month = MONTH_ABBR[now.getMonth()];
  const day = now.getDate();
  return (
    <Link
      href="/calendar"
      className="relative hidden h-10 w-10 select-none items-center justify-center overflow-hidden rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow sm:flex flex-col gap-0"
      aria-label="Calendar"
    >
      <span className="absolute top-0 left-0 right-0 h-[16px] bg-blue-600 flex items-center justify-center">
        <span className="text-[8px] font-black tracking-widest text-white uppercase leading-none">{month}</span>
      </span>
      <span className="relative mt-3 text-[15px] font-black text-ink leading-none">{day}</span>
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

export async function Navbar() {
  const user = await getCurrentUser();
  const profile = user ? await getCurrentProfile() : null;
  const initials = user ? getInitials(profile?.name ?? user.email ?? "CareerUp") : "";

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-slate-50/95 backdrop-blur">
      <nav className="page-shell flex items-center justify-between gap-4 py-4">
        <Link href="/dashboard" className="flex items-center gap-3 font-black text-ink">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-ink text-white">
            <BriefcaseBusiness size={22} />
          </span>
          <span>CareerUp</span>
        </Link>
        <NavLinks />
        <div className="flex items-center gap-2">
          <CalendarWidget />
          <ProfileDropdown initials={initials} loggedIn={!!user} />
        </div>
      </nav>
    </header>
  );
}
