import { create } from 'zustand';
import type { Message } from '@/types';
import { messageService } from '@/services/messageService';
import { useAuthStore } from '@/stores/authStore';

interface MessageState {
  messagesByChannel: Record<string, Message[]>;
  cursorByChannel: Record<string, string | null>;
  hasMoreByChannel: Record<string, boolean>;
  isLoading: boolean;
  isSending: boolean;

  fetchMessages: (channelId: string) => Promise<void>;
  fetchOlderMessages: (channelId: string) => Promise<void>;
  sendMessage: (channelId: string, content: string, senderId: string) => Promise<void>;
  addMessage: (channelId: string, message: Message) => void;
  updateMessage: (channelId: string, message: Message) => void;
  removeMessage: (channelId: string, messageId: number) => void;
  clearChannel: (channelId: string) => void;
}

let tempIdCounter = 0;

export const useMessageStore = create<MessageState>((set, get) => ({
  messagesByChannel: {},
  cursorByChannel: {},
  hasMoreByChannel: {},
  isLoading: false,
  isSending: false,

  fetchMessages: async (channelId) => {
    set({ isLoading: true });
    try {
      const result = await messageService.getMessages(channelId);
      // API returns newest first; reverse to oldest→newest for display
      const messages = [...result.messages].reverse();
      set((state) => ({
        messagesByChannel: { ...state.messagesByChannel, [channelId]: messages },
        cursorByChannel: { ...state.cursorByChannel, [channelId]: result.nextCursor },
        hasMoreByChannel: { ...state.hasMoreByChannel, [channelId]: result.hasMore },
        isLoading: false,
      }));
    } catch (err) {
      console.error('fetchMessages failed:', err);
      set({ isLoading: false });
    }
  },

  fetchOlderMessages: async (channelId) => {
    const cursor = get().cursorByChannel[channelId];
    const hasMore = get().hasMoreByChannel[channelId];
    if (!hasMore || get().isLoading) return;

    set({ isLoading: true });
    try {
      const result = await messageService.getMessages(channelId, cursor);
      const olderMessages = [...result.messages].reverse();
      set((state) => ({
        messagesByChannel: {
          ...state.messagesByChannel,
          [channelId]: [...olderMessages, ...(state.messagesByChannel[channelId] ?? [])],
        },
        cursorByChannel: { ...state.cursorByChannel, [channelId]: result.nextCursor },
        hasMoreByChannel: { ...state.hasMoreByChannel, [channelId]: result.hasMore },
        isLoading: false,
      }));
    } catch (err) {
      console.error('fetchOlderMessages failed:', err);
      set({ isLoading: false });
    }
  },

  sendMessage: async (channelId, content, senderId) => {
    const tempId = `temp_${++tempIdCounter}`;
    const user = useAuthStore.getState().user;
    const optimistic: Message = {
      id: -1,
      channel_id: channelId,
      sender_id: senderId,
      content,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      _status: 'pending',
      _tempId: tempId,
      sender_first_name: user?.first_name,
      sender_family_name: user?.family_and_middle_name,
      sender_avatar: user?.avatar_url,
    };

    // Add optimistically
    set((state) => ({
      messagesByChannel: {
        ...state.messagesByChannel,
        [channelId]: [...(state.messagesByChannel[channelId] ?? []), optimistic],
      },
      isSending: true,
    }));

    try {
      const confirmedMsg = await messageService.sendMessage(channelId, content);
      // Replace optimistic with confirmed, preserving optimistic sender info if missing
      set((state) => ({
        messagesByChannel: {
          ...state.messagesByChannel,
          [channelId]: (state.messagesByChannel[channelId] ?? []).map((m) => {
            if (m._tempId === tempId) {
              return {
                ...m, // Keep optimistic fields
                ...confirmedMsg, 
                _status: 'confirmed' as const,
                // Explicitly retain sender info if backend doesn't return it immediately
                sender_first_name: confirmedMsg.sender_first_name ?? m.sender_first_name,
                sender_family_name: confirmedMsg.sender_family_name ?? m.sender_family_name,
                sender_avatar: confirmedMsg.sender_avatar ?? m.sender_avatar,
              };
            }
            return m;
          }),
        },
        isSending: false,
      }));
    } catch {
      // Mark as failed
      set((state) => ({
        messagesByChannel: {
          ...state.messagesByChannel,
          [channelId]: (state.messagesByChannel[channelId] ?? []).map((m) =>
            m._tempId === tempId ? { ...m, _status: 'failed' as const } : m,
          ),
        },
        isSending: false,
      }));
    }
  },

  addMessage: (channelId, message) =>
    set((state) => {
      const existing = state.messagesByChannel[channelId] ?? [];
      // Avoid duplicates (socket event may arrive after optimistic add)
      if (existing.some((m) => m.id === message.id)) return state;
      return {
        messagesByChannel: {
          ...state.messagesByChannel,
          [channelId]: [...existing, message],
        },
      };
    }),

  updateMessage: (channelId, message) =>
    set((state) => ({
      messagesByChannel: {
        ...state.messagesByChannel,
        [channelId]: (state.messagesByChannel[channelId] ?? []).map((m) =>
          m.id === message.id ? { ...m, ...message } : m,
        ),
      },
    })),

  removeMessage: (channelId, messageId) =>
    set((state) => ({
      messagesByChannel: {
        ...state.messagesByChannel,
        [channelId]: (state.messagesByChannel[channelId] ?? []).filter(
          (m) => m.id !== messageId,
        ),
      },
    })),

  clearChannel: (channelId) =>
    set((state) => {
      const { [channelId]: _, ...rest } = state.messagesByChannel;
      return { messagesByChannel: rest };
    }),
}));
