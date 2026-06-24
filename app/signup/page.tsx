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
      <main className="page-shell grid min-h-[calc(100vh-72px)] place-items-center">
        <section className="card w-full max-w-md p-6">
          <p className="eyebrow">Create account</p>
          <h1 className="mt-2 text-3xl font-black text-ink">Start with 25 XP</h1>
          {!supabaseReady && (
            <p className="mt-4 rounded-lg bg-purple-50 p-3 text-sm font-bold text-purple-900">Supabase env vars are not connected yet. Account creation will be wired in the database step.</p>
          )}
          {searchParams?.message && <p className="mt-4 rounded-lg bg-slate-100 p-3 text-sm font-bold text-slate-700">{searchParams.message}</p>}
          <form action={signUp} className="mt-6 grid gap-4">
            <input name="fullName" className="rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-purple-600" placeholder="Name" required />
            <input name="email" className="rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-purple-600" placeholder="Email" type="email" required />
            <input name="password" className="rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-purple-600" placeholder="Password" type="password" minLength={6} required />
            <button type="submit" className="primary-button w-full">Create account</button>
          </form>
          <p className="mt-5 text-sm text-slate-600">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-purple-800">
              Log in
            </Link>
          </p>
        </section>
      </main>
    </>
  );
}
