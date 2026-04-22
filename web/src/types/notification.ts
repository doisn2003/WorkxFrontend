export interface Notification {
  id: number;
  user_id: string;
  type: string;
  title: string;
  body?: string;
  reference_type?: string;
  reference_id?: string;
  is_read: boolean;
  created_at: string;
}
