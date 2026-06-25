import { FileText, Save, Share2, Upload } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { RankBadge } from "@/components/RankBadge";
import { XpProgressBar } from "@/components/XpProgressBar";
import { getCurrentProfile } from "@/lib/data";
import { saveResumeProfile, updateProfile } from "@/lib/profile/actions";
import { schoolOptions } from "@/lib/schools";

export const runtime = "nodejs";

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
                <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-lg bg-purple-700 text-2xl font-black">
                  {profile.schoolLogoUrl ? <img src={profile.schoolLogoUrl} alt="" className="h-full w-full bg-white object-contain p-2" /> : profile.name.charAt(0)}
                </div>
                <div>
                  <h1 className="text-3xl font-black">{profile.name}</h1>
                  <p className="text-slate-300">{[profile.school, profile.major, profile.graduationYear].filter(Boolean).join(" · ") || "Complete your profile"}</p>
                </div>
              </div>
              <Link href="/friends" className="inline-flex min-h-11 items-center justify-center rounded-lg border border-white/20 px-5 font-bold hover:border-purple-300">
                <Share2 className="mr-2" size={18} /> Share profile
              </Link>
            </div>
          </div>
          <div className="grid gap-6 p-6 lg:grid-cols-[1fr_360px]">
            <div>
              <h2 className="text-xl font-black text-ink">Profile setup</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">These preferences will power personalized internship recommendations later.</p>
              {searchParams?.message && <p className="mt-4 rounded-lg bg-purple-50 p-3 text-sm font-bold text-purple-900">{searchParams.message}</p>}
              <form action={updateProfile} className="mt-5 grid gap-5">
                <label className="grid gap-2 text-sm font-bold text-slate-700">
                  Name
                  <input name="fullName" defaultValue={profile.name} className="rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-purple-600" required />
                </label>
                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="grid gap-2 text-sm font-bold text-slate-700">
                    School
                    <input
                      name="school"
                      defaultValue={profile.school}
                      list="school-options"
                      autoComplete="organization"
                      className="rounded-lg border border-slate-200 bg-white px-4 py-3 outline-none focus:border-purple-600"
                      placeholder="Choose or type your school"
                    />
                    <datalist id="school-options">
                      {schoolOptions.map((school) => (
                        <option key={school.name} value={school.name}>
                          {school.name}
                        </option>
                      ))}
                      <option value="Other / type your school">Other / type your school</option>
                    </datalist>
                    <span className="text-xs font-bold text-slate-500">Pick a listed school for an automatic logo, or type your school name in this same box.</span>
                  </label>
                  <label className="grid gap-2 text-sm font-bold text-slate-700">
                    Major
                    <input name="major" defaultValue={profile.major} className="rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-purple-600" placeholder="Computer Science" />
                  </label>
                </div>
                <label className="grid gap-2 text-sm font-bold text-slate-700">
                  Graduation year
                  <input name="graduationYear" defaultValue={profile.graduationYear} className="rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-purple-600" placeholder="2027" inputMode="numeric" />
                </label>
                <label className="grid gap-2 text-sm font-bold text-slate-700">
                  Target roles
                  <input name="targetRoles" defaultValue={profile.targetRoles.join(", ")} className="rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-purple-600" placeholder="Software Engineering, Data Science, Product" />
                </label>
                <label className="grid gap-2 text-sm font-bold text-slate-700">
                  Target locations
                  <input name="targetLocations" defaultValue={profile.targetLocations.join(", ")} className="rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-purple-600" placeholder="New York, Remote, Washington DC" />
                </label>
                <label className="flex gap-3 rounded-lg border border-purple-100 bg-purple-50/70 p-4 text-sm font-bold text-slate-700">
                  <input name="shareApplicationBoard" type="checkbox" defaultChecked={profile.shareApplicationBoard} className="mt-1 h-4 w-4 rounded border-slate-300 text-purple-700 focus:ring-purple-600" />
                  <span>
                    Let accepted friends view my application board.
                    <span className="mt-1 block text-xs font-semibold text-slate-500">Only accepted friends can see it, and they cannot edit your applications.</span>
                  </span>
                </label>
                <button type="submit" className="primary-button w-full sm:w-auto">
                  <Save className="mr-2" size={18} /> Save profile
                </button>
              </form>
            </div>
            <aside className="space-y-4">
              <div className="rounded-lg border border-slate-200 p-4">
                <p className="mb-2 text-sm font-bold text-slate-500">Current rank</p>
                <RankBadge xp={profile.xp} />
              </div>
              <XpProgressBar xp={profile.xp} />
              <div className="rounded-lg border border-slate-200 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-50 text-purple-800">
                    <FileText size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-500">Resume status</p>
                    <p className="mt-1 text-lg font-black text-ink">{profile.resumeFileName || "No resume saved"}</p>
                  </div>
                </div>
                {profile.resumeUpdatedAt && <p className="mt-1 text-sm font-bold text-slate-500">Updated {profile.resumeUpdatedAt}</p>}
                <form action={saveResumeProfile} className="mt-5 grid gap-4">
                  <label className="grid gap-2 text-sm font-bold text-slate-700">
                    Upload resume
                    <input name="resumeFile" type="file" accept=".txt,.md,.csv,.pdf,.docx" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-purple-600" />
                  </label>
                  <label className="grid gap-2 text-sm font-bold text-slate-700">
                    Paste text fallback
                    <textarea name="resumeText" rows={6} className="resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-purple-600" placeholder="Paste resume text if the upload cannot be read." />
                  </label>
                  <button type="submit" className="primary-button w-full">
                    <Upload className="mr-2" size={18} /> Save resume
                  </button>
                </form>
              </div>
            </aside>
          </div>
        </section>
      </main>
    </>
  );
}
