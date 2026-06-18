import { Gift, LockKeyhole, Sparkles, Trophy, UnlockKeyhole } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { RankBadge } from "@/components/RankBadge";
import { unlockReward } from "@/lib/rewards/actions";
import { getCurrentProfile, getRewards } from "@/lib/data";

export default async function RewardsPage({ searchParams }: { searchParams?: { message?: string } }) {
  const [profile, rewards] = await Promise.all([getCurrentProfile(), getRewards()]);
  const unlockedCount = rewards.filter((reward) => reward.unlocked).length;

  return (
    <>
      <Navbar />
      <main className="page-shell">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Unlocks</p>
            <h1 className="mt-2 text-4xl font-black text-ink">Rewards</h1>
            <p className="mt-2 max-w-2xl text-slate-600">Turn XP into interview prep tools you can use when recruiting gets serious.</p>
          </div>
        </div>

        {searchParams?.message && <p className="mt-5 rounded-lg bg-blue-50 p-3 text-sm font-bold text-blue-800">{searchParams.message}</p>}

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="card p-5">
            <Sparkles size={22} className="text-blue-600" />
            <p className="mt-4 text-sm font-bold text-slate-500">Available XP</p>
            <p className="mt-1 text-3xl font-black text-ink">{profile.xp.toLocaleString()}</p>
          </div>
          <div className="card p-5">
            <Gift size={22} className="text-blue-600" />
            <p className="mt-4 text-sm font-bold text-slate-500">Unlocked</p>
            <p className="mt-1 text-3xl font-black text-ink">
              {unlockedCount}/{rewards.length}
            </p>
          </div>
          <div className="card p-5">
            <Trophy size={22} className="text-blue-600" />
            <p className="mt-4 text-sm font-bold text-slate-500">Current rank</p>
            <div className="mt-2">
              <RankBadge xp={profile.xp} />
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-4 lg:grid-cols-2">
          {rewards.map((reward) => {
            const canUnlock = profile.xp >= reward.xpCost;

            return (
              <article key={reward.id} className="card p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-black text-blue-600">{reward.category}</p>
                    <h2 className="mt-1 text-xl font-black text-ink">{reward.title}</h2>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{reward.description}</p>
                  </div>
                  <span className={reward.unlocked ? "rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700" : "rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-700"}>
                    {reward.unlocked ? "Unlocked" : `${reward.xpCost} XP`}
                  </span>
                </div>

                {reward.unlocked ? (
                  <div className="mt-5 rounded-lg border border-emerald-100 bg-emerald-50/60 p-4">
                    <div className="mb-3 flex items-center gap-2 font-black text-emerald-800">
                      <UnlockKeyhole size={18} /> Prep tool
                    </div>
                    <ul className="grid gap-2 text-sm leading-6 text-slate-700">
                      {reward.contents.map((item) => (
                        <li key={item} className="rounded-lg bg-white/80 px-3 py-2">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                    <p className="inline-flex items-center gap-2 text-sm font-bold text-slate-600">
                      <LockKeyhole size={16} /> {canUnlock ? "Ready to unlock" : `${Math.max(0, reward.xpCost - profile.xp).toLocaleString()} XP needed`}
                    </p>
                    <form action={unlockReward}>
                      <input type="hidden" name="rewardId" value={reward.id} />
                      <button className="primary-button disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none" disabled={!canUnlock}>
                        <UnlockKeyhole className="mr-2" size={18} /> Unlock
                      </button>
                    </form>
                  </div>
                )}
              </article>
            );
          })}
        </section>
      </main>
    </>
  );
}
