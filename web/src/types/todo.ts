export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE' | 'ARCHIVED';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface WorkTodo {
  id: string;
  project_id: string;
  parent_id?: string;
  creator_id: string;
  assignee_id?: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  due_date?: string;
  deleted_at?: string;
  created_at: string;
  updated_at: string;
  // Joined fields
  assignee?: {
    id: string;
    first_name: string;
    family_and_middle_name: string;
    avatar_url?: string;
  };
  children?: WorkTodo[];
}
