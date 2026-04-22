import { useAuthStore } from '@/stores/authStore';
import { ROLE_LABELS } from '@/utils/constants';

/**
 * Placeholder ChatPage — will be replaced in Phase 2 with full layout.
 */
export function ChatPage() {
  const { user, logout } = useAuthStore();

  if (!user) return null;

  const fullName = `${user.family_and_middle_name} ${user.first_name}`;
  const roleName = user.role?.name ?? 'member';

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-surface gap-6">
      {/* Avatar */}
      <div className="w-20 h-20 rounded-full bg-surface-container-high flex items-center justify-center text-2xl font-bold text-on-surface">
        {user.first_name.charAt(0).toUpperCase()}
      </div>

      {/* Welcome */}
      <div className="text-center">
        <h1 className="text-2xl font-black tracking-tight text-on-surface">
          Xin chào, {user.first_name}!
        </h1>
        <p className="text-sm text-on-surface-variant mt-1">
          {fullName} — {ROLE_LABELS[roleName] ?? roleName}
        </p>
        <p className="text-xs text-on-surface-variant/60 mt-1">{user.email}</p>
      </div>

      {/* Info card */}
      <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-ambient-md max-w-sm w-full mx-4">
        <p className="text-sm text-on-surface-variant text-center leading-relaxed">
          Giao diện chính đang được phát triển.<br />
          Hệ thống đã xác thực thành công! 🎉
        </p>
      </div>

      {/* Logout button */}
      <button
        onClick={logout}
        className="text-sm text-on-surface-variant hover:text-on-surface transition-colors flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-surface-container-low"
      >
        <span className="material-symbols-outlined text-[18px]">logout</span>
        Đăng xuất
      </button>
    </div>
  );
}
