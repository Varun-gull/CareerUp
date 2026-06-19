"use client";

import {
  BarChart2,
  BookOpen,
  Box,
  BriefcaseBusiness,
  Calendar,
  ChevronRight,
  LayoutDashboard,
  ListTodo,
  PieChart,
  Settings,
  Star,
  Target,
  Zap
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/applications", label: "Applications", icon: ListTodo },
  { href: "/postings", label: "Opportunities", icon: Target },
  { href: "/challenges", label: "Challenges", icon: Zap },
  { href: "/rewards", label: "XP Rewards", icon: Star },
  { href: "/leaderboard", label: "Rankings", icon: BarChart2 },
  { href: "/interview", label: "Resources", icon: BookOpen },
  { href: "/friends", label: "Calendar", icon: Calendar },
  { href: "/profile", label: "Analytics", icon: PieChart },
];

const bottomItems = [
  { href: "/profile", label: "Settings", icon: Settings },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-52 flex-none flex-col border-r border-slate-700/50 bg-slate-900">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-6">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600">
          <BriefcaseBusiness size={18} className="text-white" />
        </span>
        <span className="text-base font-black text-white">CareerUp</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 px-3">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-bold transition-colors ${
                active
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Icon size={17} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Pro Tip */}
      <div className="mx-3 mb-4 rounded-xl bg-slate-800 p-4">
        <div className="flex items-center gap-2">
          <Zap size={14} className="text-blue-400" />
          <span className="text-xs font-black text-white">Pro Tip</span>
        </div>
        <p className="mt-2 text-xs leading-5 text-slate-400">
          Complete your profile to unlock more opportunities and XP.
        </p>
        <div className="mt-3">
          <div className="h-1.5 overflow-hidden rounded-full bg-slate-700">
            <div className="h-full w-3/4 rounded-full bg-blue-500" />
          </div>
          <p className="mt-1 text-right text-xs font-bold text-slate-500">75%</p>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-slate-700/50 px-3 py-3">
        {bottomItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-bold text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
          >
            <Icon size={17} />
            {label}
          </Link>
        ))}
      </div>
    </aside>
  );
}
