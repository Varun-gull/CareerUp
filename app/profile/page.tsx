import { FileText, Save, Share2, Upload } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { RankBadge } from "@/components/RankBadge";
import { XpProgressBar } from "@/components/XpProgressBar";
import { getCurrentProfile } from "@/lib/data";
import { saveResumeProfile, updateProfile } from "@/lib/profile/actions";

export default async function ProfilePage({ searchParams }: { searchParams?: { message?: string } }) {
  const profile = await getCurrentProfile();

  return (
    <>
      <Navbar />
      <main className="page-shell">
        <section className="card overflow-hidden">
          <div className="bg-ink px-6 py-10 text-white">
            <div className="flex flex-wrap items-center justify-between gap-5">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-blue-600 text-2xl font-black">
                  {profile.name.charAt(0)}
                </div>
                <div>
                  <h1 className="text-3xl font-black">{profile.name}</h1>
                  <p className="text-slate-300">{[profile.school, profile.major, profile.graduationYear].filter(Boolean).join(" · ") || "Complete your profile"}</p>
                </div>
              </div>
              <Link href="/friends" className="inline-flex min-h-11 items-center justify-center rounded-lg border border-white/20 px-5 font-bold hover:border-blue-300">
                <Share2 className="mr-2" size={18} /> Share profile
              </Link>
            </div>
          </div>
          <div className="grid gap-6 p-6 lg:grid-cols-[1fr_360px]">
            <div>
              <h2 className="text-xl font-black text-ink">Profile setup</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">These preferences will power personalized internship recommendations later.</p>
              {searchParams?.message && <p className="mt-4 rounded-lg bg-blue-50 p-3 text-sm font-bold text-blue-800">{searchParams.message}</p>}
              <form action={updateProfile} className="mt-5 grid gap-5">
                <label className="grid gap-2 text-sm font-bold text-slate-700">
                  Name
                  <input name="fullName" defaultValue={profile.name} className="rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-blue-500" required />
                </label>
                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="grid gap-2 text-sm font-bold text-slate-700">
                    School
                    <input name="school" defaultValue={profile.school} className="rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-blue-500" placeholder="Rutgers University" />
                  </label>
                  <label className="grid gap-2 text-sm font-bold text-slate-700">
                    Major
                    <input name="major" defaultValue={profile.major} className="rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-blue-500" placeholder="Computer Science" />
                  </label>
                </div>
                <label className="grid gap-2 text-sm font-bold text-slate-700">
                  Graduation year
                  <input name="graduationYear" defaultValue={profile.graduationYear} className="rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-blue-500" placeholder="2027" inputMode="numeric" />
                </label>
                <label className="grid gap-2 text-sm font-bold text-slate-700">
                  Target roles
                  <input name="targetRoles" defaultValue={profile.targetRoles.join(", ")} className="rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-blue-500" placeholder="Software Engineering, Data Science, Product" />
                </label>
                <label className="grid gap-2 text-sm font-bold text-slate-700">
                  Target locations
                  <input name="targetLocations" defaultValue={profile.targetLocations.join(", ")} className="rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-blue-500" placeholder="New York, Remote, Washington DC" />
                </label>
                <button type="submit" className="primary-button w-full sm:w-auto">
                  <Save className="mr-2" size={18} /> Save profile
                </button>
              </form>

              <div className="mt-8 border-t border-slate-100 pt-6">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                    <FileText size={22} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-ink">Resume matching</h2>
                    <p className="mt-2 text-sm leading-6 text-slate-600">Upload a resume or paste resume text so postings can match against your skills.</p>
                  </div>
                </div>
                <form action={saveResumeProfile} className="mt-5 grid gap-5">
                  <label className="grid gap-2 text-sm font-bold text-slate-700">
                    Resume file
                    <input name="resumeFile" type="file" accept=".txt,.md,.csv,.pdf,.doc,.docx" className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500" />
                  </label>
                  <label className="grid gap-2 text-sm font-bold text-slate-700">
                    Resume text
                    <textarea name="resumeText" rows={8} className="resize-none rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-blue-500" placeholder="Paste resume text here for best matching." />
                  </label>
                  <button type="submit" className="primary-button w-full sm:w-auto">
                    <Upload className="mr-2" size={18} /> Save resume
                  </button>
                </form>
              </div>
            </div>
            <aside className="space-y-4">
              <div className="rounded-lg border border-slate-200 p-4">
                <p className="mb-2 text-sm font-bold text-slate-500">Current rank</p>
                <RankBadge xp={profile.xp} />
              </div>
              <XpProgressBar xp={profile.xp} />
              <div className="rounded-lg border border-slate-200 p-4">
                <p className="text-sm font-bold text-slate-500">Resume status</p>
                <p className="mt-2 text-lg font-black text-ink">{profile.resumeFileName || "No resume saved"}</p>
                {profile.resumeUpdatedAt && <p className="mt-1 text-sm font-bold text-slate-500">Updated {profile.resumeUpdatedAt}</p>}
                {profile.resumeKeywords.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {profile.resumeKeywords.slice(0, 10).map((keyword) => (
                      <span key={keyword} className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-700">
                        {keyword}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </aside>
          </div>
        </section>
      </main>
    </>
  );
}
