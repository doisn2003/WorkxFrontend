import { Avatar } from '@/components/common/Avatar';
import { PresenceDot } from '@/components/common/PresenceDot';
import type { PresenceStatus } from '@/types';

interface UserListItemProps {
  name: string;
  avatarUrl?: string;
  status: PresenceStatus;
  active?: boolean;
  onClick?: () => void;
}

export function UserListItem({ name, avatarUrl, status, active, onClick }: UserListItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 group cursor-pointer p-1.5 rounded-lg text-left transition-colors ${
        active ? 'bg-zinc-200/40' : 'hover:bg-zinc-100'
      }`}
    >
      <div className="relative flex-shrink-0">
        <Avatar src={avatarUrl} name={name} size="sm" />
        <PresenceDot status={status} />
      </div>
      <span className={`text-sm font-medium truncate ${
        active ? 'text-zinc-900' : 'text-zinc-600 group-hover:text-zinc-900'
      }`}>
        {name}
      </span>
    </button>
  );
}
