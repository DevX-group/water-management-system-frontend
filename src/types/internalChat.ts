import type { AdminRole } from '@/types/admin';

export type InternalChatRoleFilter = 'ALL' | AdminRole;

export interface InternalChatUser {
  id: string;
  fullName: string;
  role: AdminRole;
}

export interface ConversationSummary {
  id: string;
  otherParticipantId: string;
  otherParticipantName: string;
  otherParticipantRole: AdminRole;
  latestMessagePreview: string;
  latestMessageTime: string | null;
  unreadCount: number;
}

export interface InternalChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  content: string;
  createdAt: string;
  read: boolean;
}

export interface InternalChatReadReceipt {
  conversationId: string;
  readerId: string;
  readAt: string;
}

export interface CreateConversationRequest {
  targetUserId: string;
}

export interface SendMessageRequest {
  content: string;
}

export interface InternalChatFilters {
  role?: AdminRole;
  search?: string;
}
