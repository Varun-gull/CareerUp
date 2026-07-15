"use client";

import {
  CalendarDays,
  ClipboardList,
  Gift,
  LayoutGrid,
  Mail,
  MessagesSquare,
  Search,
  Settings
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
  { href: "/messages", label: "Messages", icon: Mail },
  { href: "/interview", label: "Interview Prep", icon: MessagesSquare },
  { href: "/calendar", label: "Calendar", icon: CalendarDays }
];

const progressLinks: SidebarLink[] = [
  { href: "/rewards", label: "Rewards", icon: Gift }
];

const utilityLinks: SidebarLink[] = [
  { href: "/settings", label: "Settings", icon: Settings }
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
          ? "bg-[#0b2f64] text-white shadow-strong"
          : "bg-white/70 text-slate-500 shadow-sm ring-1 ring-slate-200/70 hover:bg-white hover:text-[#0b2f64]"
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
  const links = mainLinks.map((link) => (link.href === "/messages" ? { ...link, badge: unreadMessages } : link));

  function isActive(href: string) {
    if (href === "/postings/internships") return pathname.startsWith("/postings");
    return pathname.startsWith(href);
  }

  return (
    <div className="flex h-full flex-col items-center">
      <div className="flex flex-1 flex-col items-center justify-center gap-5">
        <nav className="flex flex-col items-center gap-2">
          {links.map((link) => (
            <RailItem key={link.href} link={link} active={isActive(link.href)} />
          ))}
        </nav>
        <nav className="flex flex-col items-center gap-2">
          {progressLinks.map((link) => (
            <RailItem key={link.href} link={link} active={isActive(link.href)} />
          ))}
        </nav>
      </div>
      <nav className="flex flex-col items-center gap-2 pb-1">
        {utilityLinks.map((link) => (
          <RailItem key={link.href} link={link} active={isActive(link.href)} />
        ))}
      </nav>
    </div>
  );
}
