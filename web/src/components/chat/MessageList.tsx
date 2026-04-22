import { useEffect, useRef, useCallback, useMemo } from 'react';
import { MessageBubble } from './MessageBubble';
import { useMessageStore } from '@/stores/messageStore';
import { useAuthStore } from '@/stores/authStore';
import { useChannelStore } from '@/stores/channelStore';
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
        await messageService.toggleReaction(messageId, emoji);
      } catch (err) {
        console.error('Reaction toggle failed:', err);
      }
    },
    [channelId],
  );

  const lastSelfMessageIndex = useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].sender_id === currentUserId) return i;
    }
    return -1;
  }, [messages, currentUserId]);

  const channel = useChannelStore((s) => s.channels.find((c) => c.id === channelId));
  const maxOtherReadId = channel?.max_other_read_id || 0;

  const lastMarkedReadIdRef = useRef<number>(0);

  // Automatically mark the last incoming message as read when it appears
  useEffect(() => {
    const lastIncomingMessage = [...messages].reverse().find((m) => m.sender_id !== currentUserId);
    if (
      lastIncomingMessage &&
      lastIncomingMessage.id > 0 &&
      lastIncomingMessage.id > lastMarkedReadIdRef.current
    ) {
      lastMarkedReadIdRef.current = lastIncomingMessage.id;
      messageService.markAsRead(lastIncomingMessage.id).catch(console.error);
    }
  }, [messages, currentUserId]);

  const messageElements = useMemo(
    () =>
      messages.map((msg, index) => {
        let hideHeader = false;
        if (index > 0) {
          const prevMsg = messages[index - 1];
          if (prevMsg.sender_id === msg.sender_id) {
            const prevTime = new Date(prevMsg.created_at).getTime();
            const currTime = new Date(msg.created_at).getTime();
            const diffMinutes = (currTime - prevTime) / (1000 * 60);
            if (diffMinutes <= 5) {
              hideHeader = true;
            }
          }
        }
        return (
          <div key={msg._tempId ?? msg.id} className={index === 0 ? '' : (hideHeader ? 'mt-0.5' : 'mt-8')}>
            <MessageBubble
              message={msg}
              isSelf={msg.sender_id === currentUserId}
              onReactionToggle={handleReactionToggle}
              hideHeader={hideHeader}
              isLastSelfMessage={index === lastSelfMessageIndex}
              isRead={msg.id <= maxOtherReadId}
            />
          </div>
        );
      }),
    [messages, currentUserId, handleReactionToggle, lastSelfMessageIndex, maxOtherReadId],
  );

  return (
    <div
      ref={containerRef}
      className="flex-grow overflow-y-auto px-8 pt-6 pb-36 no-scrollbar"
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
