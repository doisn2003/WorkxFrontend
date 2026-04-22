import { Avatar } from '@/components/common/Avatar';
import { AttachmentPreview } from './AttachmentPreview';
import { ReactionBar } from './ReactionBar';
import { ReadReceipt } from './ReadReceipt';
import { formatMessageTime } from '@/utils/formatDate';
import { cn } from '@/utils/cn';
import type { Message } from '@/types';

interface MessageBubbleProps {
  message: Message;
  isSelf: boolean;
  onReactionToggle?: (messageId: number, emoji: string) => void;
  hideHeader?: boolean;
  isLastSelfMessage?: boolean;
  isRead?: boolean;
}

/**
 * Single message bubble — matches code.html lines 230-283.
 * Self messages: flex-row-reverse, dark bg, rounded-tr-sm.
 * Others: flex-row, light bg.
 */
export function MessageBubble({ message, isSelf, onReactionToggle, hideHeader, isLastSelfMessage, isRead }: MessageBubbleProps) {
  const senderName = message.sender_first_name
    ? `${message.sender_family_name ?? ''} ${message.sender_first_name}`.trim()
    : message.sender?.family_and_middle_name
      ? `${message.sender.family_and_middle_name} ${message.sender.first_name}`.trim()
      : 'Người dùng';

  const avatarUrl = message.sender_avatar ?? message.sender?.avatar_url;
  const time = formatMessageTime(message.created_at);
  const isPending = message._status === 'pending';
  const isFailed = message._status === 'failed';

  return (
    <div
      className={cn(
        'flex gap-4 group',
        isSelf && 'flex-row-reverse',
        isPending && 'opacity-60',
      )}
    >
      {/* Avatar */}
      {!hideHeader ? (
        <Avatar
          src={avatarUrl}
          name={message.sender_first_name ?? senderName}
          className="mt-1 flex-shrink-0"
        />
      ) : (
        <div className="w-10 h-10 flex-shrink-0" />
      )}

      {/* Content */}
      <div
        className={cn(
          'flex flex-col gap-1 max-w-2xl',
          isSelf && 'items-end',
        )}
      >
        {/* Name + Time */}
        {!hideHeader && (
          <div className={cn('flex items-center gap-3', isSelf && 'flex-row-reverse')}>
            <span className="text-sm font-bold text-zinc-900">{senderName}</span>
            <span className="text-[10px] text-zinc-400 font-medium">{time}</span>
          </div>
        )}

        {/* Message body */}
        {message.attachments && message.attachments.length > 0 ? (
          <div className={cn('space-y-2', isSelf && 'flex flex-col items-end')}>
            {message.attachments.map((att) => (
              <AttachmentPreview key={att.id} attachment={att} />
            ))}
            {message.content && (
              <p className={cn("text-[0.875rem] text-zinc-700 leading-relaxed px-4", isSelf && "text-right")}>
                {message.content}
              </p>
            )}
          </div>
        ) : (
          <p className={cn("text-[0.875rem] text-zinc-700 leading-relaxed", isSelf && "text-right")}>
            {message.content}
          </p>
        )}

        {/* Reactions */}
        {message.reactions && (
          <ReactionBar
            reactions={message.reactions}
            onToggle={(emoji) => onReactionToggle?.(message.id, emoji)}
          />
        )}

        {/* Read receipt for self messages */}
        {isSelf && isLastSelfMessage && !isPending && !isFailed && <ReadReceipt isRead={isRead} />}

        {/* Failed indicator */}
        {isFailed && (
          <span className="text-[10px] text-error font-medium mt-1">
            Gửi thất bại — nhấn để thử lại
          </span>
        )}
      </div>
    </div>
  );
}
