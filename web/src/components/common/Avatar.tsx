import { cn } from '@/utils/cn';

interface AvatarProps {
  src?: string | null;
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
};

export function Avatar({ src, name = '', size = 'md', className }: AvatarProps) {
  const initial = name ? name.charAt(0).toUpperCase() : '?';

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn(
          'rounded-full object-cover flex-shrink-0',
          sizeMap[size],
          className,
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        'rounded-full flex-shrink-0 bg-surface-container-high flex items-center justify-center font-bold text-on-surface',
        sizeMap[size],
        className,
      )}
    >
      {initial}
    </div>
  );
}
