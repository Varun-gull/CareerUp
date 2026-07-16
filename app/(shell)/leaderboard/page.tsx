import Link from "next/link";
import clsx from "clsx";
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
        <section className="relative overflow-hidden rounded-[2rem] border border-[#5E7681]/30 bg-[#F8FBFA] p-6 text-[#13112D] shadow-soft sm:p-8">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(145,182,175,0.42),transparent_34%),linear-gradient(135deg,rgba(225,239,235,0.95),rgba(248,251,250,0.95)_48%,rgba(255,255,255,0.98))]" />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-[#1B3C53]">Friendly competition</p>
              <h1 className="mt-2 text-4xl font-black tracking-tight text-[#13112D] sm:text-5xl">Leaderboard</h1>
              <p className="mt-3 max-w-2xl text-sm font-semibold leading-6 text-[#5E7681] sm:text-base">
                Compare XP with friends and stay accountable during recruiting season.
              </p>
            </div>
            <nav className="flex flex-wrap items-center gap-2 rounded-2xl border border-[#5E7681]/25 bg-white/80 p-1.5 shadow-sm">
              {[
                { label: "All users", href: "/leaderboard", active: scope === "global" },
                { label: "Friends", href: "/leaderboard?scope=friends", active: scope === "friends" },
                { label: "Groups", href: "/leaderboard?scope=groups", active: scope === "groups" }
              ].map((tab) => (
                <Link
                  key={tab.href}
                  href={tab.href}
                  aria-current={tab.active ? "page" : undefined}
                  className={clsx(
                    "rounded-xl px-4 py-2 text-sm font-black transition",
                    tab.active
                      ? "bg-[#1B3C53] text-white shadow-sm"
                      : "text-[#5E7681] hover:bg-[#E1EFEB] hover:text-[#1B3C53]"
                  )}
                >
                  {tab.label}
                </Link>
              ))}
            </nav>
          </div>
        </section>
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
