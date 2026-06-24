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
    <div className="hidden min-w-0 flex-1 items-center justify-center gap-1 md:flex">
      {navItems.map((item) => {
        const active = item.label === "Postings" ? pathname.startsWith("/postings") : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              "rounded-lg px-4 py-2 text-sm font-black transition-colors",
              active
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                : "text-slate-600 hover:bg-white hover:text-blue-700 hover:shadow-sm"
            )}
            aria-current={active ? "page" : undefined}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
