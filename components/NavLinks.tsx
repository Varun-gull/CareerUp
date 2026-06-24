"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const navItems = [
  { href: "/postings/internships", label: "Postings" },
  { href: "/applications", label: "Applications" },
  { href: "/interview", label: "Interview Prep" },
  { href: "/rewards", label: "Rewards" },
  { href: "/leaderboard", label: "Leaderboard" },
];

export function NavLinks() {
  const pathname = usePathname();
  return (
    <div className="hidden flex-1 items-center justify-center gap-1 md:flex">
      {navItems.map((item) => {
        const active = item.label === "Postings" ? pathname.startsWith("/postings") : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              "rounded-lg px-4 py-2 text-sm font-bold transition-colors",
              active
                ? "bg-white text-ink shadow-sm ring-1 ring-slate-200"
                : "text-slate-600 hover:bg-white/70 hover:text-ink"
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
