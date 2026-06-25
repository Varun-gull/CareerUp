import { ArrowLeft, Flame, Lock, MapPin, Sparkles, Target, Trophy, UserPlus, UsersRound } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { PublicApplicationBoard } from "@/components/PublicApplicationBoard";
import { RankBadge } from "@/components/RankBadge";
import { XpProgressBar } from "@/components/XpProgressBar";
import { sendFriendRequestById } from "@/lib/friends/actions";
import { getCurrentUser, getFriendshipWith, getMutualFriends, getPublicProfile, getSharedApplicationBoard } from "@/lib/data";

export default async function PublicProfilePage({
  params,
  searchParams
}: {
  params: { profileId: string };
  searchParams?: { message?: string };
}) {
  const [profile, user, friendship, sharedBoard, mutualFriends] = await Promise.all([
    getPublicProfile(params.profileId),
    getCurrentUser(),
    getFriendshipWith(params.profileId),
    getSharedApplicationBoard(params.profileId),
    getMutualFriends(params.profileId)
  ]);
  const isOwnProfile = user?.id === params.profileId;
  const isAcceptedFriend = friendship?.status === "accepted";

  return (
    <>
      <Navbar />
      <main className="page-shell">
        <Link href="/friends" className="inline-flex items-center text-sm font-bold text-slate-600 hover:text-purple-800">
          <ArrowLeft className="mr-2" size={16} /> Friends
        </Link>

        {searchParams?.message && <p className="mt-5 rounded-lg bg-purple-50 p-3 text-sm font-bold text-purple-900">{searchParams.message}</p>}

        {!profile ? (
          <section className="card mt-6 p-8 text-center">
            <h1 className="text-3xl font-black text-ink">Profile not available</h1>
            <p className="mt-2 text-slate-600">This profile may be private until the public profile database policy is enabled.</p>
          </section>
        ) : (
          <section className="card mt-6 overflow-hidden">
            <div className="bg-ink px-6 py-10 text-white">
              <div className="flex flex-wrap items-center justify-between gap-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-purple-700 text-2xl font-black">
                    {profile.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase text-purple-200">CareerUp profile</p>
                    <h1 className="mt-1 text-3xl font-black">{profile.name}</h1>
                    <p className="text-slate-300">{[profile.school, profile.major, profile.graduationYear].filter(Boolean).join(" · ") || "CareerUp Student"}</p>
                  </div>
                </div>

                {isOwnProfile ? (
                  <Link href="/profile" className="inline-flex min-h-11 items-center justify-center rounded-lg border border-white/20 px-5 font-bold hover:border-purple-300">
                    Edit profile
                  </Link>
                ) : friendship ? (
                  <span className="inline-flex min-h-11 items-center justify-center rounded-lg border border-white/20 px-5 font-bold text-purple-100">
                    {friendship.status === "accepted" ? "Friends" : friendship.direction === "incoming" ? "Request received" : "Request sent"}
                  </span>
                ) : user ? (
                  <form action={sendFriendRequestById}>
                    <input type="hidden" name="profileId" value={profile.id} />
                    <button className="inline-flex min-h-11 items-center justify-center rounded-lg bg-purple-700 px-5 font-bold text-white shadow-lg shadow-purple-800/20 hover:bg-purple-800">
                      <UserPlus className="mr-2" size={18} /> Add friend
                    </button>
                  </form>
                ) : (
                  <Link href={`/login?message=${encodeURIComponent("Log in to add this profile as a friend.")}`} className="inline-flex min-h-11 items-center justify-center rounded-lg bg-purple-700 px-5 font-bold text-white shadow-lg shadow-purple-800/20 hover:bg-purple-800">
                    Log in to add
                  </Link>
                )}
              </div>
            </div>

            <div className="grid gap-6 p-6 lg:grid-cols-[1fr_360px]">
              <div className="grid gap-4 md:grid-cols-3">
                <StatCard icon={Sparkles} label="XP" value={profile.xp.toLocaleString()} />
                <StatCard icon={Flame} label="Streak" value={`${profile.streak} days`} />
                <StatCard icon={Trophy} label="Applied" value={profile.applicationsApplied.toString()} />
              </div>

              <aside className="space-y-4">
                <div className="rounded-lg border border-slate-200 p-4">
                  <p className="mb-2 text-sm font-bold text-slate-500">Current rank</p>
                  <RankBadge xp={profile.xp} />
                </div>
                <XpProgressBar xp={profile.xp} />
                {!isOwnProfile && (
                  <div className="rounded-lg border border-slate-200 bg-white p-4">
                    <div className="flex items-center gap-2">
                      <UsersRound size={18} className="text-purple-700" />
                      <h2 className="font-black text-ink">Mutual friends</h2>
                    </div>
                    {isAcceptedFriend ? (
                      mutualFriends.length > 0 ? (
                        <div className="mt-4 grid gap-3">
                          {mutualFriends.map((friend) => (
                            <Link key={friend.id} href={`/u/${friend.id}`} className="rounded-lg border border-slate-100 p-3 transition hover:border-purple-200 hover:bg-purple-50/60">
                              <p className="font-black text-ink">{friend.name}</p>
                              <p className="mt-1 text-xs font-bold text-slate-500">{friend.school}</p>
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <p className="mt-4 text-sm font-bold text-slate-500">No mutual friends yet.</p>
                      )
                    ) : (
                      <p className="mt-4 text-sm font-bold text-slate-500">Become friends to compare mutuals.</p>
                    )}
                  </div>
                )}
              </aside>

              <div className="lg:col-span-2 grid gap-4 md:grid-cols-2">
                <ProfileTags icon={Target} title="Target roles" values={profile.targetRoles} empty="No target roles yet." />
                <ProfileTags icon={MapPin} title="Target locations" values={profile.targetLocations} empty="No target locations yet." />
              </div>

              <div className="lg:col-span-2">
                <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <p className="eyebrow">Application board</p>
                    <h2 className="mt-2 text-2xl font-black text-ink">Pipeline</h2>
                  </div>
                  {sharedBoard.canView && <p className="text-sm font-bold text-slate-500">{sharedBoard.applications.length} visible roles</p>}
                </div>

                {sharedBoard.canView ? (
                  sharedBoard.applications.length > 0 ? (
                    <PublicApplicationBoard applications={sharedBoard.applications} />
                  ) : (
                    <div className="rounded-lg border border-dashed border-slate-200 bg-white/80 p-6 text-sm font-bold text-slate-500">No applications are on this board yet.</div>
                  )
                ) : isOwnProfile ? (
                  <div className="rounded-lg border border-dashed border-slate-200 bg-white/80 p-6 text-sm font-bold text-slate-500">Add roles to your board from the postings page.</div>
                ) : isAcceptedFriend ? (
                  <div className="rounded-lg border border-slate-200 bg-white/80 p-6">
                    <div className="flex items-start gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-50 text-purple-800">
                        <Lock size={18} />
                      </span>
                      <div>
                        <h3 className="font-black text-ink">Application board is private</h3>
                        <p className="mt-1 text-sm font-bold text-slate-500">This friend has not enabled board sharing.</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-lg border border-slate-200 bg-white/80 p-6">
                    <div className="flex items-start gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-50 text-purple-800">
                        <Lock size={18} />
                      </span>
                      <div>
                        <h3 className="font-black text-ink">Friends only</h3>
                        <p className="mt-1 text-sm font-bold text-slate-500">Add this profile as a friend to see a shared application board when they allow it.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}
      </main>
    </>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: typeof Sparkles; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <Icon size={20} className="text-purple-700" />
      <p className="mt-4 text-sm font-bold text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-black text-ink">{value}</p>
    </div>
  );
}

function ProfileTags({ icon: Icon, title, values, empty }: { icon: typeof Target; title: string; values: string[]; empty: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex items-center gap-2">
        <Icon size={18} className="text-purple-700" />
        <h2 className="font-black text-ink">{title}</h2>
      </div>
      {values.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {values.map((value) => (
            <span key={value} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
              {value}
            </span>
          ))}
        </div>
      ) : (
        <p className="mt-4 text-sm font-bold text-slate-500">{empty}</p>
      )}
    </div>
  );
}
