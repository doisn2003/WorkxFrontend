export type ChannelType = 'DIRECT' | 'PROJECT' | 'PUBLIC';

export interface Channel {
  id: string;
  name?: string;
  type: ChannelType;
  project_id?: string;
  created_by?: string;
  is_archived: boolean;
  created_at: string;
  // Computed / joined fields
  unread_count?: number;
  max_other_read_id?: number;
  last_message?: {
    content: string;
    sender_name: string;
    created_at: string;
  };
}

export interface ChannelMember {
  channel_id: string;
  user_id: string;
  last_read_message_id?: number;
}
