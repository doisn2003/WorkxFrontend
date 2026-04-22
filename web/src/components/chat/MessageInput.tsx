import { useState, useRef, useCallback, useMemo, type KeyboardEvent } from 'react';
import { Icon } from '@/components/common/Icon';
import { useMessageStore } from '@/stores/messageStore';
import { useAuthStore } from '@/stores/authStore';
import { useTypingIndicator } from '@/hooks/useTypingIndicator';
import { TypingIndicator } from './TypingIndicator';
import { getSocket } from '@/services/socket';

interface MessageInputProps {
  channelId: string;
  channelName?: string;
  /** Map of userId → display name, for typing indicator */
  userNameMap?: Record<string, string>;
}

/**
 * Chat compose bar — matches code.html lines 287-306.
 * Enter to send, Shift+Enter for newline.
 * Integrates typing indicator.
 */
export function MessageInput({ channelId, channelName, userNameMap = {} }: MessageInputProps) {
  const [text, setText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const isSending = useMessageStore((s) => s.isSending);
  const userId = useAuthStore((s) => s.user?.id);

  const { typingUserIds, emitTyping } = useTypingIndicator(channelId);

  const handleSend = useCallback(() => {
    const content = text.trim();
    if (!content || !userId) return;
    useMessageStore.getState().sendMessage(channelId, content, userId);
    setText('');
    inputRef.current?.focus();
    
    // Clear typing status immediately after sending
    const socket = getSocket();
    if (socket) {
      socket.emit('typing:stop', { channel_id: channelId });
    }
  }, [text, channelId, userId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
    emitTyping();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const placeholder = channelName
    ? `Nhập tin nhắn tới #${channelName}...`
    : 'Nhập tin nhắn...';

  const messages = useMessageStore((s) => s.messagesByChannel[channelId]) || [];
  
  // Extract user names from loaded messages
  const extractedUserNameMap = useMemo(() => {
    const map = { ...userNameMap };
    messages.forEach((m) => {
      if (!map[m.sender_id]) {
        if (m.sender_first_name) {
          map[m.sender_id] = m.sender_family_name 
            ? `${m.sender_family_name} ${m.sender_first_name}`.trim() 
            : m.sender_first_name;
        } else if (m.sender) {
          map[m.sender_id] = `${m.sender.family_and_middle_name} ${m.sender.first_name}`.trim();
        }
      }
    });
    return map;
  }, [messages, userNameMap]);

  // Resolve typing user IDs to display names
  const typingUserNames = useMemo(
    () => typingUserIds.map((id) => extractedUserNameMap[id] ?? 'Ai đó'),
    [typingUserIds, extractedUserNameMap],
  );

  return (
    <div className="absolute bottom-0 w-full bg-gradient-to-t from-white via-white to-transparent pt-12 pb-8 px-8 z-10">
      {/* Typing indicator */}
      <TypingIndicator userNames={typingUserNames} />

      <div className="relative bg-white shadow-float rounded-full flex items-center gap-4 px-6 py-4 border border-zinc-100 focus-within:border-primary/20 transition-all">
        {/* Attach button */}
        <button className="text-zinc-400 hover:text-zinc-900 transition-colors flex-shrink-0">
          <Icon name="add" />
        </button>

        {/* Input */}
        <input
          ref={inputRef}
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className="flex-grow border-none focus:ring-0 text-sm bg-transparent placeholder-zinc-400 outline-none"
          placeholder={placeholder}
          type="text"
        />

        {/* Actions */}
        <div className="flex items-center gap-3 border-l border-zinc-100 pl-4 flex-shrink-0">
          <button className="text-zinc-400 hover:text-zinc-900 transition-colors">
            <Icon name="sentiment_satisfied" />
          </button>
          <button className="text-zinc-400 hover:text-zinc-900 transition-colors hidden sm:block">
            <Icon name="format_bold" />
          </button>
          <button
            onClick={handleSend}
            disabled={!text.trim() || isSending}
            className="primary-gradient text-white w-9 h-9 rounded-full flex items-center justify-center hover:scale-105 transition-transform active:scale-95 shadow-md disabled:opacity-40 disabled:hover:scale-100"
          >
            <Icon name="send" className="scale-75 ml-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
