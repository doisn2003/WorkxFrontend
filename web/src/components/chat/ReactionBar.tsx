import type { Reaction } from '@/types/message';

interface ReactionBarProps {
  reactions: Reaction[];
  onToggle?: (emoji: string) => void;
}

/**
 * Emoji reaction pills — matches code.html lines 238-244.
 */
export function ReactionBar({ reactions, onToggle }: ReactionBarProps) {
  if (!reactions || reactions.length === 0) return null;

  return (
    <div className="flex gap-2 mt-2">
      {reactions.map((r) => (
        <button
          key={r.emoji}
          onClick={() => onToggle?.(r.emoji)}
          className="bg-surface-container-low px-2 py-1 rounded-full text-[12px] flex items-center gap-1 hover:bg-zinc-200 transition-colors"
        >
          <span>{r.emoji}</span>
          <span className="text-zinc-500">{r.count}</span>
        </button>
      ))}
    </div>
  );
}
