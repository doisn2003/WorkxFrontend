import { useState, useRef, useCallback, useMemo, useEffect, lazy, Suspense, type KeyboardEvent } from 'react';
import { Icon } from '@/components/common/Icon';
import { useMessageStore } from '@/stores/messageStore';
import { useAuthStore } from '@/stores/authStore';
import { useTypingIndicator } from '@/hooks/useTypingIndicator';
import { TypingIndicator } from './TypingIndicator';
import { getSocket } from '@/services/socket';
import { cn } from '@/utils/cn';
import type { EmojiClickData } from 'emoji-picker-react';

// Lazy load the heavy emoji picker for better performance
const EmojiPicker = lazy(() => import('emoji-picker-react'));

interface MessageInputProps {
  channelId: string;
  channelName?: string;
  /** Map of userId → display name, for typing indicator */
  userNameMap?: Record<string, string>;
}

/**
 * Chat compose bar with formatting toolbar.
 * Enter to send, Shift+Enter for newline.
 * Supports Bold (**), Italic (*), Underline (__) via Markdown syntax.
 */
export function MessageInput({ channelId, channelName, userNameMap = {} }: MessageInputProps) {
  const [text, setText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const emojiButtonRef = useRef<HTMLButtonElement>(null);
  const isSending = useMessageStore((s) => s.isSending);
  const userId = useAuthStore((s) => s.user?.id);

  const { typingUserIds, emitTyping } = useTypingIndicator(channelId);

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`; // max ~5 lines
  }, [text]);

  // Close emoji picker on outside click
  useEffect(() => {
    if (!showEmojiPicker) return;
    const handleClick = (e: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(e.target as Node) &&
        emojiButtonRef.current &&
        !emojiButtonRef.current.contains(e.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showEmojiPicker]);

  const handleSend = useCallback(() => {
    const content = text.trim();
    if (!content || !userId) return;
    useMessageStore.getState().sendMessage(channelId, content, userId);
    setText('');
    textareaRef.current?.focus();

    // Clear typing status immediately after sending
    const socket = getSocket();
    if (socket) {
      socket.emit('typing:stop', { channel_id: channelId });
    }
  }, [text, channelId, userId]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    emitTyping();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleEmojiClick = useCallback((emojiData: EmojiClickData) => {
    const el = textareaRef.current;
    const emoji = emojiData.emoji;
    if (!el) {
      setText((prev) => prev + emoji);
      return;
    }
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const newText = text.slice(0, start) + emoji + text.slice(end);
    setText(newText);
    requestAnimationFrame(() => {
      const newPos = start + emoji.length;
      el.selectionStart = newPos;
      el.selectionEnd = newPos;
      el.focus();
    });
  }, [text]);

  /** Wraps selected text in the textarea with given markers (e.g. ** for bold) */
  const wrapSelection = useCallback((before: string, after: string) => {
    const el = textareaRef.current;
    if (!el) return;

    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = text.slice(start, end);

    // If already wrapped, unwrap
    const textBefore = text.slice(Math.max(0, start - before.length), start);
    const textAfter = text.slice(end, end + after.length);
    if (textBefore === before && textAfter === after) {
      const newText =
        text.slice(0, start - before.length) +
        selected +
        text.slice(end + after.length);
      setText(newText);
      requestAnimationFrame(() => {
        el.selectionStart = start - before.length;
        el.selectionEnd = end - before.length;
        el.focus();
      });
      return;
    }

    const wrapped = `${before}${selected}${after}`;
    const newText = text.slice(0, start) + wrapped + text.slice(end);
    setText(newText);

    requestAnimationFrame(() => {
      el.selectionStart = start + before.length;
      el.selectionEnd = end + before.length;
      el.focus();
    });
  }, [text]);

  const handleBold = useCallback(() => wrapSelection('**', '**'), [wrapSelection]);
  const handleItalic = useCallback(() => wrapSelection('*', '*'), [wrapSelection]);
  const handleUnderline = useCallback(() => wrapSelection('__', '__'), [wrapSelection]);

  const placeholder = channelName
    ? `Nhập tin nhắn tới ${channelName}...`
    : 'Nhập tin nhắn...';

  const channelMessages = useMessageStore((s) => s.messagesByChannel[channelId]);

  // Extract user names from loaded messages
  const extractedUserNameMap = useMemo(() => {
    const msgs = channelMessages || [];
    const map = { ...userNameMap };
    msgs.forEach((m) => {
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
  }, [channelMessages, userNameMap]);

  // Resolve typing user IDs to display names
  const typingUserNames = useMemo(
    () => typingUserIds.map((id) => extractedUserNameMap[id] ?? 'Ai đó'),
    [typingUserIds, extractedUserNameMap],
  );

  return (
    <div className="absolute bottom-0 w-full bg-gradient-to-t from-white via-white to-transparent pt-12 pb-8 px-8 z-10">
      {/* Typing indicator */}
      <TypingIndicator userNames={typingUserNames} />

      <div className="relative bg-white shadow-float rounded-2xl border border-zinc-100 transition-all">
        {/* ─── Toolbar row ─── */}
        <div className="flex items-center gap-0.5 px-3 py-2 border-b border-zinc-100">
          {/* Attach (placeholder) */}
          <button
            type="button"
            title="Đính kèm tệp (sắp ra mắt)"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50 transition-colors cursor-not-allowed opacity-50"
            disabled
          >
            <Icon name="attach_file" size={18} />
          </button>

          {/* Image (placeholder) */}
          <button
            type="button"
            title="Đính kèm ảnh (sắp ra mắt)"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50 transition-colors cursor-not-allowed opacity-50"
            disabled
          >
            <Icon name="image" size={18} />
          </button>

          {/* Divider */}
          <div className="w-px h-5 bg-zinc-200 mx-1.5" />

          {/* Bold */}
          <button
            type="button"
            title="In đậm"
            onClick={handleBold}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 active:bg-zinc-200 transition-colors"
          >
            <span className="text-[13px] font-extrabold leading-none">B</span>
          </button>

          {/* Italic */}
          <button
            type="button"
            title="In nghiêng"
            onClick={handleItalic}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 active:bg-zinc-200 transition-colors"
          >
            <span className="text-[13px] font-semibold italic leading-none font-serif">I</span>
          </button>

          {/* Underline */}
          <button
            type="button"
            title="Gạch chân"
            onClick={handleUnderline}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 active:bg-zinc-200 transition-colors"
          >
            <span className="text-[13px] font-semibold underline underline-offset-2 leading-none">U</span>
          </button>
        </div>

        {/* ─── Compose row ─── */}
        <div className="flex items-end gap-3 px-4 py-3">
          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={text}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            rows={1}
            className={cn(
              'flex-grow resize-none text-sm bg-transparent placeholder-zinc-400',
              'outline-none border-none focus:ring-0 focus:outline-none',
              'leading-relaxed min-h-[24px] max-h-[120px]',
            )}
            placeholder={placeholder}
          />

          {/* Emoji + Send */}
          <div className="flex items-center gap-2 flex-shrink-0 mb-0.5">
            {/* Emoji button */}
            <button
              ref={emojiButtonRef}
              type="button"
              onClick={() => setShowEmojiPicker((v) => !v)}
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center transition-colors',
                showEmojiPicker
                  ? 'text-zinc-700 bg-zinc-100'
                  : 'text-zinc-400 hover:text-zinc-600',
              )}
              title="Biểu tượng cảm xúc"
            >
              <Icon name="sentiment_satisfied" size={20} />
            </button>

            {/* Send button */}
            <button
              type="button"
              onClick={handleSend}
              disabled={!text.trim() || isSending}
              className={cn(
                'primary-gradient text-white w-8 h-8 rounded-full',
                'flex items-center justify-center',
                'hover:scale-105 transition-transform active:scale-95 shadow-md',
                'disabled:opacity-40 disabled:hover:scale-100',
              )}
              title="Gửi tin nhắn"
            >
              <Icon name="send" size={16} className="ml-0.5" />
            </button>
          </div>
        </div>

        {/* ─── Emoji Picker Popup (outside overflow container) ─── */}
        {showEmojiPicker && (
          <div
            ref={emojiPickerRef}
            className="absolute bottom-full mb-2 z-[100] shadow-xl rounded-xl overflow-hidden"
            style={{ right: '1rem' }}
          >
            <Suspense
              fallback={
                <div className="w-[350px] h-[400px] flex items-center justify-center bg-white">
                  <div className="w-6 h-6 border-2 border-zinc-200 border-t-zinc-500 rounded-full animate-spin" />
                </div>
              }
            >
              <EmojiPicker
                onEmojiClick={handleEmojiClick}
                width={350}
                height={400}
                searchPlaceHolder="Tìm emoji..."
                previewConfig={{ showPreview: false }}
              />
            </Suspense>
          </div>
        )}
      </div>
    </div>
  );
}
