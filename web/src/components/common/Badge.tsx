import { cn } from '@/utils/cn';
import type { ReactNode } from 'react';

type BadgeVariant = 'urgent' | 'high' | 'medium' | 'low' | 'default';

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  urgent: 'bg-error-container text-on-error-container',
  high: 'bg-zinc-200 text-zinc-700',
  medium: 'bg-zinc-100 text-zinc-500',
  low: 'bg-zinc-100 text-zinc-400',
  default: 'bg-zinc-100 text-zinc-500',
};

export function Badge({ variant = 'default', children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'text-[10px] font-black tracking-widest px-2 py-0.5 rounded uppercase inline-block',
        variantStyles[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
