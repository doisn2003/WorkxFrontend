import { cn } from '@/utils/cn';
import { Icon } from '@/components/common/Icon';

interface SidebarItemProps {
  icon: string;
  label: string;
  active?: boolean;
  variant?: 'project' | 'channel';
  filled?: boolean;
  onClick?: () => void;
}

export function SidebarItem({
  icon,
  label,
  active = false,
  variant = 'channel',
  filled = false,
  onClick,
}: SidebarItemProps) {
  const isActiveProject = active && variant === 'project';
  const isActiveChannel = active && variant === 'channel';

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full rounded-lg flex items-center gap-3 px-3 py-2.5 text-left',
        isActiveProject && 'bg-zinc-900 text-white',
        isActiveChannel && 'text-zinc-900 font-bold bg-zinc-200/40',
        !active && 'text-zinc-500 hover:bg-zinc-200/50 hover:text-zinc-700',
      )}
    >
      <Icon
        name={icon}
        filled={isActiveProject || filled}
        size={18}
        className={cn(!active && 'text-zinc-400')}
      />
      <span className={cn('text-sm truncate', active && 'font-semibold')}>
        {label}
      </span>
    </button>
  );
}
