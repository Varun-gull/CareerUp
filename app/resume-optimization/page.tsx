import { ArrowLeft, ExternalLink, FileText, Sparkles } from "lucide-react";
import Link from "next/link";
import { CopyTextButton } from "@/components/CopyTextButton";
import { Navbar } from "@/components/Navbar";
import { getCurrentResumeForOptimization } from "@/lib/data";
import { buildResumeOptimization } from "@/lib/resume";

export const runtime = "nodejs";

function parseTags(value?: string) {
  return String(value ?? "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean)
    .slice(0, 12);
}

export default async function ResumeOptimizationPage({
  searchParams,
}: {
  searchParams?: {
    company?: string;
    role?: string;
    description?: string;
    tags?: string;
    url?: string;
  };
}) {
  const resume = await getCurrentResumeForOptimization();
  const company = String(searchParams?.company ?? "Company").trim();
  const role = String(searchParams?.role ?? "Internship role").trim();
  const description = String(searchParams?.description ?? "").trim();
  const tags = parseTags(searchParams?.tags);
  const optimizedResume = resume.resumeText
    ? buildResumeOptimization({
        resumeText: resume.resumeText,
        resumeKeywords: resume.resumeKeywords,
        company,
        role,
        jobDescription: description,
        jobTags: tags,
      })
    : "";

  return (
    <>
      <Navbar />
      <main className="page-shell">
        <Link href="/postings" className="inline-flex items-center text-sm font-black text-purple-800 hover:text-purple-950">
          <ArrowLeft className="mr-2" size={16} /> Back to postings
        </Link>

        <section className="mt-5 grid gap-5 lg:grid-cols-[1fr_360px]">
          <div className="card p-6">
            <p className="eyebrow">Resume optimization</p>
            <h1 className="mt-2 text-3xl font-black text-ink">Tailored resume suggestion</h1>
            <p className="mt-2 text-slate-600">
              This creates a suggested application version using your saved resume and the posting keywords. It does not change your saved resume.
            </p>

            {!resume.resumeText ? (
              <div className="mt-6 rounded-lg border border-purple-100 bg-purple-50 p-5">
                <h2 className="font-black text-purple-950">Upload your resume first</h2>
                <p className="mt-2 text-sm leading-6 text-purple-900">CareerUp needs a saved resume before it can suggest an optimized version for a job posting.</p>
                <Link href="/profile" className="primary-button mt-4 w-fit">
                  <FileText className="mr-2" size={18} /> Go to profile
                </Link>
              </div>
            ) : (
              <>
                <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold text-slate-500">Generated from</p>
                    <p className="font-black text-ink">{resume.resumeFileName || "Saved resume"}</p>
                  </div>
                  <CopyTextButton text={optimizedResume} />
                </div>
                <textarea
                  readOnly
                  value={optimizedResume}
                  className="mt-5 min-h-[680px] w-full resize-y rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 font-mono text-sm leading-6 text-slate-800 outline-none"
                />
              </>
            )}
          </div>

          <aside className="space-y-4">
            <div className="card p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-purple-50 text-purple-800">
                  <Sparkles size={22} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-500">Posting</p>
                  <h2 className="text-lg font-black text-ink">{role}</h2>
                </div>
              </div>
              <p className="mt-4 text-sm font-black text-purple-800">{company}</p>
              {tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              {searchParams?.url && (
                <a href={searchParams.url} target="_blank" rel="noreferrer" className="secondary-button mt-5 w-full">
                  <ExternalLink className="mr-2" size={18} /> Open posting
                </a>
              )}
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <h2 className="font-black text-ink">How to use it</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Copy the suggested summary, skills line, and bullet upgrades into a separate resume file for this application. Keep only the parts that are true to your experience.
              </p>
            </div>
          </aside>
        </section>
      </main>
    </>
  );
}
