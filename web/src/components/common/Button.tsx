import { cn } from '@/utils/cn';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary';
  size?: 'sm' | 'md';
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  className,
  ...props
}: ButtonProps) {
  const base = 'inline-flex items-center justify-center gap-2 font-semibold transition-all';

  const variants = {
    primary: 'primary-gradient text-white hover:opacity-90 active:scale-[0.98]',
    secondary: 'bg-transparent border border-outline-variant/15 text-on-surface hover:bg-surface-container-low',
    tertiary: 'bg-transparent text-secondary hover:text-on-surface',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs rounded-lg tracking-widest uppercase font-bold',
    md: 'px-4 py-2 text-sm rounded-lg tracking-tight',
  };

  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}
