import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ChannelHeader } from '@/components/chat/ChannelHeader';
import { PinnedBanner } from '@/components/chat/PinnedBanner';
import { MessageList } from '@/components/chat/MessageList';
import { MessageInput } from '@/components/chat/MessageInput';
import { Icon } from '@/components/common/Icon';
import { useChannelStore } from '@/stores/channelStore';
import { useMessageStore } from '@/stores/messageStore';

/**
 * ChatPage — displays channel chat or empty state.
 * Reads channelId from URL params → fetches messages.
 */
export function ChatPage() {
  const { channelId } = useParams<{ channelId: string }>();
  const activeChannel = useChannelStore((s) =>
    s.channels.find((ch) => ch.id === channelId),
  );

  // Sync channelId from URL → store + fetch messages (only when channelId changes)
  useEffect(() => {
    if (channelId) {
      useChannelStore.getState().setActiveChannel(channelId);
      useMessageStore.getState().fetchMessages(channelId);
    } else {
      useChannelStore.getState().setActiveChannel(null);
    }
  }, [channelId]);

  // Empty state — no channel selected
  if (!channelId) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center gap-5 text-center px-8">
        <div className="w-20 h-20 rounded-2xl bg-zinc-50 flex items-center justify-center shadow-ambient-md">
          <Icon name="forum" size={36} className="text-zinc-300" />
        </div>
        <div className="max-w-xs">
          <h2 className="text-xl font-black text-zinc-900 tracking-tight">
            Chọn một cuộc trò chuyện
          </h2>
          <p className="text-sm text-zinc-400 mt-2 leading-relaxed">
            Chọn một kênh hoặc tin nhắn từ thanh bên trái để bắt đầu trò chuyện
          </p>
        </div>
        <div className="flex items-center gap-3 mt-4">
          <div className="flex items-center gap-2 bg-zinc-50 px-4 py-2 rounded-full text-xs text-zinc-500">
            <Icon name="tag" size={14} />
            <span>Kênh dự án</span>
          </div>
          <div className="flex items-center gap-2 bg-zinc-50 px-4 py-2 rounded-full text-xs text-zinc-500">
            <Icon name="chat_bubble" size={14} />
            <span>Tin nhắn riêng</span>
          </div>
        </div>
      </div>
    );
  }

  // Channel selected — show full chat UI
  return (
    <div className="flex flex-col h-full relative">
      {activeChannel && <ChannelHeader channel={activeChannel} />}
      {activeChannel?.type === 'PUBLIC' && (
        <PinnedBanner text="Kênh này dành cho các thông báo toàn công ty và thảo luận chung về nơi làm việc. Vui lòng giữ thái độ chuyên nghiệp." />
      )}
      <MessageList channelId={channelId} />
      <MessageInput channelId={channelId} channelName={activeChannel?.name} />
    </div>
  );
}
