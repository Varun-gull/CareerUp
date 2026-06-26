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
    <div className="hidden min-w-0 flex-1 items-center justify-center gap-2 md:flex">
      {navItems.map((item) => {
        const active = item.label === "Postings" ? pathname.startsWith("/postings") : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              "rounded-xl px-4 py-2.5 text-[15px] font-black transition",
              active
                ? "bg-white text-ink shadow-sm"
                : "text-slate-300 hover:bg-white/10 hover:text-white"
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
