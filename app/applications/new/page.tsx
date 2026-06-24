import { Save } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { createApplication } from "@/lib/applications/actions";

export default function NewApplicationPage({ searchParams }: { searchParams?: { message?: string } }) {
  return (
    <>
      <Navbar />
      <main className="page-shell max-w-3xl">
        <p className="eyebrow">Add internship</p>
        <h1 className="mt-2 text-4xl font-black text-ink">Track a new role</h1>
        {searchParams?.message && <p className="mt-4 rounded-lg bg-slate-100 p-3 text-sm font-bold text-slate-700">{searchParams.message}</p>}
        <form action={createApplication} className="card mt-8 grid gap-5 p-6">
          <label className="grid gap-2 text-sm font-bold text-slate-700">
            Company
            <input name="company" className="rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-purple-600" placeholder="BlueGrid AI" required />
          </label>
          <label className="grid gap-2 text-sm font-bold text-slate-700">
            Role
            <input name="role" className="rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-purple-600" placeholder="Software Engineering Intern" required />
          </label>
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-bold text-slate-700">
              Location
              <input name="location" className="rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-purple-600" placeholder="Remote" />
            </label>
            <label className="grid gap-2 text-sm font-bold text-slate-700">
              Deadline
              <input name="deadline" type="date" className="rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-purple-600" />
            </label>
          </div>
          <label className="grid gap-2 text-sm font-bold text-slate-700">
            Source link
            <input name="sourceUrl" className="rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-purple-600" placeholder="https://..." />
          </label>
          <button type="submit" className="primary-button w-full sm:w-auto">
            <Save className="mr-2" size={18} /> Save and earn 5 XP
          </button>
        </form>
      </main>
    </>
  );
}
