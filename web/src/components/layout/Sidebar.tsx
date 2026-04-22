import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SidebarSection } from './SidebarSection';
import { SidebarItem } from './SidebarItem';
import { UserListItem } from '@/components/user/UserListItem';
import { Icon } from '@/components/common/Icon';
import { useChannelStore } from '@/stores/channelStore';
import { useAuthStore } from '@/stores/authStore';
import { usePresenceStore } from '@/stores/presenceStore';
import { channelService } from '@/services/channelService';
import { userService } from '@/services/userService';
import { useState } from 'react';
import type { User } from '@/types';

/**
 * Left Sidebar — connected to real channel data from API.
 */
export function Sidebar() {
  const navigate = useNavigate();
  const channels = useChannelStore((s) => s.channels);
  const activeChannelId = useChannelStore((s) => s.activeChannelId);
  const fetchChannels = useChannelStore((s) => s.fetchChannels);
  const setActiveChannel = useChannelStore((s) => s.setActiveChannel);
  const currentUserId = useAuthStore((s) => s.user?.id);

  const [users, setUsers] = useState<User[]>([]);

  const presenceMap = usePresenceStore((s) => s.presenceMap);

  // Fetch channels + users on mount
  useEffect(() => {
    fetchChannels();
    userService.getUsers().then((fetchedUsers) => {
      setUsers(fetchedUsers);
      // Initialize presence store with API data
      usePresenceStore.getState().initFromUsers(fetchedUsers);
    }).catch(console.error);
  }, [fetchChannels]);

  const projectChannels = channels.filter((ch) => ch.type === 'PROJECT');
  const publicChannels = channels.filter((ch) => ch.type === 'PUBLIC');
  // Filter out self from DM contacts
  const dmContacts = users.filter((u) => u.id !== currentUserId);

  const handleChannelClick = (channelId: string) => {
    setActiveChannel(channelId);
    navigate(`/chat/${channelId}`);
  };

  const handleDMClick = async (targetUserId: string) => {
    try {
      const channel = await channelService.createDirectChannel(targetUserId);
      setActiveChannel(channel.id);
      await fetchChannels(); // Refresh list to include new DM
      navigate(`/chat/${channel.id}`);
    } catch (err) {
      console.error('Create DM failed:', err);
    }
  };

  // Map channel type to icon
  const channelIcon = (name?: string): string => {
    const lower = name?.toLowerCase() ?? '';
    if (lower.includes('general') || lower.includes('chung')) return 'forum';
    if (lower.includes('random') || lower.includes('ngẫu')) return 'casino';
    if (lower.includes('đồ ăn') || lower.includes('food')) return 'restaurant';
    if (lower.includes('lịch') || lower.includes('calendar')) return 'calendar_today';
    return 'tag';
  };

  return (
    <aside className="w-64 bg-zinc-50 flex flex-col py-6 gap-6 h-full overflow-y-auto no-scrollbar flex-shrink-0">
      {/* ---- Dự án ---- */}
      {projectChannels.length > 0 && (
        <SidebarSection title="Dự án">
          <nav className="flex flex-col gap-1">
            {projectChannels.map((ch) => (
              <SidebarItem
                key={ch.id}
                icon="grid_view"
                label={ch.name?.replace('Project: ', '') ?? 'Dự án'}
                active={ch.id === activeChannelId}
                variant="project"
                onClick={() => handleChannelClick(ch.id)}
              />
            ))}
          </nav>
        </SidebarSection>
      )}

      {/* ---- Chung ---- */}
      {publicChannels.length > 0 && (
        <SidebarSection title="Chung">
          <nav className="flex flex-col gap-1">
            {publicChannels.map((ch) => (
              <SidebarItem
                key={ch.id}
                icon={channelIcon(ch.name)}
                label={ch.name ?? 'Kênh'}
                active={ch.id === activeChannelId}
                variant="channel"
                onClick={() => handleChannelClick(ch.id)}
              />
            ))}
          </nav>
        </SidebarSection>
      )}

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
          {dmContacts.map((user) => (
            <UserListItem
              key={user.id}
              name={`${user.family_and_middle_name} ${user.first_name}`.trim()}
              avatarUrl={user.avatar_url}
              status={presenceMap[user.id] ?? user.presence_status}
              onClick={() => handleDMClick(user.id)}
            />
          ))}
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
