import { Check, CheckCheck, Inbox, Mail, UsersRound } from "lucide-react";
import Link from "next/link";
import { ApplicationStatusBadge } from "@/components/ApplicationStatusBadge";
import { AutoMarkRead } from "@/components/AutoMarkRead";
import { MessageReplyForm } from "@/components/MessageReplyForm";
import { ProfileLink } from "@/components/ProfileLink";
import { RolePeerSetupNotice } from "@/components/RolePeerSetupNotice";
import { getPeerMessages, getRolePeerFeatureStatus } from "@/lib/data";
import { markPeerMessageRead } from "@/lib/messages/actions";
import type { PeerMessage } from "@/lib/types";

type Conversation = {
  id: string;
  otherProfileId: string;
  otherName: string;
  otherSchool: string;
  otherSchoolLogoUrl: string;
  roleKey: string;
  applicationCompany: string;
  applicationRole: string;
  applicationStatus: PeerMessage["applicationStatus"];
  applicationYear: number;
  messages: PeerMessage[];
  lastMessage: PeerMessage;
  unreadCount: number;
};

function Avatar({ conversation }: { conversation: Conversation }) {
  if (conversation.otherSchoolLogoUrl) {
    return <img src={conversation.otherSchoolLogoUrl} alt="" className="h-full w-full bg-white object-contain p-2" />;
  }

  return <span>{conversation.otherName.charAt(0).toUpperCase()}</span>;
}

function conversationKey(message: PeerMessage) {
  return `${message.otherProfileId}::${message.roleKey}`;
}

function buildConversations(messages: PeerMessage[]) {
  const groups = new Map<string, PeerMessage[]>();

  for (const message of messages) {
    const key = conversationKey(message);
    groups.set(key, [...(groups.get(key) ?? []), message]);
  }

  return Array.from(groups.entries())
    .map(([id, group]) => {
      const sorted = [...group].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
      const lastMessage = sorted[sorted.length - 1];
      return {
        id,
        otherProfileId: lastMessage.otherProfileId,
        otherName: lastMessage.otherName,
        otherSchool: lastMessage.otherSchool,
        otherSchoolLogoUrl: lastMessage.otherSchoolLogoUrl,
        roleKey: lastMessage.roleKey,
        applicationCompany: lastMessage.applicationCompany,
        applicationRole: lastMessage.applicationRole,
        applicationStatus: lastMessage.applicationStatus,
        applicationYear: lastMessage.applicationYear,
        messages: sorted,
        lastMessage,
        unreadCount: sorted.filter((message) => message.direction === "received" && message.unread).length,
      } satisfies Conversation;
    })
    .sort((a, b) => b.lastMessage.createdAt.localeCompare(a.lastMessage.createdAt));
}

function EmptyMessages() {
  return (
    <div className="card flex min-h-[34rem] items-center justify-center p-8 text-center">
      <div>
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-sky/10 text-sky-600">
          <Mail size={26} />
        </div>
        <h2 className="mt-4 text-2xl font-bold text-ink">No conversations yet</h2>
        <p className="mt-2 max-w-sm text-sm font-semibold leading-6 text-slate-600">
          Messages from role insights and public profiles will show up here as focused conversations.
        </p>
      </div>
    </div>
  );
}

