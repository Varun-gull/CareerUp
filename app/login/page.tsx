import Link from "next/link";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { getCurrentUser } from "@/lib/data";
import { logIn } from "@/lib/auth/actions";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export default async function LoginPage({ searchParams }: { searchParams?: { message?: string } }) {
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
          <p className="eyebrow">Log in</p>
          <h1 className="mt-2 text-3xl font-black text-ink">Continue your streak</h1>
          {!supabaseReady && (
            <p className="mt-4 rounded-2xl border border-sky/20 bg-sky/10 p-3 text-sm font-bold text-sky">Supabase env vars are not connected yet. This form is ready for the next setup step.</p>
          )}
          {searchParams?.message && <p className="mt-4 rounded-2xl border border-slate-200 bg-white/90 p-3 text-sm font-bold text-slate-700">{searchParams.message}</p>}
          <form action={logIn} className="mt-6 grid gap-4">
            <input name="email" className="field" placeholder="Email" type="email" required />
            <input name="password" className="field" placeholder="Password" type="password" required />
            <button type="submit" className="primary-button w-full">Log in</button>
          </form>
          <p className="mt-5 text-sm text-slate-600">
            New here?{" "}
            <Link href="/signup" className="font-bold text-sky">
              Create an account
            </Link>
          </p>
        </section>
      </main>
    </>
  );
}
