import { ArrowRight, BriefcaseBusiness, LogIn, UserPlus } from "lucide-react";
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
      <section className="card w-full max-w-4xl overflow-hidden text-center">
        <div className="bg-slate-950 px-6 py-12 text-white sm:px-10 sm:py-16">
        <Link href="/dashboard" className="mx-auto flex w-fit items-center gap-3 font-black text-white">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-violet-800 text-white shadow-glow">
            <BriefcaseBusiness size={24} />
          </span>
          <span className="text-2xl">CareerUp</span>
        </Link>

        <p className="mt-10 text-xs font-black uppercase tracking-[0.16em] text-purple-200">Gamified internship tracking</p>
        <h1 className="mx-auto mt-3 max-w-2xl text-4xl font-black leading-tight tracking-tight sm:text-5xl">Build your internship pipeline from one clear command center.</h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-300">
          Track applications, find live postings, earn XP, build your streak, and prep for interviews with your resume and goals in one place.
        </p>
        </div>

        <div className="mx-auto grid max-w-xl gap-3 px-6 py-8 sm:grid-cols-2">
          <Link href="/login" className="primary-button">
            <LogIn className="mr-2" size={18} /> Log in
          </Link>
          <Link href="/signup" className="secondary-button">
            <UserPlus className="mr-2" size={18} /> Create account
          </Link>
        </div>

        <Link href="/dashboard" className="mb-8 inline-flex items-center text-sm font-black text-purple-800 hover:text-purple-900">
          Already signed in? Open dashboard <ArrowRight className="ml-1" size={16} />
        </Link>
      </section>
    </main>
  );
}
