import { Archive, Check, CheckCheck, Edit3, Mail, MoreVertical, Search } from "lucide-react";
import Link from "next/link";
import { AutoMarkRead } from "@/components/AutoMarkRead";
import { MessageReplyForm } from "@/components/MessageReplyForm";
import { PageHero } from "@/components/PageHero";
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
    <div className="flex min-h-[34rem] items-center justify-center rounded-[2rem] border border-white/80 bg-white/75 p-8 text-center shadow-soft">
      <div>
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E1EFEB] text-[#2A6384]">
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

  return (
    <>
      <main className="page-shell">
        <PageHero
          compact
          eyebrow="Peer network"
          title="Messages"
          description="Keep role questions, profile messages, and peer advice in clean conversation threads."
          actions={
            <span className="rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-bold text-white ring-1 ring-white/20">
              {conversations.length} threads · {unreadCount} unread
            </span>
          }
        />
        {searchParams?.message && <p className="mt-5 rounded-2xl border border-sky/20 bg-sky/10 p-3 text-sm font-bold text-sky-600">{searchParams.message}</p>}
        <RolePeerSetupNotice status={peerFeatureStatus} />

        {selectedConversation ? (
          <section className="mt-8 grid min-h-[calc(100vh-8.5rem)] overflow-hidden rounded-[2rem] border border-white/80 bg-white/85 shadow-strong backdrop-blur-xl lg:grid-cols-[360px_minmax(0,1fr)]">
            <aside className="border-b border-slate-200/80 bg-white/90 lg:border-b-0 lg:border-r">
              <div className="space-y-6 p-5">
                <label className="flex min-h-12 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 text-slate-500 shadow-sm">
                  <Search size={18} />
                  <span className="text-sm font-semibold">Search</span>
                </label>

                <div>
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="text-xl font-black text-ink">Active</h2>
                    <span className="rounded-full bg-[#E1EFEB] px-3 py-1 text-xs font-black text-[#2A6384]">{conversations.length}</span>
                  </div>
                  <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
                    {conversations.slice(0, 6).map((conversation) => (
                      <Link
                        key={conversation.id}
                        href={`/messages?thread=${encodeURIComponent(conversation.id)}`}
                        title={conversation.otherName}
                        className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-100 text-sm font-black text-[#2A6384] ring-1 ring-slate-200"
                      >
                        <Avatar conversation={conversation} />
                        <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500" />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-200/80 px-5 py-4">
                <div className="flex items-center justify-between gap-3">
                  <h1 className="text-2xl font-black text-ink">Messages <span className="align-middle text-sm text-slate-500">({messages.length})</span></h1>
                  <button className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-sm" aria-label="New message">
                    <Edit3 size={18} />
                  </button>
                </div>
              </div>

              <div className="max-h-[calc(100vh-25rem)] overflow-y-auto px-3 pb-4">
                {conversations.map((conversation) => {
                  const active = conversation.id === selectedConversation.id;
                  return (
                    <Link
                      key={conversation.id}
                      href={`/messages?thread=${encodeURIComponent(conversation.id)}`}
                      className={`block rounded-2xl p-3 transition ${
                        active ? "bg-[#F8FBFA] shadow-sm ring-1 ring-[#5E7681]/20" : "hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-100 text-base font-bold text-[#2A6384]">
                          <Avatar conversation={conversation} />
                          <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500" />
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
                          <p className="mt-2 line-clamp-2 text-sm font-semibold leading-5 text-slate-600">{conversation.lastMessage.body}</p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </aside>

            <section className="flex min-h-[calc(100vh-8.5rem)] flex-col bg-white">
              <div className="border-b border-slate-200/80 p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-4">
                    <span className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-100 text-lg font-black text-[#2A6384]">
                      <Avatar conversation={selectedConversation} />
                      <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-white bg-emerald-500" />
                    </span>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <ProfileLink profileId={selectedConversation.otherProfileId} name={selectedConversation.otherName} />
                        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-black text-emerald-700 ring-1 ring-emerald-200">Online</span>
                      </div>
                      <p className="mt-1 truncate text-sm font-bold text-slate-600">
                        {selectedConversation.applicationRole} at {selectedConversation.applicationCompany}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/u/${selectedConversation.otherProfileId}`} className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#2A6384] px-4 text-sm font-black text-white shadow-sm">
                      View profile
                    </Link>
                    {selectedConversation.unreadCount > 0 ? (
                      <form action={markPeerMessageRead}>
                        <input type="hidden" name="messageId" value={selectedConversation.messages.find((message) => message.unread)?.id ?? ""} />
                        <input type="hidden" name="returnTo" value={`/messages?thread=${encodeURIComponent(selectedConversation.id)}`} />
                        <button type="submit" className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-3 text-sm font-black text-slate-700 shadow-sm">
                          <CheckCheck className="mr-2" size={16} /> Read
                        </button>
                      </form>
                    ) : (
                      <button className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-3 text-sm font-black text-slate-700 shadow-sm">
                        <Archive className="mr-2" size={16} /> Archive
                      </button>
                    )}
                    <button className="flex h-11 w-11 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-50" aria-label="More options">
                      <MoreVertical size={18} />
                    </button>
                  </div>
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

              <div className="flex-1 space-y-5 overflow-y-auto bg-white px-7 py-6">
                {selectedConversation.messages.map((message) => {
                  const outbound = message.direction === "sent";
                  const isRead = outbound && !!message.readAt;
                  return (
                    <article key={message.id} className={`flex gap-3 ${outbound ? "justify-end" : "justify-start"}`}>
                      {!outbound && (
                        <span className="mt-7 flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-100 text-sm font-black text-[#2A6384]">
                          <Avatar conversation={selectedConversation} />
                        </span>
                      )}
                      <div className={`max-w-[74%] ${outbound ? "text-right" : "text-left"}`}>
                        <div className={`mb-1 flex items-center gap-2 text-xs font-black text-[#2A6384] ${outbound ? "justify-end" : "justify-start"}`}>
                          <span>{outbound ? "You" : message.otherName}</span>
                          <span>{message.createdAt}</span>
                        </div>
                        <div className={`rounded-2xl px-4 py-3 text-sm font-semibold leading-6 shadow-sm ${
                          outbound
                            ? "rounded-br-md bg-blue-600 text-white"
                            : "rounded-bl-md bg-slate-50 text-slate-900 ring-1 ring-slate-100"
                        }`}>
                          <p className="whitespace-pre-wrap">{message.body}</p>
                        </div>
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
                defaultSubject={selectedConversation.lastMessage.subject.replace(/^Re:\s*/i, "") || "CareerUp message"}
                returnTo={`/messages?thread=${encodeURIComponent(selectedConversation.id)}`}
              />
            </section>
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
