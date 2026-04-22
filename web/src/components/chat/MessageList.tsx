import { useEffect, useRef, useCallback, useMemo } from 'react';
import { MessageBubble } from './MessageBubble';
import { useMessageStore } from '@/stores/messageStore';
import { useAuthStore } from '@/stores/authStore';
import { messageService } from '@/services/messageService';
import { Icon } from '@/components/common/Icon';

const EMPTY_MESSAGES: never[] = [];

interface MessageListProps {
  channelId: string;
}

/**
 * Message list with infinite scroll up for older messages.
 * Auto-scrolls to bottom on new messages.
 */
export function MessageList({ channelId }: MessageListProps) {
  const messages = useMessageStore(
    (s) => s.messagesByChannel[channelId] ?? EMPTY_MESSAGES,
  );
  const isLoading = useMessageStore((s) => s.isLoading);
  const currentUserId = useAuthStore((s) => s.user?.id);

  const bottomRef = useRef<HTMLDivElement>(null);
  const topSentinelRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const prevLengthRef = useRef(0);

  // Stable reference for messages length
  const messagesLength = messages.length;

  // Auto-scroll to bottom when new messages arrive or on initial load
  useEffect(() => {
    if (messagesLength > prevLengthRef.current) {
      const isInitialLoad = prevLengthRef.current === 0 && messagesLength > 0;
      const isNewMessage = messagesLength - prevLengthRef.current <= 2;
      if (isNewMessage || isInitialLoad) {
        bottomRef.current?.scrollIntoView(isInitialLoad ? undefined : { behavior: 'smooth' });
      }
    }
    prevLengthRef.current = messagesLength;
  }, [messagesLength]);

  // Initial scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView();
  }, [channelId]);

  // Intersection Observer for infinite scroll up
  const observerCallback = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const state = useMessageStore.getState();
      if (
        entries[0]?.isIntersecting &&
        (state.hasMoreByChannel[channelId] ?? false) &&
        !state.isLoading
      ) {
        state.fetchOlderMessages(channelId);
      }
    },
    [channelId],
  );

  useEffect(() => {
    const sentinel = topSentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(observerCallback, {
      root: containerRef.current,
      threshold: 0.1,
    });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [observerCallback]);

  const handleReactionToggle = useCallback(
    async (messageId: number, emoji: string) => {
      try {
        await messageService.toggleReaction(channelId, messageId, emoji);
      } catch (err) {
        console.error('Reaction toggle failed:', err);
      }
    },
    [channelId],
  );

  const messageElements = useMemo(
    () =>
      messages.map((msg) => (
        <MessageBubble
          key={msg._tempId ?? msg.id}
          message={msg}
          isSelf={msg.sender_id === currentUserId}
          onReactionToggle={handleReactionToggle}
        />
      )),
    [messages, currentUserId, handleReactionToggle],
  );

  return (
    <div
      ref={containerRef}
      className="flex-grow overflow-y-auto px-8 pt-6 pb-36 space-y-8 no-scrollbar"
    >
      {/* Top sentinel for infinite scroll */}
      <div ref={topSentinelRef} className="h-1" />

      {/* Loading spinner */}
      {isLoading && (
        <div className="flex justify-center py-4">
          <div className="w-6 h-6 border-2 border-zinc-200 border-t-zinc-500 rounded-full animate-spin" />
        </div>
      )}

      {/* Empty state */}
      {!isLoading && messagesLength === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-zinc-50 flex items-center justify-center mb-4">
            <Icon name="chat_bubble_outline" size={32} className="text-zinc-300" />
          </div>
          <p className="text-sm text-zinc-400">Chưa có tin nhắn nào. Hãy bắt đầu cuộc trò chuyện!</p>
        </div>
      )}

      {/* Messages */}
      {messageElements}

      {/* Bottom anchor for auto-scroll */}
      <div ref={bottomRef} />
    </div>
  );
}
