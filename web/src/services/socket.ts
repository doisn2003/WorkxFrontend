import { io, type Socket } from 'socket.io-client';
import { SOCKET_URL } from '@/utils/constants';

/**
 * Socket.io client singleton.
 * Auth via JWT in handshake: socket.handshake.auth.token
 * Backend auto-joins rooms: user:{id}, channel:{id}, project:{id}
 */
let socket: Socket | null = null;

/** Connect to Socket.io server with JWT token. */
export function connectSocket(token: string): Socket {
  if (socket?.connected) return socket;

  socket = io(SOCKET_URL, {
    auth: { token },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
  });

  socket.on('connect', () => {
    console.log('🟢 Socket connected:', socket?.id);
  });

  socket.on('disconnect', (reason) => {
    console.log('🔴 Socket disconnected:', reason);
  });

  socket.on('connect_error', (err) => {
    console.error('❌ Socket connection error:', err.message);
  });

  return socket;
}

/** Disconnect and clean up socket. */
export function disconnectSocket(): void {
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }
}

/** Get the current socket instance (may be null). */
export function getSocket(): Socket | null {
  return socket;
}

/** Check if socket is currently connected. */
export function isSocketConnected(): boolean {
  return socket?.connected ?? false;
}
