import { Icon } from '@/components/common/Icon';

/**
 * Read receipt — "Đã xem ✓✓" for self-sent messages.
 * Matches code.html lines 259-262.
 */
interface ReadReceiptProps {
  isRead?: boolean;
}

export function ReadReceipt({ isRead = false }: ReadReceiptProps) {
  return (
    <div className={`flex items-center gap-1 mt-1 text-[10px] ${isRead ? 'text-blue-500' : 'text-zinc-400'}`}>
      <span>{isRead ? 'Đã xem' : 'Đã nhận'}</span>
      <Icon name={isRead ? 'done_all' : 'done'} size={12} />
    </div>
  );
}
