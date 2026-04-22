import { api } from './api';
import type { Channel } from '@/types';
import type { ApiResponse } from '@/types/api';

export const channelService = {
  /** GET /api/channels/ — All channels for current user */
  async getChannels(): Promise<Channel[]> {
    const { data } = await api.get<ApiResponse<Channel[]>>('/channels/');
    return data.data;
  },

  /** GET /api/channels/:id — Single channel details */
  async getChannel(id: string): Promise<Channel> {
    const { data } = await api.get<ApiResponse<Channel>>(`/channels/${id}`);
    return data.data;
  },

  /** POST /api/channels/direct — Create or get existing DM channel */
  async createDirectChannel(targetUserId: string): Promise<Channel> {
    const { data } = await api.post<ApiResponse<Channel>>('/channels/direct', {
      targetUserId,
    });
    return data.data;
  },

  /** POST /api/channels/public — Create a public channel (admin) */
  async createPublicChannel(name: string): Promise<Channel> {
    const { data } = await api.post<ApiResponse<Channel>>('/channels/public', {
      name,
    });
    return data.data;
  },
};
