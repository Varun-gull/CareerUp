import Link from "next/link";
import { GroupLeaderboardTable } from "@/components/GroupLeaderboardTable";
import { LeaderboardTable } from "@/components/LeaderboardTable";
import { getCurrentUser, getFriendLeaderboard, getGroupLeaderboard, getLeaderboard } from "@/lib/data";

export default async function LeaderboardPage({ searchParams }: { searchParams?: { scope?: string } }) {
  const scope = searchParams?.scope === "friends" ? "friends" : searchParams?.scope === "groups" ? "groups" : "global";
  const [leaderboard, groupLeaderboard, user] = await Promise.all([
    scope === "friends" ? getFriendLeaderboard() : scope === "groups" ? Promise.resolve([]) : getLeaderboard(),
    scope === "groups" ? getGroupLeaderboard() : Promise.resolve([]),
    getCurrentUser()
  ]);

  return (
    <>
      <main className="page-shell">
        <div className="page-hero flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Friendly competition</p>
            <h1 className="mt-2 text-4xl font-bold text-ink sm:text-5xl">Leaderboard</h1>
            <p className="mt-2 max-w-2xl text-slate-600">Compare XP with friends and stay accountable during recruiting season.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/leaderboard" className={scope === "global" ? "primary-button" : "secondary-button"}>
              All users
            </Link>
            <Link href="/leaderboard?scope=friends" className={scope === "friends" ? "primary-button" : "secondary-button"}>
              Friends
            </Link>
            <Link href="/leaderboard?scope=groups" className={scope === "groups" ? "primary-button" : "secondary-button"}>
              Groups
            </Link>
          </div>
        </div>
        <section className="mt-6">
          {scope === "groups" ? (
            <GroupLeaderboardTable groups={groupLeaderboard} />
          ) : (
            <LeaderboardTable users={leaderboard} currentUserId={user?.id} emptyMode={scope} />
          )}
        </section>
      </main>
    </>
  );
}
