import { ChallengeCard } from "@/components/ChallengeCard";
import { Navbar } from "@/components/Navbar";
import { getChallenges } from "@/lib/data";

export default async function ChallengesPage() {
  const { tiered, oneOff } = await getChallenges();

  return (
    <>
      <Navbar />
      <main className="page-shell">
        <div className="page-hero">
          <p className="eyebrow">XP quests</p>
          <h1 className="mt-2 text-4xl font-black text-ink">Challenges</h1>
          <p className="mt-2 max-w-2xl text-slate-600">Small missions turn the internship search into daily progress instead of a giant vague task.</p>
        </div>

        <section className="mt-10">
          <div className="mb-4">
            <h2 className="text-xl font-black text-ink">Core Challenges</h2>
            <p className="mt-1 text-sm text-slate-500">Each challenge has tiers — complete the current tier to unlock the next.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {tiered.map((challenge) => (
              <ChallengeCard key={challenge.id} challenge={challenge} />
            ))}
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-4">
            <h2 className="text-xl font-black text-ink">One-time Challenges</h2>
            <p className="mt-1 text-sm text-slate-500">Complete each once to earn the XP.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {[...oneOff].sort((a, b) => Number(a.completed) - Number(b.completed)).map((challenge) => (
              <ChallengeCard key={challenge.id} challenge={challenge} />
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
