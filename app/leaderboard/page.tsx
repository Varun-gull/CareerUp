import Link from "next/link";
import { LeaderboardTable } from "@/components/LeaderboardTable";
import { Navbar } from "@/components/Navbar";
import { getCurrentUser, getFriendLeaderboard, getLeaderboard } from "@/lib/data";

export default async function LeaderboardPage({ searchParams }: { searchParams?: { scope?: string } }) {
  const scope = searchParams?.scope === "friends" ? "friends" : "global";
  const [leaderboard, user] = await Promise.all([scope === "friends" ? getFriendLeaderboard() : getLeaderboard(), getCurrentUser()]);

  return (
    <>
      <Navbar />
      <main className="page-shell">
        <div className="page-hero flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Friendly competition</p>
            <h1 className="mt-2 text-4xl font-black text-ink sm:text-5xl">Leaderboard</h1>
            <p className="mt-2 max-w-2xl text-slate-600">Compare XP with friends and stay accountable during recruiting season.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/leaderboard" className={scope === "global" ? "primary-button" : "secondary-button"}>
              All users
            </Link>
            <Link href="/leaderboard?scope=friends" className={scope === "friends" ? "primary-button" : "secondary-button"}>
              Friends
            </Link>
          </div>
        </div>
        <section className="mt-6">
          <LeaderboardTable users={leaderboard} currentUserId={user?.id} emptyMode={scope} />
        </section>
      </main>
    </>
  );
}
