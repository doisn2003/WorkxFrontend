import type { User } from './user';

// ---- Generic API Response ----
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  code: number;
  message: string;
}

// ---- Auth ----
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

// ---- Pagination ----
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface CursorPaginationParams {
  cursor?: number; // last_message_id
  limit?: number;
}
