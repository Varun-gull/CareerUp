import { BriefcaseBusiness } from "lucide-react";
import Link from "next/link";
import { SidebarNavLinks } from "@/components/SidebarNavLinks";
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

export async function AppSidebar() {
  const user = await getCurrentUser();
  const [profile, unreadMessages] = user ? await Promise.all([getCurrentProfile(), getUnreadPeerMessageCount()]) : [null, 0];
  const name = profile?.name ?? user?.email ?? "CareerUp";

  return (
    <aside className="hidden lg:sticky lg:top-0 lg:flex lg:h-[inherit] lg:max-h-screen lg:flex-col lg:items-center lg:gap-6 lg:overflow-y-auto lg:px-3 lg:py-5">
      <Link
        href="/dashboard"
        title="CareerUp"
        aria-label="CareerUp home"
        className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky text-white shadow-glow transition hover:scale-105"
      >
        <BriefcaseBusiness size={20} />
      </Link>

      <SidebarNavLinks unreadMessages={unreadMessages} />

      <div className="mt-auto flex flex-col items-center gap-2 pt-4">
        <Link href="/profile" title={name} aria-label="Open your profile" className="transition hover:scale-105">
          {profile?.schoolLogoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.schoolLogoUrl}
              alt={profile.school ? `${profile.school} logo` : "School logo"}
              className="h-11 w-11 rounded-2xl border border-slate-200 bg-white object-contain p-1 shadow-sm"
            />
          ) : (
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-sm font-bold text-white shadow-sm">
              {getInitials(name)}
            </span>
          )}
        </Link>
      </div>
    </aside>
  );
}
