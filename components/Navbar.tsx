import { BriefcaseBusiness, Plus, UserRound } from "lucide-react";
import Link from "next/link";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/applications", label: "Applications" },
  { href: "/postings", label: "Postings" },
  { href: "/challenges", label: "Challenges" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/profile", label: "Profile" }
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
      <nav className="page-shell flex items-center justify-between gap-4 py-4">
        <Link href="/" className="flex items-center gap-3 font-black text-ink">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-ink text-white">
            <BriefcaseBusiness size={22} />
          </span>
          <span>CareerUp</span>
        </Link>
        <div className="hidden items-center gap-2 md:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="rounded-lg px-3 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 hover:text-ink">
              {item.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Link href="/applications/new" className="hidden rounded-lg bg-blue-600 p-2 text-white shadow-lg shadow-blue-600/20 sm:inline-flex" aria-label="Add application">
            <Plus size={20} />
          </Link>
          <Link href="/login" className="rounded-lg border border-slate-200 p-2 text-slate-700" aria-label="Log in">
            <UserRound size={20} />
          </Link>
        </div>
      </nav>
    </header>
  );
}
