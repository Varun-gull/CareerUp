import {
  BriefcaseBusiness,
  CalendarDays,
  ClipboardList,
  Gift,
  LayoutGrid,
  Mail,
  MessagesSquare,
  Search,
  Settings,
  Trophy,
  UserRound,
  Users
} from "lucide-react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { getRankProgress } from "@/lib/rank";

type SidebarLink = { href: string; label: string; icon: LucideIcon; active?: boolean; badge?: number };

const mainLinks: SidebarLink[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutGrid, active: true },
  { href: "/applications", label: "Applications", icon: ClipboardList },
  { href: "/postings/internships", label: "Postings", icon: Search },
  { href: "/interview", label: "Interview Prep", icon: MessagesSquare }
];

const progressLinks: SidebarLink[] = [
  { href: "/rewards", label: "Rewards", icon: Gift },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/friends", label: "Friends", icon: Users }
];

function SidebarItem({ link }: { link: SidebarLink }) {
  const Icon = link.icon;
  return (
    <Link
      href={link.href}
      aria-current={link.active ? "page" : undefined}
      className={
        link.active
          ? "flex items-center gap-3 rounded-2xl bg-sky/15 px-4 py-2.5 text-sm font-semibold text-slate-950"
          : "flex items-center gap-3 rounded-2xl px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
      }
    >
      <Icon size={18} className={link.active ? "text-sky-600" : "text-slate-400"} />
      <span className="flex-1">{link.label}</span>
      {link.badge !== undefined && link.badge > 0 && (
        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-sky px-1 text-[10px] font-bold text-slate-950">
          {link.badge > 9 ? "9+" : link.badge}
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

export function DashboardSidebar({
  name,
  email,
  xp,
  unreadMessages
}: {
  name: string;
  email: string;
  xp: number;
  unreadMessages: number;
}) {
  const progress = getRankProgress(xp);

  const generalLinks: SidebarLink[] = [
    { href: "/calendar", label: "Calendar", icon: CalendarDays },
    { href: "/messages", label: "Messages", icon: Mail, badge: unreadMessages },
    { href: "/profile", label: "Profile", icon: UserRound },
    { href: "/settings", label: "Settings", icon: Settings }
  ];

  return (
    <aside className="card hidden h-fit flex-col gap-5 p-5 lg:sticky lg:top-6 lg:flex">
      <Link href="/dashboard" className="flex items-center gap-3 px-1 font-bold text-ink">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-navy text-white shadow-glow">
          <BriefcaseBusiness size={20} />
        </span>
        <span className="text-lg">CareerUp</span>
      </Link>

      <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-800 via-slate-700 to-sky text-sm font-bold text-white">
          {getInitials(name)}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-ink">{name}</p>
          <p className="truncate text-xs text-slate-500">{email}</p>
        </div>
      </div>

      <nav className="grid gap-1">
        {mainLinks.map((link) => (
          <SidebarItem key={link.href} link={link} />
        ))}
      </nav>

      <div>
        <p className="section-label px-4">Progress</p>
        <nav className="mt-2 grid gap-1">
          {progressLinks.map((link) => (
            <SidebarItem key={link.href} link={link} />
          ))}
        </nav>
      </div>

      <div>
        <p className="section-label px-4">General</p>
        <nav className="mt-2 grid gap-1">
          {generalLinks.map((link) => (
            <SidebarItem key={link.href} link={link} />
          ))}
        </nav>
      </div>

      <div className="rounded-3xl bg-gradient-to-br from-sky-500 to-blue-600 p-5 text-white shadow-glow">
        <p className="text-xs font-semibold uppercase tracking-wider text-sky-100">Current rank</p>
        <p className="font-display mt-1 text-xl font-bold">{progress.current.name}</p>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/25">
          <div className="h-full rounded-full bg-white" style={{ width: `${progress.percent}%` }} />
        </div>
        <p className="mt-2 text-xs font-semibold text-sky-100">
          {progress.next ? `${progress.remaining} XP to ${progress.next.name}` : "Max rank unlocked"}
        </p>
        <Link
          href="/rewards"
          className="mt-4 flex min-h-10 items-center justify-center rounded-xl bg-white/15 text-sm font-semibold text-white ring-1 ring-white/30 transition hover:bg-white/25"
        >
          View rewards
        </Link>
      </div>
    </aside>
  );
}
