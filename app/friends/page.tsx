import { Check, MailPlus, Share2, Trash2, UserPlus, UsersRound } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { CopyInviteLink } from "@/components/CopyInviteLink";
import { Navbar } from "@/components/Navbar";
import { RankBadge } from "@/components/RankBadge";
import { acceptFriendRequest, removeFriend, sendFriendRequest, sendFriendRequestById } from "@/lib/friends/actions";
import { getCurrentUser, getFriends } from "@/lib/data";

export default async function FriendsPage({ searchParams }: { searchParams?: { message?: string; invite?: string } }) {
  const [friends, user] = await Promise.all([getFriends(), getCurrentUser()]);
  const acceptedFriends = friends.filter((friend) => friend.status === "accepted");
  const incomingRequests = friends.filter((friend) => friend.status === "pending" && friend.direction === "incoming");
  const outgoingRequests = friends.filter((friend) => friend.status === "pending" && friend.direction === "outgoing");
  const headerList = headers();
  const host = headerList.get("x-forwarded-host") ?? headerList.get("host") ?? "";
  const protocol = headerList.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  const origin = host ? `${protocol}://${host}` : "";
  const shareLink = user ? `${origin}/u/${user.id}` : `${origin}/friends`;
  const inviteId = searchParams?.invite && searchParams.invite !== user?.id ? searchParams.invite : "";

  return (
    <>
      <Navbar />
      <main className="page-shell">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Squad</p>
            <h1 className="mt-2 text-4xl font-black text-ink">Friends</h1>
            <p className="mt-2 max-w-2xl text-slate-600">Add classmates, compare progress, and build a leaderboard that feels personal.</p>
          </div>
        </div>

        {searchParams?.message && <p className="mt-5 rounded-lg bg-purple-50 p-3 text-sm font-bold text-purple-900">{searchParams.message}</p>}

        {inviteId && (
          <form action={sendFriendRequestById} className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-purple-200 bg-purple-50 p-4">
            <div>
              <p className="font-black text-purple-950">Friend invite opened</p>
              <p className="text-sm font-bold text-purple-800">Send a request to add this CareerUp profile.</p>
            </div>
            <input type="hidden" name="profileId" value={inviteId} />
            <button className="primary-button">
              <UserPlus className="mr-2" size={18} /> Add from invite
            </button>
          </form>
        )}

        <section className="mt-8 grid gap-4 lg:grid-cols-[1fr_360px]">
          <form action={sendFriendRequest} className="card grid gap-4 p-5">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-purple-50 text-purple-800">
                <UserPlus size={20} />
              </span>
              <div>
                <h2 className="font-black text-ink">Add a friend</h2>
                <p className="text-sm text-slate-600">Use the email they signed up with.</p>
              </div>
            </div>
            <label className="grid gap-2 text-sm font-bold text-slate-700">
              Email
              <input name="email" type="email" className="rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-purple-600" placeholder="friend@example.com" required />
            </label>
            <button type="submit" className="primary-button w-full sm:w-auto">
              <MailPlus className="mr-2" size={18} /> Send request
            </button>
          </form>

          <div className="card p-5">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                <Share2 size={20} />
              </span>
              <div>
                <h2 className="font-black text-ink">Profile invite</h2>
                <p className="text-sm text-slate-600">Share your CareerUp friend link.</p>
              </div>
            </div>
            <CopyInviteLink url={shareLink} />
          </div>
        </section>

        <section className="mt-6 grid gap-4 lg:grid-cols-3">
          <FriendSection title="Incoming" helper="Requests waiting on you" friends={incomingRequests} empty="No incoming requests." action="accept" />
          <FriendSection title="Friends" helper="Included on your friends leaderboard" friends={acceptedFriends} empty="No accepted friends yet." action="remove" />
          <FriendSection title="Sent" helper="Requests waiting on them" friends={outgoingRequests} empty="No sent requests." action="remove" />
        </section>
      </main>
    </>
  );
}

function FriendSection({
  title,
  helper,
  friends,
  empty,
  action
}: {
  title: string;
  helper: string;
  friends: Awaited<ReturnType<typeof getFriends>>;
  empty: string;
  action: "accept" | "remove";
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white/80 p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="font-black text-ink">{title}</h2>
          <p className="text-sm text-slate-600">{helper}</p>
        </div>
        <span className="flex h-9 min-w-9 items-center justify-center rounded-lg bg-slate-100 px-3 text-sm font-black text-slate-700">
          {friends.length}
        </span>
      </div>

      {friends.length > 0 ? (
        <div className="grid gap-3">
          {friends.map((friend) => (
            <article key={friend.id} className="rounded-lg border border-slate-200 bg-white p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  {friend.status === "accepted" ? (
                    <Link href={`/u/${friend.userId}`} className="font-black text-ink hover:text-purple-800">
                      {friend.name}
                    </Link>
                  ) : (
                    <p className="font-black text-ink">{friend.name}</p>
                  )}
                  <p className="text-sm text-slate-500">{friend.school}</p>
                  <p className="mt-1 text-xs font-bold text-slate-400">{friend.email}</p>
                </div>
                <UsersRound size={18} className="text-purple-700" />
              </div>
              <div className="mt-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-black text-purple-800">{friend.xp.toLocaleString()} XP</p>
                  <RankBadge xp={friend.xp} />
                </div>
                <div className="flex gap-2">
                  {action === "accept" && (
                    <form action={acceptFriendRequest}>
                      <input type="hidden" name="friendshipId" value={friend.id} />
                      <button className="inline-flex min-h-10 items-center rounded-lg bg-purple-700 px-3 text-sm font-bold text-white" aria-label={`Accept ${friend.name}`}>
                        <Check size={16} />
                      </button>
                    </form>
                  )}
                  <form action={removeFriend}>
                    <input type="hidden" name="friendshipId" value={friend.id} />
                    <button className="inline-flex min-h-10 items-center rounded-lg border border-slate-200 px-3 text-sm font-bold text-slate-500 hover:border-red-200 hover:text-red-600" aria-label={`Remove ${friend.name}`}>
                      <Trash2 size={16} />
                    </button>
                  </form>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-slate-200 bg-white/70 p-4 text-sm font-bold text-slate-500">{empty}</div>
      )}
    </div>
  );
}
