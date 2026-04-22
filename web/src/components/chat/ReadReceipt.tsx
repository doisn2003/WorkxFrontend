import { Icon } from '@/components/common/Icon';

/**
 * Read receipt — "Đã xem ✓✓" for self-sent messages.
 * Matches code.html lines 259-262.
 */
export function ReadReceipt() {
  return (
    <div className="flex items-center gap-1 mt-1 text-[10px] text-zinc-400">
      <span>Đã xem</span>
      <Icon name="done_all" size={12} />
    </div>
  );
}
