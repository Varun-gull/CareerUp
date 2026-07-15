import { Flame, Star } from "lucide-react";
import Link from "next/link";
import { TopBarTabs } from "@/components/TopBarTabs";
import { getCurrentProfile, getCurrentUser } from "@/lib/data";
import { getRank } from "@/lib/rank";

export async function TopBar() {
  const user = await getCurrentUser();
  const profile = user ? await getCurrentProfile() : null;
  const rank = getRank(profile?.xp ?? 0);

  return (
    <header className="sticky top-0 z-40 hidden items-center justify-between gap-4 border-b border-slate-200/70 bg-[#f4f6f6]/90 px-6 py-3 backdrop-blur-xl lg:flex">
      <Link href="/dashboard" className="group leading-none">
        <span className="block text-3xl font-black tracking-tight text-[#4aa8e0] transition group-hover:opacity-80">CareerUp</span>
        <span className="mt-0.5 flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-slate-500">
          <Star size={10} className="fill-emerald-500 text-emerald-500" /> {rank.name}
        </span>
      </Link>

      <TopBarTabs />

      <div className="flex items-center gap-3">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-2 text-sm font-bold text-slate-800 shadow-sm ring-1 ring-slate-200">
          <Flame size={16} className={profile && profile.streak > 0 ? "text-emerald-500" : "text-slate-400"} />
          {profile?.streak ?? 0} day streak
        </span>
      </div>
    </header>
  );
}
