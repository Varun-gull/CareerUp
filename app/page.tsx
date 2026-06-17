import { ArrowRight, Flame, ShieldCheck, Trophy } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { RankBadge } from "@/components/RankBadge";
import { profile } from "@/lib/mock-data";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="bg-ink text-white">
          <div className="page-shell grid min-h-[calc(100vh-72px)] items-center gap-10 py-12 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-sm font-black uppercase text-blue-300">Gamified internship tracking</p>
              <h1 className="mt-4 max-w-2xl text-5xl font-black leading-tight sm:text-6xl">CareerUp</h1>
              <p className="mt-5 max-w-xl text-lg leading-8 text-slate-300">
                Build your internship pipeline, earn XP for real progress, keep your streak alive, and level up from saved roles to interviews.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/dashboard" className="primary-button">
                  Open dashboard <ArrowRight className="ml-2" size={18} />
                </Link>
                <Link href="/signup" className="inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-600 px-5 font-bold text-white hover:border-blue-300">
                  Create account
                </Link>
              </div>
              <div className="mt-10 grid max-w-xl gap-3 sm:grid-cols-3">
                <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                  <Trophy className="text-blue-300" size={22} />
                  <p className="mt-3 text-2xl font-black">430</p>
                  <p className="text-sm text-slate-400">XP earned</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                  <Flame className="text-blue-300" size={22} />
                  <p className="mt-3 text-2xl font-black">6</p>
                  <p className="text-sm text-slate-400">Day streak</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                  <ShieldCheck className="text-blue-300" size={22} />
                  <div className="mt-3">
                    <RankBadge xp={profile.xp} />
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/careerup-dashboard-preview.png"
                alt="CareerUp gamified dashboard preview"
                width={1400}
                height={960}
                priority
                className="rounded-lg border border-white/10 shadow-2xl shadow-blue-950/60"
              />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
