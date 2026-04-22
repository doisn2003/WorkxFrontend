import { api } from './api';
import type { User } from '@/types';
import type { ApiResponse } from '@/types/api';

interface UsersListResponse {
  data: User[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

export const userService = {
  /** GET /api/users/ — List all active users */
  async getUsers(): Promise<User[]> {
    const { data } = await api.get<{ success: boolean } & UsersListResponse>(
      '/users/',
    );
    return data.data;
  },

  /** GET /api/users/:id */
  async getUser(id: string): Promise<User> {
    const { data } = await api.get<ApiResponse<User>>(`/users/${id}`);
    return data.data;
  },
};
