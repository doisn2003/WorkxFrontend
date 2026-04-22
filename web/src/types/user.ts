// ---- Presence & Role ----
export type PresenceStatus = 'ONLINE' | 'OFFLINE' | 'BUSY';
export type RoleName = 'admin' | 'pm' | 'member';

export interface Role {
  id: number;
  name: RoleName;
  description?: string;
}

export interface User {
  id: string;
  email: string;
  phone?: string;
  role_id: number;
  role?: Role;
  family_and_middle_name: string;
  first_name: string;
  avatar_url?: string;
  date_of_birth?: string;
  presence_status: PresenceStatus;
  working_hours?: Record<string, unknown>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
