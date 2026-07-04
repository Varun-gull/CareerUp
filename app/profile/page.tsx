import { FileCheck2, FileText, Save, Share2, UploadCloud } from "lucide-react";
import Link from "next/link";
import { MultiSelectField } from "@/components/MultiSelectField";
import { Navbar } from "@/components/Navbar";
import { RankBadge } from "@/components/RankBadge";
import { ResumeUploadField } from "@/components/ResumeUploadField";
import { BadgeShelf } from "@/components/BadgeDisplay";
import { SchoolField } from "@/components/SchoolField";
import { XpProgressBar } from "@/components/XpProgressBar";
import { getCurrentProfile } from "@/lib/data";
import { saveResumeProfile, updateProfile } from "@/lib/profile/actions";
import { schoolOptions } from "@/lib/schools";

export const runtime = "nodejs";

const targetRoleOptions = [
  "Software Engineering Intern",
  "Data Science Intern",
  "AI / ML Intern",
  "Product Management Intern",
  "Business Analyst Intern",
  "Cybersecurity Intern",
  "Quant Intern",
  "UX Design Intern",
  "Software Engineer New Grad",
  "Data Analyst New Grad",
  "Associate Product Manager",
  "Business Analyst New Grad"
].map((value) => ({ label: value, value }));

const targetLocationOptions = [
  "Remote",
  "Hybrid",
  "New York, NY",
  "San Francisco, CA",
  "Seattle, WA",
  "Austin, TX",
  "Boston, MA",
  "Chicago, IL",
  "Washington, DC",
  "Atlanta, GA",
  "Los Angeles, CA",
  "Dallas, TX"
].map((value) => ({ label: value, value }));

export default async function ProfilePage({ searchParams }: { searchParams?: { message?: string } }) {
  const profile = await getCurrentProfile();
  const profileDetails = [
    profile.school && profile.school !== "CareerUp Student" ? profile.school : "",
    profile.major,
    profile.graduationYear ? `Class of ${profile.graduationYear}` : ""
  ].filter(Boolean);

  return (
    <>
      <Navbar />
      <main className="page-shell">
        <section className="card overflow-hidden">
          <div className="border-b border-white/10 bg-gradient-to-r from-navy via-slate-950 to-slate-900 px-6 py-10 text-white">
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-3xl border border-white/15 bg-white text-2xl font-black text-navy shadow-glow">
                  {profile.schoolLogoUrl ? <img src={profile.schoolLogoUrl} alt="" className="h-full w-full bg-white object-contain p-2" /> : profile.name.charAt(0)}
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-sky">Student profile</p>
                  <h1 className="mt-1 text-4xl font-black">{profile.name}</h1>
                  {profileDetails.length > 0 ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {profileDetails.map((detail) => (
                        <span key={detail} className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-sm font-black text-white shadow-sm">
                          {detail}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-2 text-sm font-bold text-slate-300">Add your school, major, and graduation year.</p>
                  )}
                </div>
              </div>
              <Link href="/friends" className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-white/20 px-5 font-bold transition hover:-translate-y-0.5 hover:border-sky/40 hover:bg-white/10">
                <Share2 className="mr-2" size={18} /> Share profile
              </Link>
            </div>
          </div>
          <div className="grid gap-6 p-6 lg:grid-cols-[1fr_360px]">
            <div>
              <h2 className="text-xl font-black text-ink">Profile setup</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">These preferences will power personalized internship recommendations later.</p>
              {searchParams?.message && <p className="mt-4 rounded-2xl bg-sky/10 p-3 text-sm font-bold text-sky">{searchParams.message}</p>}
              <form action={updateProfile} className="mt-5 grid gap-5">
                <label className="grid gap-2 text-sm font-bold text-slate-700">
                  Name
                  <input name="fullName" defaultValue={profile.name} className="field" required />
                </label>
                <div className="grid gap-5 sm:grid-cols-2">
                  <SchoolField schools={schoolOptions} initialSchool={profile.school} />
                  <label className="grid gap-2 text-sm font-bold text-slate-700">
                    Major
                    <input name="major" defaultValue={profile.major} className="field" placeholder="Computer Science" />
                  </label>
                </div>
                <label className="grid gap-2 text-sm font-bold text-slate-700">
                  Graduation year
                  <input name="graduationYear" defaultValue={profile.graduationYear} className="field" placeholder="2027" inputMode="numeric" />
                </label>
                <MultiSelectField
                  label="Target roles"
                  name="targetRoles"
                  options={targetRoleOptions}
                  initialValues={profile.targetRoles}
                  placeholder="Choose target roles"
                />
                <MultiSelectField
                  label="Target locations"
                  name="targetLocations"
                  options={targetLocationOptions}
                  initialValues={profile.targetLocations}
                  placeholder="Choose target locations"
                />
                <label className="flex gap-3 rounded-2xl border border-sky/20 bg-sky/10 p-4 text-sm font-bold text-slate-700">
                  <input name="shareApplicationBoard" type="checkbox" defaultChecked={profile.shareApplicationBoard} className="mt-1 h-4 w-4 rounded border-slate-300 text-brand focus:ring-brand" />
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
              <div className="rounded-3xl border border-slate-200 bg-white/85 p-4">
                <p className="mb-2 text-sm font-bold text-slate-500">Current rank</p>
                <RankBadge xp={profile.xp} />
              </div>
              <XpProgressBar xp={profile.xp} />
              <BadgeShelf applicationsApplied={profile.applicationsApplied} />
              <div className="rounded-3xl border border-slate-200 bg-white/85 p-4">
                <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-sky/10 text-brand">
                      {profile.resumeFileName ? <FileCheck2 size={21} /> : <FileText size={21} />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-500">Resume</p>
                      <p className="mt-1 truncate text-lg font-black text-ink">{profile.resumeFileName || "No resume saved"}</p>
                      <p className="mt-1 text-xs font-bold text-slate-500">
                        {profile.resumeUpdatedAt ? `Updated ${profile.resumeUpdatedAt}` : "Upload or paste resume text to improve matching."}
                      </p>
                    </div>
                  </div>
                </div>
                <form action={saveResumeProfile} className="mt-5 grid gap-4">
                  <ResumeUploadField />
                  <label className="grid gap-2 text-sm font-bold text-slate-700">
                    Paste resume text
                    <textarea name="resumeText" rows={5} className="field resize-none text-sm" placeholder="Optional fallback if the file cannot be read." />
                  </label>
                  <button type="submit" className="primary-button w-full">
                    <UploadCloud className="mr-2" size={18} /> Save resume
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
