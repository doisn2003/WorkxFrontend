export const API_BASE_URL = 'http://localhost:3000/api';
export const SOCKET_URL = 'http://localhost:3000';

// ---- Vietnamese labels for task status ----
export const TASK_STATUS_LABELS: Record<string, string> = {
  TODO: 'Cần làm',
  IN_PROGRESS: 'Đang thực hiện',
  IN_REVIEW: 'Đang đánh giá',
  DONE: 'Hoàn thành',
  ARCHIVED: 'Đã lưu trữ',
};

// ---- Vietnamese labels for task priority ----
export const TASK_PRIORITY_LABELS: Record<string, string> = {
  LOW: 'Thấp',
  MEDIUM: 'Trung bình',
  HIGH: 'Cao',
  URGENT: 'Khẩn cấp',
};

// ---- Vietnamese labels for presence status ----
export const PRESENCE_LABELS: Record<string, string> = {
  ONLINE: 'Trực tuyến',
  OFFLINE: 'Ngoại tuyến',
  BUSY: 'Đang bận',
};

// ---- Vietnamese labels for channel types ----
export const CHANNEL_TYPE_LABELS: Record<string, string> = {
  DIRECT: 'Tin nhắn riêng',
  PROJECT: 'Dự án',
  PUBLIC: 'Kênh chung',
};

// ---- Vietnamese labels for roles ----
export const ROLE_LABELS: Record<string, string> = {
  admin: 'Quản trị viên',
  pm: 'Quản lý dự án',
  member: 'Thành viên',
};
