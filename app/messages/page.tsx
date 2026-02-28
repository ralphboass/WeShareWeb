'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, orderBy, or } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Chat } from '@/types';
import { MessageCircle, Send } from 'lucide-react';

interface ChatGroup {
  userId: string;
  userName: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  rideId?: string;
}

export default function MessagesPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [chatGroups, setChatGroups] = useState<ChatGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;

    const fetchMessages = async () => {
      try {
        const chatsRef = collection(db, 'chats');
        const q = query(
          chatsRef,
          or(
            where('senderId', '==', user.id),
            where('receiverId', '==', user.id)
          ),
          orderBy('timestamp', 'desc')
        );

        const snapshot = await getDocs(q);
        const chats = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate(),
        })) as Chat[];

        const groupsMap = new Map<string, ChatGroup>();

        for (const chat of chats) {
          const otherUserId = chat.senderId === user.id ? chat.receiverId : chat.senderId;
          
          if (!groupsMap.has(otherUserId)) {
            const userDoc = await getDocs(query(collection(db, 'users'), where('__name__', '==', otherUserId)));
            const userData = userDoc.docs[0]?.data();
            const userName = userData ? `${userData.firstName} ${userData.lastName}` : 'Unknown User';

            groupsMap.set(otherUserId, {
              userId: otherUserId,
              userName,
              lastMessage: chat.content,
              lastMessageTime: chat.timestamp,
              unreadCount: chat.receiverId === user.id && !chat.isRead ? 1 : 0,
              rideId: chat.rideId,
            });
          } else {
            const group = groupsMap.get(otherUserId)!;
            if (chat.receiverId === user.id && !chat.isRead) {
              group.unreadCount++;
            }
          }
        }

        setChatGroups(Array.from(groupsMap.values()));
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [user]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading messages...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Messages</h1>
          <p className="text-neutral-600">Chat with drivers and passengers</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          {chatGroups.length === 0 ? (
            <div className="p-12 text-center">
              <MessageCircle className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
              <p className="text-neutral-600 text-lg mb-2">No messages yet</p>
              <p className="text-neutral-500 text-sm">
                Start a conversation by booking a ride or creating one
              </p>
            </div>
          ) : (
            <div className="divide-y divide-neutral-200">
              {chatGroups.map((group) => (
                <button
                  key={group.userId}
                  className="w-full p-4 hover:bg-neutral-50 transition text-left"
                  onClick={() => alert('Chat interface would open here with real-time messaging')}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-semibold">
                            {group.userName.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold">{group.userName}</div>
                          <div className="text-sm text-neutral-600 truncate">
                            {group.lastMessage}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-neutral-500 mb-1">
                        {new Date(group.lastMessageTime).toLocaleDateString()}
                      </div>
                      {group.unreadCount > 0 && (
                        <span className="inline-block px-2 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full">
                          {group.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-900">
            <strong>Note:</strong> Full real-time chat functionality requires WebSocket integration or Firebase Realtime Database listeners. 
            This interface shows the message list structure. Click on a conversation to open the chat (feature placeholder).
          </p>
        </div>
      </div>
    </div>
  );
}
