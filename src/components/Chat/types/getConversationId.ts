export interface MessageNode {
    id: string;
    conversationId: string;
    senderId: string;
    messageText: string;
    mediaUrl: string | null;
    isRead: boolean;
    readAt: string | null;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface MessageConnection {
    nodes: MessageNode[];
  }
  
  export interface Conversation {
    messages: MessageConnection;
  }
  
  export interface ConversationUserNode {
    id: string;
    userId: string;
    conversationId: string;
    conversation: Conversation;
  }
  
  export interface ConversationUsersConnection {
    nodes: ConversationUserNode[];
  }
  
  export interface GetConversationIdResponse {
    conversations: ConversationUsersConnection;
  }
  