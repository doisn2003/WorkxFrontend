import { cn } from '@/utils/cn';

interface IconProps {
  name: string;
  filled?: boolean;
  size?: number;
  className?: string;
}

export function Icon({ name, filled = false, size, className }: IconProps) {
  return (
    <span
      className={cn('material-symbols-outlined', className)}
      style={{
        fontVariationSettings: filled ? "'FILL' 1" : undefined,
        fontSize: size ? `${size}px` : undefined,
      }}
    >
      {name}
    </span>
  );
}