export default async function MessagesPage({ searchParams }: { searchParams?: { message?: string; thread?: string } }) {
  const [messages, peerFeatureStatus] = await Promise.all([getPeerMessages(), getRolePeerFeatureStatus()]);
  const conversations = buildConversations(messages);
  const selectedConversation = conversations.find((conversation) => conversation.id === searchParams?.thread) ?? conversations[0];
  const unreadCount = conversations.reduce((sum, conversation) => sum + conversation.unreadCount, 0);
  const sentCount = messages.filter((message) => message.direction === "sent").length;

  return (
    <>
      <main className="page-shell">
        <div className="page-hero flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Peer network</p>
            <h1 className="mt-2 text-4xl font-bold text-ink sm:text-5xl">Messages</h1>
            <p className="mt-2 max-w-2xl text-slate-600">
              Keep role questions, profile messages, and peer advice in clean conversation threads.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 rounded-3xl border border-slate-200 bg-white/90 p-2 text-center">
            <div className="min-w-20 rounded-2xl bg-slate-50 px-3 py-2">
              <p className="text-lg font-bold text-ink">{conversations.length}</p>
              <p className="text-[11px] font-bold uppercase text-slate-500">Threads</p>
            </div>
            <div className="min-w-20 rounded-2xl bg-slate-50 px-3 py-2">
              <p className="text-lg font-bold text-sky-600">{unreadCount}</p>
              <p className="text-[11px] font-bold uppercase text-slate-500">Unread</p>
            </div>
            <div className="min-w-20 rounded-2xl bg-slate-50 px-3 py-2">
              <p className="text-lg font-bold text-ink">{sentCount}</p>
              <p className="text-[11px] font-bold uppercase text-slate-500">Sent</p>
            </div>
          </div>
        </div>

        {searchParams?.message && <p className="mt-5 rounded-2xl border border-sky/20 bg-sky/10 p-3 text-sm font-bold text-sky-600">{searchParams.message}</p>}
        <RolePeerSetupNotice status={peerFeatureStatus} />

        {selectedConversation ? (
          <section className="mt-8 grid min-h-[42rem] overflow-hidden rounded-3xl border border-slate-200 bg-white/90 shadow-strong lg:grid-cols-[340px_1fr_320px]">
            <aside className="border-b border-slate-200 bg-white/90 lg:border-b-0 lg:border-r">
              <div className="border-b border-slate-200 p-4">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                  <Inbox size={18} className="text-sky-600" /> Conversations
                </div>
                <p className="mt-1 text-xs font-bold text-slate-500">Role-specific advice in one place.</p>
              </div>
              <div className="max-h-[34rem] overflow-y-auto p-2">
                {conversations.map((conversation) => {
                  const active = conversation.id === selectedConversation.id;
                  return (
                    <Link
                      key={conversation.id}
                      href={`/messages?thread=${encodeURIComponent(conversation.id)}`}
                      className={`block rounded-2xl p-3 transition ${
                        active ? "bg-sky/10 ring-1 ring-sky/25" : "hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-slate-100 text-base font-bold text-sky-600">
                          <Avatar conversation={conversation} />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="truncate text-sm font-bold text-ink">{conversation.otherName}</p>
                            {conversation.unreadCount > 0 && (
                              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-sky px-1 text-[10px] font-bold text-white">
                                {conversation.unreadCount}
                              </span>
                            )}
                          </div>
                          <p className="mt-1 truncate text-xs font-bold text-slate-500">{conversation.applicationCompany}</p>
                          <p className="mt-2 line-clamp-2 text-xs font-semibold leading-5 text-slate-600">{conversation.lastMessage.body}</p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </aside>

            <section className="flex min-h-[42rem] flex-col bg-white/80">
              <div className="border-b border-slate-200 p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <ProfileLink profileId={selectedConversation.otherProfileId} name={selectedConversation.otherName} />
                      <ApplicationStatusBadge status={selectedConversation.applicationStatus} />
                    </div>
                    <p className="mt-1 truncate text-sm font-bold text-slate-600">
                      {selectedConversation.applicationRole} at {selectedConversation.applicationCompany}
                    </p>
                  </div>
                  {selectedConversation.unreadCount > 0 && (
                    <form action={markPeerMessageRead}>
                      <input type="hidden" name="messageId" value={selectedConversation.messages.find((message) => message.unread)?.id ?? ""} />
                      <input type="hidden" name="returnTo" value={`/messages?thread=${encodeURIComponent(selectedConversation.id)}`} />
                      <button type="submit" className="secondary-button min-h-10 px-4 text-sm">
                        <CheckCheck className="mr-2" size={16} /> Mark read
                      </button>
                    </form>
                  )}
                </div>
              </div>

              {/* Auto-mark unread received messages as read when conversation opens */}
              {(() => {
                const firstUnread = selectedConversation.messages.find((m) => m.direction === "received" && m.unread);
                return firstUnread ? (
                  <AutoMarkRead
                    messageId={firstUnread.id}
                    returnTo={`/messages?thread=${encodeURIComponent(selectedConversation.id)}`}
                  />
                ) : null;
              })()}

              <div className="flex-1 space-y-4 overflow-y-auto p-5">
                {selectedConversation.messages.map((message) => {
                  const outbound = message.direction === "sent";
                  const isRead = outbound && !!message.readAt;
                  return (
                    <article key={message.id} className={`flex ${outbound ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[80%] rounded-3xl border p-4 ${
                        outbound
                          ? "border-sky/25 bg-sky/12 text-slate-100"
                          : "border-slate-200 bg-white/90 text-slate-200"
                      }`}>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-bold">{outbound ? "You" : message.otherName}</p>
                          <span className="text-xs font-bold text-slate-500">{message.createdAt}</span>
                          {message.unread && !outbound && (
                            <span className="rounded-full bg-sky px-2 py-0.5 text-[10px] font-bold text-white">Unread</span>
                          )}
                        </div>
                        <p className="mt-2 text-sm font-bold text-ink">{message.subject}</p>
                        <p className="mt-2 whitespace-pre-wrap text-sm font-semibold leading-6 text-slate-700">{message.body}</p>
                        {outbound && (
                          <div className={`mt-2 flex items-center justify-end gap-1 text-xs font-bold ${isRead ? "text-sky-600" : "text-slate-400"}`}>
                            {isRead ? (
                              <><CheckCheck size={14} /> Read {message.readAt}</>
                            ) : (
                              <><Check size={14} /> Sent</>
                            )}
                          </div>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>

              <MessageReplyForm
                recipientId={selectedConversation.otherProfileId}
                applicationId={selectedConversation.lastMessage.applicationId}
                roleKey={selectedConversation.roleKey}
                sourceMessageId={selectedConversation.lastMessage.id}
                defaultSubject={selectedConversation.lastMessage.subject.startsWith("Re:") ? selectedConversation.lastMessage.subject : `Re: ${selectedConversation.lastMessage.subject}`}
                returnTo={`/messages?thread=${encodeURIComponent(selectedConversation.id)}`}
              />
            </section>

            <aside className="border-t border-slate-200 bg-white/90 p-5 lg:border-l lg:border-t-0">
              <div className="flex items-center gap-3">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-slate-100 text-lg font-bold text-sky-600">
                  <Avatar conversation={selectedConversation} />
                </span>
                <div className="min-w-0">
                  <ProfileLink profileId={selectedConversation.otherProfileId} name={selectedConversation.otherName} />
                  <p className="truncate text-sm font-bold text-slate-500">{selectedConversation.otherSchool || "Student"}</p>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                    <UsersRound size={17} className="text-sky-600" /> Role context
                  </div>
                  <p className="mt-3 text-lg font-bold text-ink">{selectedConversation.applicationRole}</p>
                  <p className="mt-1 text-sm font-bold text-slate-600">{selectedConversation.applicationCompany}</p>
                  <div className="mt-3">
                    <ApplicationStatusBadge status={selectedConversation.applicationStatus} />
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-bold text-slate-700">Thread details</p>
                  <div className="mt-3 grid gap-2 text-sm font-bold text-slate-600">
                    <p>{selectedConversation.messages.length} messages</p>
                    <p>{selectedConversation.applicationYear} application cycle</p>
                    <p>{selectedConversation.unreadCount} unread</p>
                  </div>
                </div>
              </div>
            </aside>
          </section>
        ) : (
          <div className="mt-8">
            <EmptyMessages />
          </div>
        )}
      </main>
    </>
  );
}
