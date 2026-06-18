import { ArrowRight, LockKeyhole, MessageSquareText, Save, Sparkles, Trash2 } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { deleteInterviewAnswer, saveInterviewAnswer } from "@/lib/interview/actions";
import { behavioralInterviewPrompts } from "@/lib/interview/prompts";
import { getInterviewAnswers, getRewards } from "@/lib/data";

export default async function InterviewPage({ searchParams }: { searchParams?: { message?: string } }) {
  const [rewards, answers] = await Promise.all([getRewards(), getInterviewAnswers()]);
  const isUnlocked = rewards.some((reward) => reward.id === "behavioral-interview-pack" && reward.unlocked);

  return (
    <>
      <Navbar />
      <main className="page-shell">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Prep tool</p>
            <h1 className="mt-2 text-4xl font-black text-ink">Interview Builder</h1>
            <p className="mt-2 max-w-2xl text-slate-600">Draft STAR answers for behavioral interviews and keep your best stories ready.</p>
          </div>
          <Link href="/rewards" className="secondary-button">
            <Sparkles className="mr-2" size={18} /> Rewards
          </Link>
        </div>

        {searchParams?.message && <p className="mt-5 rounded-lg bg-blue-50 p-3 text-sm font-bold text-blue-800">{searchParams.message}</p>}

        {!isUnlocked ? (
          <section className="card mt-8 p-6">
            <div className="flex max-w-3xl flex-col gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                <LockKeyhole size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-ink">Unlock the Behavioral Interview Pack first</h2>
                <p className="mt-2 text-slate-600">Spend XP on the rewards page to open this builder and start saving interview stories.</p>
              </div>
              <Link href="/rewards" className="primary-button w-fit">
                Go unlock it <ArrowRight className="ml-2" size={18} />
              </Link>
            </div>
          </section>
        ) : (
          <>
            <section className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)]">
              <form action={saveInterviewAnswer} className="card p-5">
                <div className="mb-5 flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                    <MessageSquareText size={22} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-ink">Build a STAR answer</h2>
                    <p className="mt-1 text-sm leading-6 text-slate-600">Keep each section tight enough to speak naturally in 60 to 90 seconds.</p>
                  </div>
                </div>

                <label className="grid gap-2 text-sm font-bold text-slate-700">
                  Prompt
                  <select name="prompt" className="rounded-lg border border-slate-200 bg-white px-4 py-3 outline-none focus:border-blue-500">
                    {behavioralInterviewPrompts.map((prompt) => (
                      <option key={prompt} value={prompt}>
                        {prompt}
                      </option>
                    ))}
                  </select>
                </label>

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <StarTextarea name="situation" label="Situation" placeholder="Set the context. What was happening?" />
                  <StarTextarea name="task" label="Task" placeholder="What were you responsible for?" />
                  <StarTextarea name="actionTaken" label="Action" placeholder="What specific steps did you take?" />
                  <StarTextarea name="resultOutcome" label="Result" placeholder="What changed? Add metrics if you can." />
                </div>

                <label className="mt-4 grid gap-2 text-sm font-bold text-slate-700">
                  Notes
                  <textarea name="notes" rows={3} className="resize-none rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-blue-500" placeholder="Keywords, company tie-in, or follow-up examples." />
                </label>

                <button type="submit" className="primary-button mt-5 w-full">
                  <Save className="mr-2" size={18} /> Save answer
                </button>
              </form>

              <aside className="card p-5">
                <p className="text-sm font-black text-blue-600">Answer formula</p>
                <h2 className="mt-1 text-xl font-black text-ink">What a strong answer needs</h2>
                <div className="mt-4 grid gap-3">
                  {[
                    ["Situation", "One or two sentences that make the story easy to understand."],
                    ["Task", "The goal, constraint, or responsibility you personally owned."],
                    ["Action", "The concrete choices you made. This should be the longest section."],
                    ["Result", "Outcome, metric, lesson, or what you would repeat next time."]
                  ].map(([title, body]) => (
                    <div key={title} className="rounded-lg border border-slate-100 bg-slate-50 p-3">
                      <p className="font-black text-ink">{title}</p>
                      <p className="mt-1 text-sm leading-6 text-slate-600">{body}</p>
                    </div>
                  ))}
                </div>
              </aside>
            </section>

            <section className="mt-8">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="eyebrow">Saved stories</p>
                  <h2 className="mt-2 text-2xl font-black text-ink">Answer bank</h2>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-black text-slate-700">{answers.length} saved</span>
              </div>

              {answers.length > 0 ? (
                <div className="mt-4 grid gap-4">
                  {answers.map((answer) => (
                    <article key={answer.id} className="card p-5">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-black text-blue-600">{answer.createdAt}</p>
                          <h3 className="mt-1 text-xl font-black text-ink">{answer.prompt}</h3>
                        </div>
                        <form action={deleteInterviewAnswer}>
                          <input type="hidden" name="answerId" value={answer.id} />
                          <button className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:border-red-200 hover:text-red-600" aria-label="Delete interview answer">
                            <Trash2 size={18} />
                          </button>
                        </form>
                      </div>
                      <div className="mt-4 grid gap-3 md:grid-cols-2">
                        <AnswerSection title="Situation" body={answer.situation} />
                        <AnswerSection title="Task" body={answer.task} />
                        <AnswerSection title="Action" body={answer.action} />
                        <AnswerSection title="Result" body={answer.result} />
                      </div>
                      {answer.notes && <p className="mt-4 rounded-lg bg-blue-50 p-3 text-sm leading-6 text-slate-700">{answer.notes}</p>}
                    </article>
                  ))}
                </div>
              ) : (
                <div className="card mt-4 flex flex-col items-center px-6 py-10 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-slate-100 text-blue-700">
                    <MessageSquareText size={28} />
                  </div>
                  <h3 className="mt-5 text-2xl font-black text-ink">No answers saved yet</h3>
                  <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">Use the builder to create your first interview story.</p>
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </>
  );
}

function StarTextarea({ name, label, placeholder }: { name: string; label: string; placeholder: string }) {
  return (
    <label className="grid gap-2 text-sm font-bold text-slate-700">
      {label}
      <textarea name={name} rows={5} className="resize-none rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-blue-500" placeholder={placeholder} />
    </label>
  );
}

function AnswerSection({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
      <p className="text-sm font-black text-slate-500">{title}</p>
      <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-slate-700">{body}</p>
    </div>
  );
}
