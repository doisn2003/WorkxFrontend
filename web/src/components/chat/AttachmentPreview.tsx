import { Icon } from '@/components/common/Icon';
import type { Attachment } from '@/types/message';
import { formatFileSize } from '@/utils/formatFileSize';

interface AttachmentPreviewProps {
  attachment: Attachment;
}

/**
 * File attachment card — matches code.html lines 273-280.
 */
export function AttachmentPreview({ attachment }: AttachmentPreviewProps) {
  const mimeLabel = attachment.mime_type
    ? attachment.mime_type.split('/').pop()?.toUpperCase() ?? 'TÀI LIỆU'
    : 'TÀI LIỆU';

  return (
    <div className="bg-surface-container-low p-4 rounded-xl space-y-3">
      <div className="flex items-center gap-3">
        <Icon name="description" className="text-primary" />
        <div>
          <p className="text-sm font-semibold text-zinc-900">{attachment.file_name}</p>
          <p className="text-[10px] text-zinc-400 uppercase font-bold tracking-tighter">
            {formatFileSize(attachment.file_size)} • {mimeLabel}
          </p>
        </div>
      </div>
    </div>
  );
}
