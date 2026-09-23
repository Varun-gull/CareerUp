"use client";

import {
  CalendarDays,
  ClipboardList,
  Gift,
  Home,
  Mail,
  MessagesSquare,
  Search
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import type { LucideIcon } from "lucide-react";

type DockLink = { href: string; label: string; icon: LucideIcon; match?: string };

/* Ordered the way a search actually runs: check the day, work the board, find
   new roles, answer people, prepare, then look ahead and cash in. */
const links: DockLink[] = [
  { href: "/dashboard", label: "Today", icon: Home },
  { href: "/applications", label: "Applications", icon: ClipboardList },
  { href: "/postings/internships", label: "Postings", icon: Search, match: "/postings" },
  { href: "/messages", label: "Messages", icon: Mail },
  { href: "/interview", label: "Prep", icon: MessagesSquare },
  { href: "/calendar", label: "Calendar", icon: CalendarDays },
  { href: "/rewards", label: "Rewards", icon: Gift }
];

export function NavDock({ unreadMessages }: { unreadMessages: number }) {
  const pathname = usePathname();

  function isActive(link: DockLink) {
    return pathname.startsWith(link.match ?? link.href);
  }

  return (
    <nav className="dock" aria-label="Sections">
      <div className="dock-shell">
        {links.map((link) => {
          const Icon = link.icon;
          const active = isActive(link);
          const badge = link.href === "/messages" ? unreadMessages : 0;

          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={active ? "page" : undefined}
              aria-label={link.label}
              title={link.label}
              className="dock-item"
            >
              <Icon size={19} className="shrink-0" aria-hidden />
              <span className="dock-label">{link.label}</span>
              {badge > 0 && (
                <span
                  className={clsx(
                    "metric absolute right-1 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-semibold ring-2 ring-white",
                    active ? "bg-white text-[#2A6384]" : "bg-[#2A6384] text-white"
                  )}
                >
                  {badge > 9 ? "9+" : badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
