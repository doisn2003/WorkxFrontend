import type { ReactNode } from 'react';

interface SidebarSectionProps {
  title: string;
  children: ReactNode;
  action?: ReactNode;
}

export function SidebarSection({ title, children, action }: SidebarSectionProps) {
  return (
    <div className="px-6">
      <div className="flex items-center justify-between mb-4">
        <label className="text-[0.6875rem] font-bold text-zinc-400 uppercase tracking-widest block">
          {title}
        </label>
        {action}
      </div>
      {children}
    </div>
  );
}
