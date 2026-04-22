import { Icon } from '@/components/common/Icon';
import { Avatar } from '@/components/common/Avatar';
import { useAuthStore } from '@/stores/authStore';
import { useUiStore } from '@/stores/uiStore';
import { ROLE_LABELS } from '@/utils/constants';

/**
 * TopBar — pixel-perfect match to code.html lines 91-121.
 * Glass style: bg-white/70, backdrop-blur-3xl, ambient shadow, fixed top.
 */
export function TopBar() {
  const user = useAuthStore((s) => s.user);
  const toggleRightPanel = useUiStore((s) => s.toggleRightPanel);

  const fullName = user
    ? `${user.family_and_middle_name} ${user.first_name}`.trim()
    : '';
  const roleName = user?.role?.name ?? 'member';

  return (
    <header className="bg-white/70 backdrop-blur-3xl shadow-ambient h-16 flex justify-between items-center w-full px-8 shrink-0 relative z-50">
      {/* Left: Logo + Search */}
      <div className="flex items-center gap-8 w-1/3">
        <span className="text-xl font-black text-zinc-900 tracking-tighter uppercase select-none cursor-default">
          WorkX
        </span>
        <div className="flex-grow max-w-xs relative group">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 scale-75">
            search
          </span>
          <input
            className="w-full bg-surface-container-low border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-1 focus:ring-primary/20 placeholder-zinc-400 transition-all outline-none"
            placeholder="Tìm kiếm..."
            type="text"
          />
        </div>
      </div>

      {/* Right: Actions + User */}
      <div className="flex items-center justify-end gap-6 w-1/3">
        {/* "Công việc" toggle button */}
        <button
          onClick={toggleRightPanel}
          className="primary-gradient text-white px-4 py-1.5 rounded-lg text-sm font-semibold tracking-tight hover:opacity-90 flex items-center gap-2"
        >
          <Icon name="list_alt" size={18} />
          Công việc
        </button>

        {/* Notification + Dark mode */}
        <div className="flex items-center gap-4 text-zinc-500">
          <button className="p-2 hover:bg-zinc-100 rounded-full relative">
            <Icon name="notifications" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full" />
          </button>
          <button className="p-2 hover:bg-zinc-100 rounded-full">
            <Icon name="dark_mode" />
          </button>
        </div>

        {/* User profile */}
        {user && (
          <div className="flex items-center gap-3 pl-4 border-l border-zinc-100">
            <div className="text-right hidden md:block">
              <p className="text-xs font-bold text-zinc-900 leading-tight">{fullName}</p>
              <p className="text-[10px] text-zinc-400">
                {ROLE_LABELS[roleName] ?? roleName}
              </p>
            </div>
            <Avatar
              src={user.avatar_url}
              name={user.first_name}
              size="sm"
              className="ring-2 ring-white shadow-sm !w-9 !h-9"
            />
          </div>
        )}
      </div>
    </header>
  );
}
