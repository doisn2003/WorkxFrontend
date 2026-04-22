interface TypingIndicatorProps {
  /** Names of users who are currently typing */
  userNames: string[];
}

/**
 * Typing indicator — "X đang soạn tin nhắn..."
 * Matches code.html line 288.
 */
export function TypingIndicator({ userNames }: TypingIndicatorProps) {
  if (userNames.length === 0) return null;

  const text =
    userNames.length === 1
      ? `${userNames[0]} đang soạn tin nhắn`
      : userNames.length === 2
        ? `${userNames[0]} và ${userNames[1]} đang soạn tin nhắn`
        : `${userNames[0]} và ${userNames.length - 1} người khác đang soạn tin nhắn`;

  return (
    <p className="text-[11px] text-zinc-400 mb-2 italic ml-4 flex items-center gap-1">
      <span>{text}</span>
      <span className="inline-flex gap-0.5">
        <span className="w-1 h-1 bg-zinc-400 rounded-full animate-bounce [animation-delay:0ms]" />
        <span className="w-1 h-1 bg-zinc-400 rounded-full animate-bounce [animation-delay:150ms]" />
        <span className="w-1 h-1 bg-zinc-400 rounded-full animate-bounce [animation-delay:300ms]" />
      </span>
    </p>
  );
}
