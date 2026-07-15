"use client";

import {
  CalendarDays,
  ClipboardList,
  Gift,
  LayoutGrid,
  Mail,
  MessagesSquare,
  Search,
  Settings,
  Trophy,
  Users
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import type { LucideIcon } from "lucide-react";

type SidebarLink = { href: string; label: string; icon: LucideIcon; badge?: number };

const mainLinks: SidebarLink[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutGrid },
  { href: "/applications", label: "Applications", icon: ClipboardList },
  { href: "/postings/internships", label: "Postings", icon: Search },
  { href: "/interview", label: "Interview Prep", icon: MessagesSquare },
  { href: "/calendar", label: "Calendar", icon: CalendarDays }
];

const progressLinks: SidebarLink[] = [
  { href: "/rewards", label: "Rewards", icon: Gift },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/friends", label: "Friends", icon: Users }
];

function RailItem({ link, active }: { link: SidebarLink; active: boolean }) {
  const Icon = link.icon;
  return (
    <Link
      href={link.href}
      title={link.label}
      aria-label={link.label}
      aria-current={active ? "page" : undefined}
      className={clsx(
        "group relative flex h-11 w-11 items-center justify-center rounded-2xl transition",
        active
          ? "bg-slate-950 text-white shadow-strong"
          : "bg-white/70 text-slate-500 shadow-sm ring-1 ring-slate-200/70 hover:bg-white hover:text-slate-900"
      )}
    >
      <Icon size={19} />
      {link.badge !== undefined && link.badge > 0 && (
        <span className="absolute -right-1 -top-1 flex h-4.5 min-w-[1.125rem] items-center justify-center rounded-full bg-sky px-1 text-[10px] font-bold text-white ring-2 ring-white">
          {link.badge > 9 ? "9+" : link.badge}
        </span>
      )}
      <span className="pointer-events-none absolute left-full z-50 ml-3 hidden whitespace-nowrap rounded-xl bg-slate-950 px-3 py-1.5 text-xs font-semibold text-white shadow-strong group-hover:block">
        {link.label}
      </span>
    </Link>
  );
}

export function SidebarNavLinks({ unreadMessages }: { unreadMessages: number }) {
  const pathname = usePathname();

  const generalLinks: SidebarLink[] = [
    { href: "/messages", label: "Messages", icon: Mail, badge: unreadMessages },
    { href: "/settings", label: "Settings", icon: Settings }
  ];

  function isActive(href: string) {
    if (href === "/postings/internships") return pathname.startsWith("/postings");
    return pathname.startsWith(href);
  }

  return (
    <div className="flex flex-col items-center gap-5">
      <nav className="flex flex-col items-center gap-2">
        {mainLinks.map((link) => (
          <RailItem key={link.href} link={link} active={isActive(link.href)} />
        ))}
      </nav>
      <span className="h-px w-8 bg-slate-200" />
      <nav className="flex flex-col items-center gap-2">
        {progressLinks.map((link) => (
          <RailItem key={link.href} link={link} active={isActive(link.href)} />
        ))}
      </nav>
      <span className="h-px w-8 bg-slate-200" />
      <nav className="flex flex-col items-center gap-2">
        {generalLinks.map((link) => (
          <RailItem key={link.href} link={link} active={isActive(link.href)} />
        ))}
      </nav>
    </div>
  );
}
