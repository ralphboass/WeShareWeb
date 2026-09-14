"use client";

import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, MessageCircle, Send } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  groupConversations,
  markThreadRead,
  sendMessage,
  subscribeToInbox,
  threadBetween,
} from "@/lib/chat";
import { fetchProfile } from "@/lib/users";
import { fullName, type ChatMessage } from "@/lib/types";
import { formatMessageTime } from "@/lib/format";
import { isFirebaseConfigured } from "@/lib/firebase";
import {
  Alert,
  Avatar,
  Badge,
  Button,
  ButtonLink,
  Card,
  EmptyState,
  Spinner,
  cx,
  inputClass,
} from "@/components/ui";

const UNKNOWN_NAME = "WeShare user";

/** Same surface as <Card> but without its padding, for the scrolling chat panes. */
const CARD_SHELL =
  "overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm";

interface PartnerInfo {
  name: string;
  imageUrl?: string;
}

export default function MessagesPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-6xl px-5 py-10">
          <Spinner label="Loading messages…" />
        </div>
      }
    >
      <MessagesView />
    </Suspense>
  );
}

function MessagesView() {
  const { firebaseUser, loading } = useAuth();
  const searchParams = useSearchParams();
  const initialPartnerId = searchParams.get("to");

  const userId = firebaseUser?.uid ?? null;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inboxLoading, setInboxLoading] = useState(true);
  const [partners, setPartners] = useState<Record<string, PartnerInfo>>({});
  const [selectedId, setSelectedId] = useState<string | null>(initialPartnerId);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  // Partner ids we already asked Firestore about, so a re-render never refetches.
  const requestedPartners = useRef(new Set<string>());
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!userId) return;
    setInboxLoading(true);
    const unsubscribe = subscribeToInbox(userId, (next) => {
      setMessages(next);
      setInboxLoading(false);
    });
    return unsubscribe;
  }, [userId]);

  // A ?to= link can point at somebody we have never chatted with yet.
  useEffect(() => {
    if (initialPartnerId) setSelectedId(initialPartnerId);
  }, [initialPartnerId]);

  const partnerIds = useMemo(() => {
    if (!userId) return [] as string[];
    const ids = new Set<string>();
    for (const message of messages) {
      const partnerId =
        message.senderId === userId ? message.receiverId : message.senderId;
      if (partnerId) ids.add(partnerId);
    }
    if (selectedId) ids.add(selectedId);
    return [...ids];
  }, [messages, selectedId, userId]);

  useEffect(() => {
    if (!isFirebaseConfigured) return;
    const unknown = partnerIds.filter(
      (id) => !requestedPartners.current.has(id),
    );
    if (unknown.length === 0) return;
    unknown.forEach((id) => requestedPartners.current.add(id));

    let cancelled = false;
    void Promise.all(
      unknown.map(async (id) => {
        const profile = await fetchProfile(id).catch(() => null);
        return [id, profile] as const;
      }),
    ).then((results) => {
      if (cancelled) return;
      setPartners((current) => {
        const next = { ...current };
        for (const [id, profile] of results) {
          if (!profile) continue;
          next[id] = {
            name: fullName(profile) || UNKNOWN_NAME,
            imageUrl: profile.profileImageUrl,
          };
        }
        return next;
      });
    });

    return () => {
      cancelled = true;
    };
  }, [partnerIds]);

  const nameFor = useCallback(
    (partnerId: string): PartnerInfo =>
      partners[partnerId] ?? { name: UNKNOWN_NAME },
    [partners],
  );

  const conversations = useMemo(
    () => (userId ? groupConversations(messages, userId, nameFor) : []),
    [messages, userId, nameFor],
  );

  const thread = useMemo(
    () =>
      userId && selectedId ? threadBetween(messages, userId, selectedId) : [],
    [messages, userId, selectedId],
  );

  // Mark read once per open thread; re-runs when new messages land in it.
  useEffect(() => {
    if (!userId || !selectedId || !isFirebaseConfigured) return;
    const hasUnread = messages.some(
      (message) =>
        message.senderId === selectedId &&
        message.receiverId === userId &&
        !message.isRead,
    );
    if (!hasUnread) return;
    void markThreadRead(userId, selectedId).catch(() => {});
  }, [userId, selectedId, messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [thread.length, selectedId]);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-5 py-10">
        <Spinner label="Loading messages…" />
      </div>
    );
  }

  if (!firebaseUser || !userId) {
    return (
      <div className="mx-auto max-w-6xl px-5 py-10">
        <Card className="mx-auto max-w-md text-center">
          <h1 className="text-xl font-bold text-ink">Sign in to see messages</h1>
          <p className="mt-2 text-sm text-ink-muted">
            Chat with your drivers and passengers once you are logged in.
          </p>
          <ButtonLink href="/login?next=/messages" className="mt-5 w-full">
            Log in
          </ButtonLink>
        </Card>
      </div>
    );
  }

  const selectedPartner = selectedId ? nameFor(selectedId) : null;

  const handleSend = async () => {
    const content = draft.trim();
    if (!content || !selectedId || !isFirebaseConfigured) return;
    setSending(true);
    setSendError(null);
    try {
      await sendMessage({ content, senderId: userId, receiverId: selectedId });
      setDraft("");
    } catch (error) {
      setSendError(
        error instanceof Error ? error.message : "Message could not be sent.",
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <h1 className="text-2xl font-extrabold text-ink">Messages</h1>
      <p className="mt-1 text-sm text-ink-muted">
        Coordinate pickup spots and timing with your ride partners.
      </p>

      {!isFirebaseConfigured && (
        <div className="mt-6">
          <Alert tone="warning">
            Demo mode: Firebase is not configured, so messages cannot be loaded
            or sent.
          </Alert>
        </div>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]">
        {/* Plain divs instead of <Card> here: these panes need zero padding and
            their own scroll areas, which would fight Card's built-in p-6. */}
        <div
          className={cx(
            CARD_SHELL,
            selectedId ? "hidden lg:block" : "block",
          )}
        >
          <div className="border-b border-neutral-100 px-5 py-4">
            <p className="text-sm font-semibold text-ink">Conversations</p>
          </div>

          {inboxLoading ? (
            <Spinner />
          ) : conversations.length === 0 ? (
            <div className="p-5">
              <EmptyState
                icon={<MessageCircle className="size-8" />}
                title="No conversations yet"
                description="Book a seat or publish a ride, then message your ride partner from the ride page."
                action={
                  <ButtonLink href="/rides" variant="secondary">
                    Find a ride
                  </ButtonLink>
                }
              />
            </div>
          ) : (
            <ul className="max-h-[32rem] divide-y divide-neutral-100 overflow-y-auto">
              {conversations.map((conversation) => {
                const active = conversation.partnerId === selectedId;
                return (
                  <li key={conversation.partnerId}>
                    <button
                      type="button"
                      onClick={() => setSelectedId(conversation.partnerId)}
                      className={cx(
                        "flex w-full items-center gap-3 px-5 py-4 text-left transition",
                        active ? "bg-brand-50" : "hover:bg-neutral-50",
                      )}
                    >
                      <Avatar
                        name={conversation.partnerName}
                        imageUrl={conversation.partnerImageUrl}
                        size={40}
                      />
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center justify-between gap-2">
                          <span className="truncate text-sm font-semibold text-ink">
                            {conversation.partnerName}
                          </span>
                          <span className="shrink-0 text-xs text-ink-muted">
                            {formatMessageTime(
                              conversation.lastMessage.timestamp,
                            )}
                          </span>
                        </span>
                        <span className="mt-0.5 flex items-center justify-between gap-2">
                          <span className="truncate text-xs text-ink-muted">
                            {conversation.lastMessage.content}
                          </span>
                          {conversation.unreadCount > 0 && (
                            <Badge tone="brand">
                              {conversation.unreadCount}
                            </Badge>
                          )}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div
          className={cx(
            CARD_SHELL,
            "min-h-[32rem] flex-col",
            selectedId ? "flex" : "hidden lg:flex",
          )}
        >
          {!selectedId || !selectedPartner ? (
            <div className="flex flex-1 items-center justify-center p-5">
              <EmptyState
                icon={<MessageCircle className="size-8" />}
                title="Select a conversation"
                description="Pick someone on the left to read and reply to your messages."
              />
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 border-b border-neutral-100 px-5 py-4">
                <button
                  type="button"
                  onClick={() => setSelectedId(null)}
                  className="rounded-lg p-1.5 text-ink-soft transition hover:bg-neutral-100 lg:hidden"
                  aria-label="Back to conversations"
                >
                  <ArrowLeft className="size-5" />
                </button>
                <Avatar
                  name={selectedPartner.name}
                  imageUrl={selectedPartner.imageUrl}
                  size={40}
                />
                <p className="truncate text-sm font-semibold text-ink">
                  {selectedPartner.name}
                </p>
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto px-5 py-5">
                {thread.length === 0 ? (
                  <p className="py-10 text-center text-sm text-ink-muted">
                    No messages yet. Say hello.
                  </p>
                ) : (
                  thread.map((message) => {
                    const own = message.senderId === userId;
                    return (
                      <div
                        key={message.id}
                        className={cx(
                          "flex",
                          own ? "justify-end" : "justify-start",
                        )}
                      >
                        <div
                          className={cx(
                            "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm",
                            own
                              ? "bg-brand-600 text-white"
                              : "bg-neutral-100 text-ink",
                          )}
                        >
                          <p className="whitespace-pre-wrap break-words">
                            {message.content}
                          </p>
                          <p
                            className={cx(
                              "mt-1 text-[11px]",
                              own ? "text-brand-100" : "text-ink-muted",
                            )}
                          >
                            {formatMessageTime(message.timestamp)}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={bottomRef} />
              </div>

              <div className="border-t border-neutral-100 px-5 py-4">
                {sendError && (
                  <div className="mb-3">
                    <Alert>{sendError}</Alert>
                  </div>
                )}
                <div className="flex items-end gap-3">
                  <textarea
                    className={cx(inputClass, "min-h-12 resize-none py-3")}
                    rows={1}
                    value={draft}
                    placeholder="Write a message…"
                    onChange={(event) => setDraft(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && !event.shiftKey) {
                        event.preventDefault();
                        void handleSend();
                      }
                    }}
                  />
                  <Button
                    onClick={() => void handleSend()}
                    loading={sending}
                    disabled={!draft.trim() || !isFirebaseConfigured}
                    aria-label="Send message"
                  >
                    <Send className="size-4" />
                    Send
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
