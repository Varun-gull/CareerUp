import Link from "next/link";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { getCurrentUser } from "@/lib/data";
import { signUp } from "@/lib/auth/actions";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export default async function SignupPage({ searchParams }: { searchParams?: { message?: string } }) {
  const user = await getCurrentUser();

  if (user) {
    redirect("/dashboard");
  }

  const supabaseReady = isSupabaseConfigured();

  return (
    <>
      <Navbar />
      <main className="page-shell grid min-h-[calc(100vh-92px)] place-items-center">
        <section className="card w-full max-w-md p-8">
          <p className="eyebrow">Create account</p>
          <h1 className="mt-2 text-3xl font-bold text-ink">Start with 25 XP</h1>
          {!supabaseReady && (
            <p className="mt-4 rounded-2xl border border-sky/20 bg-sky/10 p-3 text-sm font-bold text-sky-600">Supabase env vars are not connected yet. Account creation will be wired in the database step.</p>
          )}
          {searchParams?.message && <p className="mt-4 rounded-2xl border border-slate-200 bg-white/90 p-3 text-sm font-bold text-slate-700">{searchParams.message}</p>}
          <form action={signUp} className="mt-6 grid gap-4">
            <input name="fullName" className="field" placeholder="Name" required />
            <input name="email" className="field" placeholder="Email" type="email" required />
            <input name="password" className="field" placeholder="Password" type="password" minLength={6} required />
            <label className="flex gap-3 rounded-2xl border border-slate-200 bg-white/90 p-3 text-sm font-bold text-slate-700">
              <input name="shareApplicationBoard" type="checkbox" className="mt-1 h-4 w-4 rounded border-slate-600 text-sky-600 focus:ring-sky" />
              <span>
                Let accepted friends view my application board.
                <span className="mt-1 block text-xs font-semibold text-slate-500">You can change this later from your profile.</span>
              </span>
            </label>
            <button type="submit" className="primary-button w-full">Create account</button>
          </form>
          <p className="mt-5 text-sm text-slate-600">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-sky-600">
              Log in
            </Link>
          </p>
        </section>
      </main>
    </>
  );
}
