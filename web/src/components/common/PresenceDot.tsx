import { cn } from '@/utils/cn';
import type { PresenceStatus } from '@/types';

interface PresenceDotProps {
  status: PresenceStatus;
  size?: 'sm' | 'md';
  className?: string;
}

const colorMap: Record<PresenceStatus, string> = {
  ONLINE: 'bg-green-500',
  BUSY: 'bg-yellow-500',
  OFFLINE: 'bg-zinc-300',
};

const sizeMap = {
  sm: 'w-2 h-2 border',
  md: 'w-2.5 h-2.5 border-2',
};

export function PresenceDot({ status, size = 'md', className }: PresenceDotProps) {
  return (
    <span
      className={cn(
        'absolute bottom-0 right-0 rounded-full border-zinc-50',
        colorMap[status],
        sizeMap[size],
        className,
      )}
    />
  );
}
