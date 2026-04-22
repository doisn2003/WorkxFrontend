/**
 * Format file size from bytes to human-readable string.
 * e.g. 4400000 → "4.2 MB", 131072 → "128 KB"
 */
export function formatFileSize(bytes?: number): string {
  if (!bytes || bytes === 0) return '0 B';

  const units = ['B', 'KB', 'MB', 'GB'];
  let unitIndex = 0;
  let size = bytes;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size % 1 === 0 ? size : size.toFixed(1)} ${units[unitIndex]}`;
}
