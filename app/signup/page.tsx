import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { signUp } from "@/lib/auth/actions";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export default function SignupPage({ searchParams }: { searchParams?: { message?: string } }) {
  const supabaseReady = isSupabaseConfigured();

  return (
    <>
      <Navbar />
      <main className="page-shell grid min-h-[calc(100vh-72px)] place-items-center">
        <section className="card w-full max-w-md p-6">
          <p className="eyebrow">Create account</p>
          <h1 className="mt-2 text-3xl font-black text-ink">Start with 25 XP</h1>
          {!supabaseReady && (
            <p className="mt-4 rounded-lg bg-blue-50 p-3 text-sm font-bold text-blue-800">Supabase env vars are not connected yet. Account creation will be wired in the database step.</p>
          )}
          {searchParams?.message && <p className="mt-4 rounded-lg bg-slate-100 p-3 text-sm font-bold text-slate-700">{searchParams.message}</p>}
          <form action={signUp} className="mt-6 grid gap-4">
            <input name="fullName" className="rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-blue-500" placeholder="Name" required />
            <input name="email" className="rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-blue-500" placeholder="Email" type="email" required />
            <input name="password" className="rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-blue-500" placeholder="Password" type="password" minLength={6} required />
            <button type="submit" className="primary-button w-full">Create account</button>
          </form>
          <p className="mt-5 text-sm text-slate-600">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-blue-700">
              Log in
            </Link>
          </p>
        </section>
      </main>
    </>
  );
}
