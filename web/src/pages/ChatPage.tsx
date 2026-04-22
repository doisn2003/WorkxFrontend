import { Icon } from '@/components/common/Icon';

/**
 * ChatPage — placeholder for Phase 3.
 * Sits inside AppLayout's <main> area.
 * Shows a gentle welcome prompt matching Digital Atrium aesthetic.
 */
export function ChatPage() {
  return (
    <div className="flex-grow flex flex-col items-center justify-center gap-5 text-center px-8">
      {/* Icon container */}
      <div className="w-20 h-20 rounded-2xl bg-zinc-50 flex items-center justify-center shadow-ambient-md">
        <Icon name="forum" size={36} className="text-zinc-300" />
      </div>

      {/* Text */}
      <div className="max-w-xs">
        <h2 className="text-xl font-black text-zinc-900 tracking-tight">
          Chọn một cuộc trò chuyện
        </h2>
        <p className="text-sm text-zinc-400 mt-2 leading-relaxed">
          Chọn một kênh hoặc tin nhắn từ thanh bên trái để bắt đầu trò chuyện
        </p>
      </div>

      {/* Hint chips */}
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
