import { Icon } from '@/components/common/Icon';
import type { Channel } from '@/types';

interface ChannelHeaderProps {
  channel: Channel;
}

/**
 * Channel header — matches code.html lines 211-226.
 * Shows channel name, star, info and add member buttons.
 */
export function ChannelHeader({ channel }: ChannelHeaderProps) {
  const displayName = channel.type === 'DIRECT'
    ? channel.name ?? 'Tin nhắn riêng'
    : `# ${channel.name}`;

  return (
    <div className="px-8 py-4 bg-white/80 backdrop-blur-md z-10 flex-shrink-0">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-black tracking-tight text-zinc-900">
            {displayName}
          </h1>
          {channel.type !== 'DIRECT' && (
            <Icon name="star" size={18} className="text-zinc-300 cursor-pointer hover:text-yellow-400 transition-colors" />
          )}
        </div>
        <div className="flex items-center gap-4 text-zinc-400">
          <button className="hover:text-zinc-900 transition-colors">
            <Icon name="info" />
          </button>
          <button className="hover:text-zinc-900 transition-colors">
            <Icon name="person_add" />
          </button>
        </div>
      </div>
    </div>
  );
}
