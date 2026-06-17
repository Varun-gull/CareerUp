import { LeaderboardTable } from "@/components/LeaderboardTable";
import { Navbar } from "@/components/Navbar";
import { getLeaderboard } from "@/lib/data";

export default async function LeaderboardPage() {
  const leaderboard = await getLeaderboard();

  return (
    <>
      <Navbar />
      <main className="page-shell">
        <p className="eyebrow">Friendly competition</p>
        <h1 className="mt-2 text-4xl font-black text-ink">Leaderboard</h1>
        <p className="mt-2 max-w-2xl text-slate-600">Compare XP with friends and stay accountable during recruiting season.</p>
        <section className="mt-8">
          <LeaderboardTable users={leaderboard} />
        </section>
      </main>
    </>
  );
}
