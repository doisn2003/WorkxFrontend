import { create } from 'zustand';
import type { Channel } from '@/types';
import { channelService } from '@/services/channelService';

interface ChannelState {
  channels: Channel[];
  activeChannelId: string | null;
  isLoading: boolean;
  error: string | null;

  fetchChannels: () => Promise<void>;
  setActiveChannel: (id: string | null) => void;
  updateUnreadCount: (channelId: string, count: number) => void;
  updateChannelMaxOtherReadId: (channelId: string, messageId: number) => void;

  // Derived selectors
  getProjectChannels: () => Channel[];
  getPublicChannels: () => Channel[];
  getDirectChannels: () => Channel[];
  getActiveChannel: () => Channel | undefined;
}

export const useChannelStore = create<ChannelState>((set, get) => ({
  channels: [],
  activeChannelId: null,
  isLoading: false,
  error: null,

  fetchChannels: async () => {
    set({ isLoading: true, error: null });
    try {
      const channels = await channelService.getChannels();
      set({ channels, isLoading: false });
    } catch (err) {
      set({ error: 'Không thể tải danh sách kênh', isLoading: false });
      console.error('fetchChannels failed:', err);
    }
  },

  setActiveChannel: (id) => set({ activeChannelId: id }),

  updateUnreadCount: (channelId, count) =>
    set((state) => ({
      channels: state.channels.map((ch) =>
        ch.id === channelId ? { ...ch, unread_count: count } : ch,
      ),
    })),

  updateChannelMaxOtherReadId: (channelId, messageId) =>
    set((state) => ({
      channels: state.channels.map((ch) => {
        if (ch.id === channelId) {
          const currentMax = ch.max_other_read_id || 0;
          if (messageId > currentMax) {
            return { ...ch, max_other_read_id: messageId };
          }
        }
        return ch;
      }),
    })),

  getProjectChannels: () => get().channels.filter((ch) => ch.type === 'PROJECT'),
  getPublicChannels: () => get().channels.filter((ch) => ch.type === 'PUBLIC'),
  getDirectChannels: () => get().channels.filter((ch) => ch.type === 'DIRECT'),
  getActiveChannel: () => get().channels.find((ch) => ch.id === get().activeChannelId),
}));
