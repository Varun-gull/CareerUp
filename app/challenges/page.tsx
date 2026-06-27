import { ChallengeCard } from "@/components/ChallengeCard";
import { Navbar } from "@/components/Navbar";
import { getChallenges } from "@/lib/data";

export default async function ChallengesPage() {
  const challenges = await getChallenges();
  const sortedChallenges = [...challenges].sort((a, b) => Number(a.completed) - Number(b.completed));

  return (
    <>
      <Navbar />
      <main className="page-shell">
        <div className="page-hero">
          <p className="eyebrow">XP quests</p>
          <h1 className="mt-2 text-4xl font-black text-ink">Challenges</h1>
          <p className="mt-2 max-w-2xl text-slate-600">Small missions turn the internship search into daily progress instead of a giant vague task.</p>
        </div>
        <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {sortedChallenges.map((challenge) => (
            <ChallengeCard key={challenge.id} challenge={challenge} />
          ))}
        </section>
      </main>
    </>
  );
}
