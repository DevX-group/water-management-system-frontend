import { api } from '@/services/api';
import type {
  ConversationSummary,
  CreateConversationRequest,
  InternalChatFilters,
  InternalChatMessage,
  InternalChatUser,
  SendMessageRequest,
} from '@/types/internalChat';

const buildParams = ({ role, search }: InternalChatFilters) => ({
  ...(role ? { role } : {}),
  ...(search?.trim() ? { search: search.trim() } : {}),
});

export const internalChatService = {
  async findStaff(filters: InternalChatFilters = {}) {
    const response = await api.get<InternalChatUser[]>('/internal-chat/users', {
      params: buildParams(filters),
    });
    return response.data;
  },

  async listConversations(filters: InternalChatFilters = {}) {
    const response = await api.get<ConversationSummary[]>('/internal-chat/conversations', {
      params: buildParams(filters),
    });
    return response.data;
  },

  async createConversation(request: CreateConversationRequest) {
    const response = await api.post<ConversationSummary>('/internal-chat/conversations', request);
    return response.data;
  },

  async getMessages(conversationId: string, page = 0, size = 30) {
    const response = await api.get<InternalChatMessage[]>(
      `/internal-chat/conversations/${conversationId}/messages`,
      { params: { page, size } },
    );
    return response.data;
  },

  async sendMessage(conversationId: string, request: SendMessageRequest) {
    const response = await api.post<InternalChatMessage>(
      `/internal-chat/conversations/${conversationId}/messages`,
      request,
    );
    return response.data;
  },

  async markAsRead(conversationId: string) {
    await api.post(`/internal-chat/conversations/${conversationId}/read`);
  },
};
