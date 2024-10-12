import { create } from 'zustand';
import { UserProfile } from '@auth0/nextjs-auth0/client';

// Define types for Message and Conversation
interface Message {
  id: string;
  text: string | null | undefined;
  isSender: boolean;
  createdAt: string;
}

interface Conversation {
  conversationID: string;
  receiverID: string;
  name: string;
  lastMessage: string;
  time: string;
  avatar: string;
  conversationUpdatedDate: Date;
}

// ChatState interface to hold chats and messages
interface ChatState {
  chatList: Conversation[];  // List of conversations
  messages: { [key: string]: Message[] };  // Messages grouped by conversationID
  addMessage: (conversationID: string, message: Message) => void;
  addConversation: (conversation: Conversation) => void;
  updateChatList: (conversations: Conversation[]) => void;
}

// UserState extends ChatState to also handle user-related state
interface UserState extends ChatState {
  userId: string | null;
  setUserId: (id: string | null) => void;
  userAuth: UserProfile | null;
  setUserAuth: (auth: UserProfile | null) => void;
  clearUserId: () => void;
}

// Zustand store implementation
export const useUserStore = create<UserState>((set) => ({
  // User state
  userId: null,
  setUserId: (id) => {
    set({ userId: id });
  },
  userAuth: null,
  setUserAuth: (auth) => {
    set({ userAuth: auth });
  },
  clearUserId: () => {
    set({ userId: null, userAuth: null });
  },

  // Chat state
  chatList: [],
  messages: {},

  // Add a message to a specific conversation
  addMessage: (conversationID: string, message: Message) => {
    set((state) => ({
      messages: {
        ...state.messages,
        [conversationID]: [...(state.messages[conversationID] || []), message],
      },
    }));
  },

  // Add a new conversation
  addConversation: (conversation: Conversation) => {
    set((state) => ({
      chatList: [...state.chatList, conversation],
    }));
  },

  updateChatList: (conversations: Conversation[]) => {
    set((state) => ({
      chatList: conversations.filter(
        (newChat) => !state.chatList.some((chat) => chat.conversationID === newChat.conversationID)
      ),
    }));
  },
}));
