import { SidebarSection } from './SidebarSection';
import { SidebarItem } from './SidebarItem';
import { UserListItem } from '@/components/user/UserListItem';
import { Icon } from '@/components/common/Icon';

/**
 * Left Sidebar — pixel-perfect match to code.html lines 124-207.
 * bg-zinc-50 (matches design's neutral aside). No border, depth via tonal shift.
 * Static mock data — real data Phase 3.
 */
export function Sidebar() {
  return (
    <aside className="w-64 bg-zinc-50 flex flex-col py-6 gap-6 h-full overflow-y-auto no-scrollbar flex-shrink-0 border-r-0">
      {/* ---- Dự án ---- */}
      <SidebarSection title="Dự án">
        <nav className="flex flex-col gap-1">
          <SidebarItem icon="grid_view" label="Xpiano" active variant="project" />
          <SidebarItem icon="tag" label="Team Marketing" variant="channel" />
          <SidebarItem icon="tag" label="Dự án Xfood" variant="channel" />
        </nav>
      </SidebarSection>

      {/* ---- Chung ---- */}
      <SidebarSection title="Chung">
        <nav className="flex flex-col gap-1">
          <SidebarItem icon="forum" label="Chung" active variant="channel" />
          <SidebarItem icon="casino" label="Ngẫu nhiên" variant="channel" />
          <SidebarItem icon="restaurant" label="Đặt đồ ăn" variant="channel" />
          <SidebarItem icon="calendar_today" label="Lịch làm việc" variant="channel" />
        </nav>
      </SidebarSection>

      {/* ---- Tin nhắn ---- */}
      <SidebarSection
        title="Tin nhắn"
        action={
          <button className="text-zinc-400 hover:text-zinc-900">
            <Icon name="add_circle" size={18} />
          </button>
        }
      >
        <div className="flex flex-col gap-1">
          <UserListItem name="Sarah Jenkins" status="ONLINE" />
          <UserListItem name="David Pham" status="BUSY" />
          <UserListItem name="Elena Belova" status="OFFLINE" />
        </div>
      </SidebarSection>

      {/* ---- Footer ---- */}
      <div className="mt-auto px-6 border-t border-zinc-100 pt-6 space-y-1">
        <button className="text-zinc-400 hover:text-zinc-900 flex items-center gap-3 py-2 w-full text-left">
          <Icon name="settings" size={20} />
          <span className="text-sm">Cài đặt</span>
        </button>
        <button className="text-zinc-400 hover:text-zinc-900 flex items-center gap-3 py-2 w-full text-left">
          <Icon name="help" size={20} />
          <span className="text-sm">Trợ giúp</span>
        </button>
      </div>
    </aside>
  );
}
