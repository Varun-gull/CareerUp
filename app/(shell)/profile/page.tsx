import { FileCheck2, FileText, Share2 } from "lucide-react";
import Link from "next/link";
import { ProfileAutosaveForm } from "@/components/ProfileAutosaveForm";
import { RankBadge } from "@/components/RankBadge";
import { ResumeUploadField } from "@/components/ResumeUploadField";
import { BadgeShelf } from "@/components/BadgeDisplay";
import { XpProgressBar } from "@/components/XpProgressBar";
import { getCurrentProfile } from "@/lib/data";
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
      <main className="page-shell">
        <section className="card overflow-hidden">
          <div className="border-b border-white/10 bg-[#13112D] px-6 py-10 text-white">
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-3xl border border-white/15 bg-white text-2xl font-bold text-[#231942] shadow-glow">
                  {profile.schoolLogoUrl ? <img src={profile.schoolLogoUrl} alt="" className="h-full w-full bg-white object-contain p-2" /> : profile.name.charAt(0)}
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9F86C0]">Student profile</p>
                  <h1 className="mt-1 text-4xl font-bold">{profile.name}</h1>
                  {profileDetails.length > 0 ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {profileDetails.map((detail) => (
                        <span key={detail} className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-sm font-bold text-white shadow-sm">
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
              <h2 className="text-xl font-bold text-ink">Profile setup</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">These preferences will power personalized internship recommendations later.</p>
              {searchParams?.message && <p className="mt-4 rounded-2xl bg-sky/10 p-3 text-sm font-bold text-sky-600">{searchParams.message}</p>}
              <ProfileAutosaveForm
                profile={profile}
                schools={schoolOptions}
                targetRoleOptions={targetRoleOptions}
                targetLocationOptions={targetLocationOptions}
              />
            </div>
            <aside className="space-y-4">
              <div className="rounded-3xl border border-slate-200 bg-white/85 p-4">
                <p className="mb-2 text-sm font-bold text-slate-500">Current rank</p>
                <RankBadge xp={profile.xp} />
              </div>
              <XpProgressBar xp={profile.xp} />
              <BadgeShelf applicationsApplied={profile.applicationsApplied} />
              <div className="rounded-3xl border border-slate-200 bg-white/85 p-4">
                <div className="rounded-2xl border border-[#7E739F]/30 bg-white p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-sky/10 text-brand">
                      {profile.resumeFileName ? <FileCheck2 size={21} /> : <FileText size={21} />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-500">Resume</p>
                      <p className="mt-1 truncate text-lg font-bold text-ink">{profile.resumeFileName || "No resume saved"}</p>
                      <p className="mt-1 text-xs font-bold text-slate-500">
                        {profile.resumeUpdatedAt ? `Updated ${profile.resumeUpdatedAt}` : "Upload or paste resume text to improve matching."}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-5">
                  <ResumeUploadField />
                </div>
              </div>
            </aside>
          </div>
        </section>
      </main>
    </>
  );
}
