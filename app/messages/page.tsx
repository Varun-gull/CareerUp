import { CheckCheck, Inbox, Mail, Send, UsersRound } from "lucide-react";
import Link from "next/link";
import { ApplicationStatusBadge } from "@/components/ApplicationStatusBadge";
import { Navbar } from "@/components/Navbar";
import { ProfileLink } from "@/components/ProfileLink";
import { RolePeerSetupNotice } from "@/components/RolePeerSetupNotice";
import { getPeerMessages, getRolePeerFeatureStatus } from "@/lib/data";
import { markPeerMessageRead, sendPeerMessage } from "@/lib/messages/actions";
import type { PeerMessage } from "@/lib/types";

function Avatar({ message }: { message: PeerMessage }) {
  if (message.otherSchoolLogoUrl) {
    return <img src={message.otherSchoolLogoUrl} alt="" className="h-full w-full bg-white object-contain p-2" />;
  }

  return <span>{message.otherName.charAt(0).toUpperCase()}</span>;
}

function MessageList({ messages, empty }: { messages: PeerMessage[]; empty: string }) {
  if (messages.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-200 bg-white/70 p-6 text-center">
        <Mail className="mx-auto text-purple-700" size={28} />
        <p className="mt-3 text-sm font-black text-slate-500">{empty}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {messages.map((message) => (
        <article key={message.id} className={`card p-5 ${message.unread ? "ring-2 ring-purple-200" : ""}`}>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex min-w-0 items-start gap-3">
              <Link
                href={`/u/${message.otherProfileId}`}
                className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-purple-100 text-lg font-black text-purple-800"
                aria-label={`Open ${message.otherName}'s profile`}
              >
                <Avatar message={message} />
              </Link>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <ProfileLink profileId={message.otherProfileId} name={message.otherName} />
                  <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-black text-slate-500">
                    {message.direction === "received" ? "From peer" : "Sent"}
                  </span>
                  {message.unread && <span className="rounded-full bg-purple-700 px-2 py-1 text-xs font-black text-white">Unread</span>}
                </div>
                <p className="text-sm font-bold text-slate-500">{message.otherSchool}</p>
                <p className="mt-3 text-lg font-black text-ink">{message.subject}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs font-black uppercase text-slate-400">{message.createdAt}</p>
              <div className="mt-2">
                <ApplicationStatusBadge status={message.applicationStatus} />
              </div>
            </div>
          </div>

          <p className="mt-4 rounded-lg bg-slate-50 p-4 text-sm font-bold leading-6 text-slate-600">{message.body}</p>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4 text-sm font-black text-slate-500">
            {message.roleKey.startsWith("profile::") ? (
              <span>Direct profile message</span>
            ) : (
              <>
                <span>
                  {message.applicationRole} at {message.applicationCompany}
                </span>
                <span>{message.applicationYear} cycle</span>
              </>
            )}
          </div>

          {message.unread && (
            <form action={markPeerMessageRead} className="mt-4">
              <input type="hidden" name="messageId" value={message.id} />
              <input type="hidden" name="returnTo" value="/messages" />
              <button type="submit" className="inline-flex min-h-10 items-center justify-center rounded-lg border border-purple-200 bg-white px-4 text-sm font-black text-purple-800 transition hover:bg-purple-50">
                <CheckCheck className="mr-2" size={16} /> Mark read
              </button>
            </form>
          )}

          {message.direction === "received" && (
            <form action={sendPeerMessage} className="mt-4 grid gap-3 rounded-lg border border-purple-100 bg-purple-50/60 p-4">
              <input type="hidden" name="recipientId" value={message.otherProfileId} />
              <input type="hidden" name="applicationId" value={message.applicationId} />
              <input type="hidden" name="roleKey" value={message.roleKey} />
              <input type="hidden" name="sourceMessageId" value={message.id} />
              <input type="hidden" name="returnTo" value="/messages" />
              <label className="grid gap-1 text-xs font-black uppercase text-slate-500">
                Reply subject
                <input
                  name="subject"
                  defaultValue={message.subject.startsWith("Re:") ? message.subject : `Re: ${message.subject}`}
                  className="field text-sm normal-case"
                />
              </label>
              <label className="grid gap-1 text-xs font-black uppercase text-slate-500">
                Reply
                <textarea
                  name="body"
                  rows={3}
                  className="field text-sm normal-case"
                  placeholder="Share advice, interview prep notes, or a time to chat."
                />
              </label>
              <button type="submit" className="primary-button w-fit">
                Send reply
              </button>
            </form>
          )}
        </article>
      ))}
    </div>
  );
}

export default async function MessagesPage({ searchParams }: { searchParams?: { message?: string } }) {
  const [messages, peerFeatureStatus] = await Promise.all([getPeerMessages(), getRolePeerFeatureStatus()]);
  const receivedMessages = messages.filter((message) => message.direction === "received");
  const sentMessages = messages.filter((message) => message.direction === "sent");
  const unreadMessages = receivedMessages.filter((message) => message.unread);

  return (
    <>
      <Navbar />
      <main className="page-shell">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Peer advice</p>
            <h1 className="mt-2 text-4xl font-black text-ink">Messages</h1>
            <p className="mt-2 max-w-2xl text-slate-600">
              Keep track of advice requests connected to specific roles, interviews, and application years.
            </p>
          </div>
        </div>

        {searchParams?.message && <p className="mt-5 rounded-lg bg-purple-50 p-3 text-sm font-bold text-purple-900">{searchParams.message}</p>}
        <RolePeerSetupNotice status={peerFeatureStatus} />

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="card p-5">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-purple-700 text-white">
                <Inbox size={20} />
              </span>
              <div>
                <p className="text-sm font-black text-slate-500">Received</p>
                <p className="text-3xl font-black text-ink">{receivedMessages.length}</p>
                <p className="text-xs font-black text-purple-700">{unreadMessages.length} unread</p>
              </div>
            </div>
          </div>
          <div className="card p-5">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-950 text-white">
                <Send size={20} />
              </span>
              <div>
                <p className="text-sm font-black text-slate-500">Sent</p>
                <p className="text-3xl font-black text-ink">{sentMessages.length}</p>
              </div>
            </div>
          </div>
          <div className="card p-5">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-purple-50 text-purple-800">
                <UsersRound size={20} />
              </span>
              <div>
                <p className="text-sm font-black text-slate-500">Role threads</p>
                <p className="text-3xl font-black text-ink">{new Set(messages.map((message) => message.roleKey)).size}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <div>
            <h2 className="mb-4 text-2xl font-black text-ink">Inbox</h2>
            <MessageList messages={receivedMessages} empty="No one has messaged you about a role yet." />
          </div>
          <div>
            <h2 className="mb-4 text-2xl font-black text-ink">Sent</h2>
            <MessageList messages={sentMessages} empty="Messages you send from role insights will show here." />
          </div>
        </section>
      </main>
    </>
  );
}
