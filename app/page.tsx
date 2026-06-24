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
      <section className="w-full max-w-3xl text-center">
        <Link href="/dashboard" className="mx-auto flex w-fit items-center gap-3 font-black text-ink">
          <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-ink text-white">
            <BriefcaseBusiness size={24} />
          </span>
          <span className="text-2xl">CareerUp</span>
        </Link>

        <p className="eyebrow mt-10">Gamified internship tracking</p>
        <h1 className="mt-3 text-4xl font-black leading-tight text-ink sm:text-5xl">Build your internship pipeline from one dashboard.</h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-slate-600">
          Track applications, find live postings, earn XP, build your streak, and prep for interviews with your resume and goals in one place.
        </p>

        <div className="mx-auto mt-8 grid max-w-xl gap-3 sm:grid-cols-2">
          <Link href="/login" className="primary-button">
            <LogIn className="mr-2" size={18} /> Log in
          </Link>
          <Link href="/signup" className="secondary-button">
            <UserPlus className="mr-2" size={18} /> Create account
          </Link>
        </div>

        <Link href="/dashboard" className="mt-8 inline-flex items-center text-sm font-black text-blue-700 hover:text-blue-800">
          Already signed in? Open dashboard <ArrowRight className="ml-1" size={16} />
        </Link>
      </section>
    </main>
  );
}
