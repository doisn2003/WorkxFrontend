export interface Project {
  id: string;
  name: string;
  description?: string;
  owner_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // Joined fields
  members?: ProjectMember[];
  member_count?: number;
}

export interface ProjectMember {
  project_id: string;
  user_id: string;
  joined_at: string;
  // Joined
  user?: {
    id: string;
    first_name: string;
    family_and_middle_name: string;
    avatar_url?: string;
  };
}
