import { ArrowRight, BriefcaseBusiness, CheckCircle2, LogIn, Radar, Trophy, UserPlus } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/data";

export default async function HomePage() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <main className="page-shell grid min-h-screen place-items-center">
      <section className="grid w-full max-w-6xl overflow-hidden rounded-[2rem] border border-slate-200 bg-white/90 shadow-strong backdrop-blur-xl lg:grid-cols-[1.1fr_0.9fr]">
        <div className="bg-navy px-6 py-12 text-white sm:px-10 lg:px-12 lg:py-16">
          <Link href="/dashboard" className="flex w-fit items-center gap-3 font-black text-white">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-800 via-slate-700 to-sky text-white shadow-glow">
              <BriefcaseBusiness size={24} />
            </span>
            <span className="text-2xl">CareerUp</span>
          </Link>

          <p className="mt-12 text-xs font-black uppercase text-sky">Internship operating system</p>
          <h1 className="mt-3 max-w-2xl text-4xl font-black leading-tight sm:text-6xl">Find roles, track progress, and turn applying into momentum.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-700">
            A focused workspace for live postings, application boards, XP streaks, friend competition, and interview prep.
          </p>

          <div className="mt-8 grid max-w-xl gap-3 sm:grid-cols-2">
            <Link href="/login" className="primary-button">
              <LogIn className="mr-2" size={18} /> Log in
            </Link>
            <Link href="/signup" className="secondary-button">
              <UserPlus className="mr-2" size={18} /> Create account
            </Link>
          </div>
        </div>

        <div className="grid content-center gap-4 bg-slate-50/90 px-6 py-10 sm:px-10 lg:px-12">
          {[
            [Radar, "Live posting search", "Internship and new-grad roles from multiple sources, sorted by fit or freshness."],
            [CheckCircle2, "Application pipeline", "Save roles, drag them between stages, and keep every deadline visible."],
            [Trophy, "XP and rewards", "Stay consistent with streaks, quests, ranks, and unlockable prep tools."]
          ].map(([Icon, title, body]) => (
            <div key={title as string} className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm">
              <div className="flex items-start gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky text-slate-950">
                  <Icon size={22} />
                </span>
                <div>
                  <h2 className="font-black text-ink">{title as string}</h2>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{body as string}</p>
                </div>
              </div>
            </div>
          ))}
          <Link href="/dashboard" className="inline-flex items-center text-sm font-black text-sky hover:text-brand">
            Already signed in? Open dashboard <ArrowRight className="ml-1" size={16} />
          </Link>
        </div>
      </section>
    </main>
  );
}
