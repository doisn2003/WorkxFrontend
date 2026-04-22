import { useEffect, useRef, useCallback, useState } from 'react';
import { getSocket } from '@/services/socket';

interface TypingUser {
  user_id: string;
  channel_id: string;
}

/**
 * Hook for typing indicator — emits typing:start/stop and tracks typing users.
 * Debounce 300ms, auto-clear after 3s.
 */
export function useTypingIndicator(channelId: string | undefined) {
  const [typingUserIds, setTypingUserIds] = useState<string[]>([]);
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clearTimersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  // Listen for typing events from other users
  useEffect(() => {
    const socket = getSocket();
    if (!socket || !channelId) return;

    const handleTypingStart = (data: TypingUser) => {
      if (data.channel_id !== channelId) return;

      setTypingUserIds((prev) =>
        prev.includes(data.user_id) ? prev : [...prev, data.user_id],
      );

      // Auto-clear after 3s if no typing:stop received
      const existing = clearTimersRef.current.get(data.user_id);
      if (existing) clearTimeout(existing);
      clearTimersRef.current.set(
        data.user_id,
        setTimeout(() => {
          setTypingUserIds((prev) => prev.filter((id) => id !== data.user_id));
          clearTimersRef.current.delete(data.user_id);
        }, 3000),
      );
    };

    const handleTypingStop = (data: TypingUser) => {
      if (data.channel_id !== channelId) return;
      setTypingUserIds((prev) => prev.filter((id) => id !== data.user_id));
      const existing = clearTimersRef.current.get(data.user_id);
      if (existing) {
        clearTimeout(existing);
        clearTimersRef.current.delete(data.user_id);
      }
    };

    socket.on('typing:start', handleTypingStart);
    socket.on('typing:stop', handleTypingStop);

    return () => {
      socket.off('typing:start', handleTypingStart);
      socket.off('typing:stop', handleTypingStop);
      // Clear all timers
      clearTimersRef.current.forEach((timer) => clearTimeout(timer));
      clearTimersRef.current.clear();
      setTypingUserIds([]);
    };
  }, [channelId]);

  // Emit typing events (debounced)
  const emitTyping = useCallback(() => {
    const socket = getSocket();
    if (!socket || !channelId) return;

    socket.emit('typing:start', { channel_id: channelId });

    // Clear previous stop timer
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);

    // Auto-stop after 3s of no input
    typingTimerRef.current = setTimeout(() => {
      socket.emit('typing:stop', { channel_id: channelId });
    }, 3000);
  }, [channelId]);

  // Send stop when component unmounts
  useEffect(() => {
    return () => {
      if (typingTimerRef.current) {
        clearTimeout(typingTimerRef.current);
        const socket = getSocket();
        if (socket && channelId) {
          socket.emit('typing:stop', { channel_id: channelId });
        }
      }
    };
  }, [channelId]);

  return { typingUserIds, emitTyping };
}
