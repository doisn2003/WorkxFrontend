const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

/**
 * Format message timestamp for chat bubbles.
 * "10:24" (today), "Hôm qua, 15:30", "20/04, 09:00"
 */
export function formatMessageTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  const timeStr = date.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  if (diff < DAY && date.getDate() === now.getDate()) {
    return timeStr;
  }

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.getDate() === yesterday.getDate() && date.getMonth() === yesterday.getMonth()) {
    return `Hôm qua, ${timeStr}`;
  }

  const dateFormatted = date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
  });
  return `${dateFormatted}, ${timeStr}`;
}

/**
 * Format relative time for notifications and status.
 * "vừa xong", "5 phút trước", "2 giờ trước", "3 ngày trước"
 */
export function formatRelativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();

  if (diff < MINUTE) return 'vừa xong';
  if (diff < HOUR) return `${Math.floor(diff / MINUTE)} phút trước`;
  if (diff < DAY) return `${Math.floor(diff / HOUR)} giờ trước`;
  return `${Math.floor(diff / DAY)} ngày trước`;
}
