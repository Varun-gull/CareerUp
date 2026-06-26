"use client";

import Link from "next/link";
import { CalendarDays, Mail } from "lucide-react";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/applications", label: "Applications" },
  { href: "/postings/internships", label: "Postings" },
  { href: "/interview", label: "Interview Prep" },
  { href: "/rewards", label: "Rewards" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/messages", label: "Messages" },
  { href: "/calendar", label: "Calendar" },
];

export function NavLinks({ unreadMessages = 0 }: { unreadMessages?: number }) {
  const pathname = usePathname();
  return (
    <div className="nav-scroll col-span-2 row-start-2 -mx-1 flex min-w-0 items-center gap-2.5 overflow-x-auto pb-1 lg:col-span-1 lg:row-start-auto lg:mx-0 lg:justify-center lg:overflow-visible lg:pb-0 xl:gap-3">
      {navItems.map((item) => {
        const active = item.label === "Postings" ? pathname.startsWith("/postings") : pathname.startsWith(item.href);
        const Icon = item.label === "Messages" ? Mail : item.label === "Calendar" ? CalendarDays : null;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              "shrink-0 rounded-2xl px-4 py-2.5 text-sm font-black transition sm:text-[15px]",
              active
                ? "bg-sky text-slate-950 shadow-glow"
                : "text-slate-300 hover:bg-white/10 hover:text-sky"
            )}
            aria-current={active ? "page" : undefined}
          >
            <span className="inline-flex items-center gap-2">
              {Icon && <Icon size={15} />}
              {item.label}
              {item.label === "Messages" && unreadMessages > 0 && (
                <span className="rounded-full bg-slate-950 px-2 py-0.5 text-[10px] font-black text-sky ring-1 ring-sky/30">
                  {unreadMessages > 9 ? "9+" : unreadMessages}
                </span>
              )}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
