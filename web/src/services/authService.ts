import { api } from './api';
import type { User, LoginRequest, LoginResponse } from '@/types';

export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const { data } = await api.post('/auth/login', credentials);
    return data.data ?? data;
  },

  async refreshToken(refreshToken: string) {
    const { data } = await api.post('/auth/refresh', { refreshToken });
    return data.data ?? data;
  },

  async getMe(): Promise<User> {
    const { data } = await api.get('/auth/me');
    return data.data ?? data;
  },

  async logout(refreshToken: string): Promise<void> {
    await api.post('/auth/logout', { refreshToken });
  },

  async logoutAll(): Promise<void> {
    await api.post('/auth/logout-all');
  },

  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    await api.put('/auth/change-password', { oldPassword, newPassword });
  },
};
