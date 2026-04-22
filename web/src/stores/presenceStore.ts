import { create } from 'zustand';
import type { PresenceStatus } from '@/types';

interface PresenceState {
  /** Map of userId → presence status */
  presenceMap: Record<string, PresenceStatus>;

  /** Update a single user's presence status */
  setStatus: (userId: string, status: PresenceStatus) => void;

  /** Get a user's presence status (defaults to OFFLINE) */
  getStatus: (userId: string) => PresenceStatus;

  /** Bulk-set presence from initial user list */
  initFromUsers: (users: Array<{ id: string; presence_status: PresenceStatus }>) => void;
}

export const usePresenceStore = create<PresenceState>((set, get) => ({
  presenceMap: {},

  setStatus: (userId, status) =>
    set((state) => ({
      presenceMap: { ...state.presenceMap, [userId]: status },
    })),

  getStatus: (userId) => get().presenceMap[userId] ?? 'OFFLINE',

  initFromUsers: (users) =>
    set({
      presenceMap: Object.fromEntries(
        users.map((u) => [u.id, u.presence_status]),
      ),
    }),
}));
