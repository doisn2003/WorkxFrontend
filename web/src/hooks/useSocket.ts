import { useEffect, useRef } from 'react';
import { connectSocket, disconnectSocket } from '@/services/socket';
import { useAuthStore } from '@/stores/authStore';
import { useMessageStore } from '@/stores/messageStore';
import { usePresenceStore } from '@/stores/presenceStore';
import { useChannelStore } from '@/stores/channelStore';
import { getAccessToken } from '@/services/api';
import type { Message, PresenceStatus } from '@/types';

/**
 * Central socket hook — connects on login, disconnects on logout.
 * Routes all server events to the appropriate stores.
 * Mount once in AppLayout.
 */
export function useSocket() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const connectedRef = useRef(false);

  useEffect(() => {
    if (!isAuthenticated) {
      disconnectSocket();
      connectedRef.current = false;
      return;
    }

    const token = getAccessToken();
    if (!token || connectedRef.current) return;

    const socket = connectSocket(token);
    connectedRef.current = true;

    // ─── Message Events ─────────────────────────
    socket.on('message:new', (data: { message: Message; channel_id: string }) => {
      const currentUserId = useAuthStore.getState().user?.id;
      // Skip if message was sent by us (already handled optimistically)
      if (data.message.sender_id === currentUserId) return;

      useMessageStore.getState().addMessage(data.channel_id, data.message);

      // Update unread count if not the active channel
      const activeChannelId = useChannelStore.getState().activeChannelId;
      if (data.channel_id !== activeChannelId) {
        const channels = useChannelStore.getState().channels;
        const channel = channels.find((ch) => ch.id === data.channel_id);
        if (channel) {
          useChannelStore
            .getState()
            .updateUnreadCount(data.channel_id, (channel.unread_count ?? 0) + 1);
        }
      }
    });

    socket.on('message:updated', (data: { message: Message }) => {
      useMessageStore
        .getState()
        .updateMessage(data.message.channel_id, data.message);
    });

    socket.on('message:deleted', (data: { message_id: number; channel_id: string }) => {
      useMessageStore
        .getState()
        .removeMessage(data.channel_id, data.message_id);
    });

    socket.on('message:read', (data: { channel_id: string; message_id: number; user_id: string }) => {
      const currentUserId = useAuthStore.getState().user?.id;
      if (data.user_id !== currentUserId) {
        useChannelStore.getState().updateChannelMaxOtherReadId(data.channel_id, data.message_id);
      }
    });

    // ─── Presence Events ────────────────────────
    socket.on('presence:changed', (data: { user_id: string; status: PresenceStatus }) => {
      usePresenceStore.getState().setStatus(data.user_id, data.status);
    });

    // ─── Cleanup on unmount ─────────────────────
    return () => {
      disconnectSocket();
      connectedRef.current = false;
    };
  }, [isAuthenticated]);
}
