import { api } from './api';
import type { Message } from '@/types';
import type { ApiResponse } from '@/types/api';

interface MessagesResponse {
  messages: Message[];
  nextCursor: string | null;
  hasMore: boolean;
}

export const messageService = {
  /** GET /api/channels/:channelId/messages/?cursor=&limit= */
  async getMessages(
    channelId: string,
    cursor?: string | null,
    limit = 20,
  ): Promise<MessagesResponse> {
    const params: Record<string, string | number> = { limit };
    if (cursor) params.cursor = cursor;

    const { data } = await api.get<ApiResponse<MessagesResponse>>(
      `/channels/${channelId}/messages/`,
      { params },
    );
    return data.data;
  },

  /** POST /api/channels/:channelId/messages/ */
  async sendMessage(channelId: string, content: string): Promise<Message> {
    const { data } = await api.post<ApiResponse<Message>>(
      `/channels/${channelId}/messages/`,
      { content },
    );
    return data.data;
  },

  /** PUT /api/channels/:channelId/messages/:id */
  async updateMessage(
    channelId: string,
    messageId: number,
    content: string,
  ): Promise<Message> {
    const { data } = await api.put<ApiResponse<Message>>(
      `/channels/${channelId}/messages/${messageId}`,
      { content },
    );
    return data.data;
  },

  /** DELETE /api/channels/:channelId/messages/:id */
  async deleteMessage(channelId: string, messageId: number): Promise<void> {
    await api.delete(`/channels/${channelId}/messages/${messageId}`);
  },

  /** POST /api/channels/:channelId/messages/:id/read */
  async markAsRead(channelId: string, messageId: number): Promise<void> {
    await api.post(`/channels/${channelId}/messages/${messageId}/read`);
  },

  /** POST /api/channels/:channelId/messages/:id/reactions */
  async toggleReaction(
    channelId: string,
    messageId: number,
    emoji: string,
  ): Promise<void> {
    await api.post(`/channels/${channelId}/messages/${messageId}/reactions`, {
      emoji,
    });
  },
};
