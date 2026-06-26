import { BriefcaseBusiness } from "lucide-react";
import Link from "next/link";
import { ProfileDropdown } from "@/components/ProfileDropdown";
import { NavLinks } from "@/components/NavLinks";
import { getCurrentProfile, getCurrentUser, getUnreadPeerMessageCount } from "@/lib/data";

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
    <header className="sticky top-0 z-30 border-b border-slate-800 bg-navy/95 shadow-lg shadow-black/25 backdrop-blur-xl">
      <nav className="grid w-full grid-cols-[auto_auto] items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:grid-cols-[auto_1fr_auto] lg:px-8">
        <Link href="/dashboard" className="group flex shrink-0 items-center gap-3 font-black text-white">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-800 via-slate-700 to-sky text-white shadow-glow transition group-hover:-translate-y-0.5">
            <BriefcaseBusiness size={22} />
          </span>
          <span className="text-lg">CareerUp</span>
        </Link>
        <NavLinks unreadMessages={unreadMessages} />
        <div className="col-start-2 row-start-1 flex shrink-0 items-center justify-end gap-2">
          <ProfileDropdown initials={initials} displayName={firstName} loggedIn={!!user} unreadMessages={unreadMessages} />
        </div>
      </nav>
    </header>
  );
}
