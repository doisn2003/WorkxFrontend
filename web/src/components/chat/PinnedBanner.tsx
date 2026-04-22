import { Icon } from '@/components/common/Icon';

interface PinnedBannerProps {
  text: string;
}

/**
 * Pinned message banner — matches code.html lines 222-225.
 */
export function PinnedBanner({ text }: PinnedBannerProps) {
  return (
    <div className="mx-8 mb-2 bg-surface-container-lowest p-3 rounded-xl shadow-ambient-md flex items-center gap-4 group flex-shrink-0">
      <Icon name="push_pin" className="text-zinc-400 scale-75 flex-shrink-0" />
      <p className="text-sm text-zinc-500 font-medium">{text}</p>
    </div>
  );
}
