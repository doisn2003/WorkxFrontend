import { cn } from '@/utils/cn';
import { Icon } from './Icon';
import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: string;
}

export function Input({ icon, className, ...props }: InputProps) {
  if (icon) {
    return (
      <div className="relative group">
        <Icon
          name={icon}
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 scale-75"
        />
        <input
          className={cn(
            'w-full bg-surface-container-low rounded-lg pl-10 pr-4 py-2 text-sm',
            'border-none outline-none',
            'focus:ring-1 focus:ring-primary/20',
            'placeholder:text-zinc-400 transition-all',
            className,
          )}
          {...props}
        />
      </div>
    );
  }

  return (
    <input
      className={cn(
        'w-full bg-surface-container-low rounded-lg px-4 py-2 text-sm',
        'border border-outline-variant/15 outline-none',
        'focus:border-primary focus:shadow-[0_0_0_2px_rgba(0,0,0,0.1)]',
        'placeholder:text-zinc-400 transition-all',
        className,
      )}
      {...props}
    />
  );
}
