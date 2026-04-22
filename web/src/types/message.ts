export interface Message {
  id: number;
  channel_id: string;
  sender_id: string;
  parent_id?: number;
  content: string;
  metadata?: Record<string, unknown>;
  deleted_at?: string;
  created_at: string;
  updated_at: string;
  // Flat sender fields from API
  sender_first_name?: string;
  sender_family_name?: string;
  sender_avatar?: string | null;
  // Nested sender (for future / normalized usage)
  sender?: {
    id: string;
    first_name: string;
    family_and_middle_name: string;
    avatar_url?: string;
  };
  attachments?: Attachment[];
  reactions?: Reaction[];
  // Optimistic UI
  _status?: 'pending' | 'confirmed' | 'failed';
  _tempId?: string;
}

export interface Attachment {
  id: string;
  message_id: number;
  file_name: string;
  file_url: string;
  file_size?: number;
  mime_type?: string;
  created_at: string;
}

export interface Reaction {
  emoji: string;
  count: number;
  users: string[]; // user IDs
}
