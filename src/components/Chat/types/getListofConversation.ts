export interface GetListOfConversationResponse {
    conversationUsers: ConversationUserConnection;
  }
  
  export interface ConversationUserConnection {
    nodes: ConversationUserNode[];
  }
  
  export interface ConversationUserNode {
    id: string;
    conversationId: string;
    conversation: Conversation;
  }
  
  export interface Conversation {
    updatedAt: string; // Date as string in ISO format
    createdAt: string; // Date as string in ISO format
    conversationUsers: ConversationUserConnection;
    messages: MessageConnection;
  }
  
  export interface MessageConnection {
    nodes: MessageNode[];
  }
  
  export interface MessageNode {
    conversationId: string;
    senderId: string;
    createdAt: string; // Date as string in ISO format
    messageText: string;
  }
  
  export interface ConversationUserNode {
    userId: string;
    user: User;
  }
  
  export interface User {
    name: string;
    profile: Profile;
  }
  
  export interface Profile {
    photo: string | null; // Photo URL or null if not available
  }
  