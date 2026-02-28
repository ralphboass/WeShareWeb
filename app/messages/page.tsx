'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Chat } from '@/types';
import { MessageCircle, Search } from 'lucide-react';
import ChatModal from '@/components/ChatModal';

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
  const [selectedChat, setSelectedChat] = useState<ChatGroup | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;

    const chatsRef = collection(db, 'chats');
    const q = query(
      chatsRef,
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const chats = snapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate(),
        }))
        .filter((chat: any) => 
          chat.senderId === user.id || chat.receiverId === user.id
        ) as Chat[];

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
      setLoading(false);
    });

    return () => unsubscribe();
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

  const filteredGroups = chatGroups.filter(group =>
    group.userName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Messages</h1>
          <p className="text-neutral-600">Chat with drivers and passengers about your rides</p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {filteredGroups.length === 0 ? (
            <div className="p-16 text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-10 h-10 text-blue-600" />
              </div>
              <p className="text-neutral-900 text-xl font-semibold mb-2">
                {chatGroups.length === 0 ? 'No messages yet' : 'No results found'}
              </p>
              <p className="text-neutral-500">
                {chatGroups.length === 0 
                  ? 'Start a conversation by messaging a driver about their ride'
                  : 'Try a different search term'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-neutral-100">
              {filteredGroups.map((group) => (
                <button
                  key={group.userId}
                  className="w-full p-5 hover:bg-blue-50 transition-all text-left group"
                  onClick={() => setSelectedChat(group)}
                >
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-lg">
                          {group.userName.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      {group.unreadCount > 0 && (
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                          {group.unreadCount}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-neutral-900 group-hover:text-blue-600 transition">
                          {group.userName}
                        </h3>
                        <span className="text-xs text-neutral-500">
                          {new Date(group.lastMessageTime).toLocaleDateString([], { 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </span>
                      </div>
                      <p className="text-sm text-neutral-600 truncate">
                        {group.lastMessage}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chat Modal */}
      {selectedChat && (
        <ChatModal
          rideId={selectedChat.rideId || ''}
          otherUserId={selectedChat.userId}
          otherUserName={selectedChat.userName}
          onClose={() => setSelectedChat(null)}
        />
      )}
    </div>
  );
}
