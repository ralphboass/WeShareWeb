import {
  Timestamp,
  addDoc,
  collection,
  getDocs,
  onSnapshot,
  or,
  and,
  query,
  where,
  writeBatch,
  type DocumentData,
  type QueryDocumentSnapshot,
} from "firebase/firestore";
import { getDb, isFirebaseConfigured } from "./firebase";
import type { ChatMessage, Conversation, MessageStatus } from "./types";

const toDate = (value: unknown): Date =>
  value instanceof Timestamp ? value.toDate() : new Date(value as string);

function messageFromDoc(
  snapshot: QueryDocumentSnapshot<DocumentData>,
): ChatMessage {
  const data = snapshot.data();
  return {
    id: snapshot.id,
    content: data.content ?? "",
    senderId: data.senderId ?? "",
    receiverId: data.receiverId ?? "",
    timestamp: toDate(data.timestamp),
    isRead: Boolean(data.isRead),
    rideId: data.rideId ?? undefined,
    status: (data.status as MessageStatus) ?? undefined,
    isSystemMessage: data.isSystemMessage ?? undefined,
  };
}

/** All messages involving the user, newest last. Single `chats` collection. */
export function subscribeToInbox(
  userId: string,
  onMessages: (messages: ChatMessage[]) => void,
): () => void {
  if (!isFirebaseConfigured) {
    onMessages([]);
    return () => {};
  }
  const inbox = query(
    collection(getDb(), "chats"),
    or(where("senderId", "==", userId), where("receiverId", "==", userId)),
  );
  return onSnapshot(inbox, (snapshot) =>
    onMessages(
      snapshot.docs
        .map(messageFromDoc)
        .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime()),
    ),
  );
}

/** Groups a flat message list into conversations, like ChatListViewModel does. */
export function groupConversations(
  messages: ChatMessage[],
  userId: string,
  nameFor: (partnerId: string) => { name: string; imageUrl?: string },
): Conversation[] {
  const byPartner = new Map<string, ChatMessage[]>();

  for (const message of messages) {
    const partnerId =
      message.senderId === userId ? message.receiverId : message.senderId;
    if (!partnerId) continue;
    byPartner.set(partnerId, [...(byPartner.get(partnerId) ?? []), message]);
  }

  return [...byPartner.entries()]
    .map(([partnerId, thread]) => {
      const partner = nameFor(partnerId);
      return {
        partnerId,
        partnerName: partner.name,
        partnerImageUrl: partner.imageUrl,
        lastMessage: thread[thread.length - 1],
        unreadCount: thread.filter(
          (message) => message.receiverId === userId && !message.isRead,
        ).length,
      };
    })
    .sort(
      (a, b) =>
        b.lastMessage.timestamp.getTime() - a.lastMessage.timestamp.getTime(),
    );
}

export function threadBetween(
  messages: ChatMessage[],
  userId: string,
  partnerId: string,
): ChatMessage[] {
  return messages.filter(
    (message) =>
      (message.senderId === userId && message.receiverId === partnerId) ||
      (message.senderId === partnerId && message.receiverId === userId),
  );
}

export async function sendMessage(input: {
  content: string;
  senderId: string;
  receiverId: string;
  rideId?: string;
}): Promise<void> {
  await addDoc(collection(getDb(), "chats"), {
    content: input.content,
    senderId: input.senderId,
    receiverId: input.receiverId,
    timestamp: Timestamp.fromDate(new Date()),
    isRead: false,
    rideId: input.rideId ?? null,
    status: "delivered" satisfies MessageStatus,
  });
}

export async function markThreadRead(
  userId: string,
  partnerId: string,
): Promise<void> {
  const db = getDb();
  const unread = await getDocs(
    query(
      collection(db, "chats"),
      and(
        where("senderId", "==", partnerId),
        where("receiverId", "==", userId),
        where("isRead", "==", false),
      ),
    ),
  );
  if (unread.empty) return;

  const batch = writeBatch(db);
  unread.docs.forEach((document) =>
    batch.update(document.ref, { isRead: true, status: "read" }),
  );
  await batch.commit();
}
