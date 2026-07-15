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
  { href: "/interview", label: "Interview Prep", icon: MessagesSquare }
];

const progressLinks: SidebarLink[] = [
  { href: "/rewards", label: "Rewards", icon: Gift },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/friends", label: "Friends", icon: Users }
];

function SidebarItem({ link, active }: { link: SidebarLink; active: boolean }) {
  const Icon = link.icon;
  return (
    <Link
      href={link.href}
      aria-current={active ? "page" : undefined}
      className={clsx(
        "flex items-center gap-3 rounded-[1.1rem] px-4 py-2.5 text-sm font-semibold transition",
        active ? "bg-slate-950 text-white shadow-sm" : "text-slate-700 hover:bg-white/75 hover:text-slate-950"
      )}
    >
      <Icon size={18} className={active ? "text-sky" : "text-slate-500"} />
      <span className="flex-1">{link.label}</span>
      {link.badge !== undefined && link.badge > 0 && (
        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-lime-200 px-1 text-[10px] font-bold text-slate-950">
          {link.badge > 9 ? "9+" : link.badge}
        </span>
      )}
    </Link>
  );
}

export function SidebarNavLinks({ unreadMessages }: { unreadMessages: number }) {
  const pathname = usePathname();

  const generalLinks: SidebarLink[] = [
    { href: "/calendar", label: "Calendar", icon: CalendarDays },
    { href: "/messages", label: "Messages", icon: Mail, badge: unreadMessages },
    { href: "/settings", label: "Settings", icon: Settings }
  ];

  function isActive(href: string) {
    if (href === "/postings/internships") return pathname.startsWith("/postings");
    return pathname.startsWith(href);
  }

  return (
    <div className="grid gap-5">
      <nav className="grid gap-1">
        {mainLinks.map((link) => (
          <SidebarItem key={link.href} link={link} active={isActive(link.href)} />
        ))}
      </nav>
      <div>
        <p className="section-label px-4">Progress</p>
        <nav className="mt-2 grid gap-1">
          {progressLinks.map((link) => (
            <SidebarItem key={link.href} link={link} active={isActive(link.href)} />
          ))}
        </nav>
      </div>
      <div>
        <p className="section-label px-4">General</p>
        <nav className="mt-2 grid gap-1">
          {generalLinks.map((link) => (
            <SidebarItem key={link.href} link={link} active={isActive(link.href)} />
          ))}
        </nav>
      </div>
    </div>
  );
}
