# WORKX FRONTEND WEB - KIẾN TRÚC & KẾ HOẠCH PHÁT TRIỂN

## 1. TỔNG QUAN DỰ ÁN

**Mục tiêu:** Xây dựng giao diện web cho hệ thống chat & quản lý tiến độ nội bộ (~100 người).
**Tech Stack:** React 19 + TypeScript + Vite 8 + Tailwind CSS 4 + Socket.io Client + Zustand + React Router v7.
**Design System:** "The Digital Atrium" — monochrome brutalist-lite, font Inter, no-border philosophy.
**Backend API:** `http://localhost:3000/api` (REST + Socket.io), JWT Authentication.

---

## 2. KIẾN TRÚC THƯ MỤC

```
src/
├── main.tsx                        # Entry point, providers
├── App.tsx                         # Router configuration
├── index.css                       # Global styles, design tokens
│
├── types/                          # TypeScript definitions
│   ├── user.ts                     # User, Role, PresenceStatus
│   ├── channel.ts                  # Channel, ChannelMember, ChannelType
│   ├── message.ts                  # Message, Attachment, Reaction
│   ├── project.ts                  # Project, ProjectMember
│   ├── todo.ts                     # WorkTodo, TaskStatus, TaskPriority
│   ├── notification.ts             # Notification
│   └── api.ts                      # ApiResponse, PaginationParams
│
├── services/                       # API & Socket communication
│   ├── api.ts                      # Axios instance, interceptors, token refresh
│   ├── socket.ts                   # Socket.io client singleton
│   ├── authService.ts              # login, logout, refresh, me, changePassword
│   ├── userService.ts              # CRUD users, updateRole, updatePresence
│   ├── projectService.ts           # CRUD projects, members
│   ├── channelService.ts           # getChannels, getChannel, direct, public
│   ├── messageService.ts           # CRUD messages, thread, read, reactions
│   ├── todoService.ts              # CRUD todos, updateStatus, assign
│   └── notificationService.ts     # getAll, unreadCount, markRead
│
├── stores/                         # Zustand state management
│   ├── authStore.ts                # user, tokens, login/logout actions
│   ├── channelStore.ts             # channels list, activeChannel, unreadCounts
│   ├── messageStore.ts             # messages map by channelId, optimistic updates
│   ├── projectStore.ts             # projects list, activeProject
│   ├── todoStore.ts                # todos by projectId
│   ├── presenceStore.ts            # online users map
│   ├── notificationStore.ts        # notifications, unreadCount
│   └── uiStore.ts                  # sidebar state, modals, theme
│
├── hooks/                          # Custom React hooks
│   ├── useSocket.ts                # Socket connection lifecycle
│   ├── useAuth.ts                  # Auth guard, current user
│   ├── useChannel.ts               # Channel data + messages
│   ├── useInfiniteScroll.ts        # Cursor-based pagination
│   ├── useTypingIndicator.ts       # Typing events
│   └── useDebounce.ts              # Search debounce
│
├── layouts/                        # Page layout shells
│   └── AppLayout.tsx               # TopBar + Sidebar + Main + RightPanel
│
├── pages/                          # Route-level components
│   ├── LoginPage.tsx
│   ├── ChatPage.tsx                # Main workspace view
│   ├── AdminPage.tsx               # User management (Admin only)
│   └── NotFoundPage.tsx
│
├── components/                     # Reusable UI components
│   ├── common/                     # Shared primitives
│   │   ├── Avatar.tsx              # User avatar + presence dot
│   │   ├── Badge.tsx               # Priority/status badges
│   │   ├── Button.tsx              # Primary, Secondary, Tertiary variants
│   │   ├── Input.tsx               # Text input with ghost border
│   │   ├── Modal.tsx               # Glass-panel modal
│   │   ├── Spinner.tsx             # Loading indicator
│   │   └── Icon.tsx                # Material Symbols wrapper
│   │
│   ├── layout/                     # Layout sections
│   │   ├── TopBar.tsx              # Logo, search, My Task, notifications, user
│   │   ├── Sidebar.tsx             # Left nav: Projects, General, Messages
│   │   ├── RightPanel.tsx          # Work Todos panel + Productivity card
│   │   ├── SidebarSection.tsx      # Section with label + nav items
│   │   └── SidebarItem.tsx         # Individual nav item
│   │
│   ├── chat/                       # Messaging components
│   │   ├── ChannelHeader.tsx       # Channel name, star, info, add member
│   │   ├── PinnedBanner.tsx        # Pinned message banner
│   │   ├── MessageList.tsx         # Virtualized message feed
│   │   ├── MessageBubble.tsx       # Single message (self vs others)
│   │   ├── MessageInput.tsx        # Compose bar: attach, emoji, bold, send
│   │   ├── TypingIndicator.tsx     # "X is typing..." display
│   │   ├── AttachmentPreview.tsx   # File attachment card
│   │   ├── ReactionBar.tsx         # Emoji reaction buttons
│   │   └── ReadReceipt.tsx         # "Read ✓✓" indicator
│   │
│   ├── todo/                       # Task management components
│   │   ├── TodoCard.tsx            # Individual task card
│   │   ├── TodoList.tsx            # List of TodoCards
│   │   ├── AddTaskModal.tsx        # Create/edit task modal
│   │   ├── TaskCheckbox.tsx        # Checkbox with done state
│   │   └── ProductivityCard.tsx    # Stats card (dark, bottom of right panel)
│   │
│   ├── user/                       # User-related components
│   │   ├── UserListItem.tsx        # User row in DM sidebar
│   │   ├── UserProfile.tsx         # Profile dropdown
│   │   └── PresenceDot.tsx         # Online/Busy/Offline indicator
│   │
│   └── notification/               # Notification components
│       ├── NotificationBell.tsx    # Bell icon + badge count
│       └── NotificationDropdown.tsx# Notification list popover
│
└── utils/                          # Helper functions
    ├── formatDate.ts               # Relative time formatting (Vietnamese)
    ├── formatFileSize.ts           # "4.2 MB" formatter
    ├── constants.ts                # API_URL, SOCKET_URL, status maps
    └── cn.ts                       # className merge utility
```

---

## 3. DESIGN SYSTEM → CODE MAPPING

### 3.1 Design Tokens (Tailwind Config)

Ánh xạ từ `code.html` vào Tailwind config đã có sẵn trong project:

| Token | Tailwind Class | Hex |
|---|---|---|
| `primary` | `text-primary`, `bg-primary` | `#000000` |
| `on-primary` | `text-on-primary` | `#ffffff` |
| `surface` | `bg-surface` | `#f9f9f9` |
| `surface-container-low` | `bg-surface-container-low` | `#f3f3f3` |
| `surface-container` | `bg-surface-container` | `#eeeeee` |
| `error` | `text-error` | `#ba1a1a` |
| `error-container` | `bg-error-container` | `#ffdad6` |

### 3.2 Layout Mapping (từ screen.png)

```
┌──────────────────────────────────────────────────────────┐
│  TopBar (h-16, fixed, glass backdrop-blur)               │
├──────────┬───────────────────────────┬───────────────────┤
│ Sidebar  │   Main Chat Area          │  Right Panel      │
│ (w-64)   │   (flex-grow)             │  (w-[320px])      │
│ bg-zinc  │   bg-white                │  bg-zinc-50       │
│ -50      │                           │                   │
│          │  ┌─ChannelHeader──────┐   │  ┌─TodoList────┐  │
│ Projects │  │ # General  ★  ℹ 👤│   │  │ WORK TODOS  │  │
│ General  │  └────────────────────┘   │  │ + ADD TASK   │  │
│ Messages │  ┌─PinnedBanner───────┐   │  │             │  │
│          │  │ 📌 Pinned message  │   │  │ [TodoCard]  │  │
│          │  └────────────────────┘   │  │ [TodoCard]  │  │
│          │                           │  │ [TodoCard]  │  │
│          │  ┌─MessageList────────┐   │  │             │  │
│          │  │ [MessageBubble]    │   │  └─────────────┘  │
│          │  │ [MessageBubble]    │   │                   │
│          │  │ ...                │   │  ┌─Productivity─┐ │
│          │  └────────────────────┘   │  │ 85% complete │ │
│ Settings │                           │  └──────────────┘ │
│ Help     │  ┌─MessageInput───────┐   │                   │
│          │  │ + Type... 😊 B ▶   │   │                   │
│          │  └────────────────────┘   │                   │
└──────────┴───────────────────────────┴───────────────────┘
```

### 3.3 Quy tắc Design quan trọng

1. **No-Line Rule:** Không dùng `border-1px-solid`. Phân tách bằng background shift (`bg-zinc-50` vs `bg-white`).
2. **Ghost Border:** Nếu cần border → dùng `border border-outline-variant/15`.
3. **Glass Panel:** Modal/dropdown → `backdrop-blur-[40px] bg-white/70`.
4. **Primary Gradient:** CTA buttons → `background: linear-gradient(135deg, #777 0%, #474747 100%)`.
5. **Ambient Shadow:** Float elements → `shadow-[0_32px_64px_-4px_rgba(0,0,0,0.04)]`.
6. **Typography:** Headlines: `font-black tracking-tighter`. Labels: `text-[0.6875rem] font-bold uppercase tracking-widest`.
7. **Spacing:** Default card padding `p-6` (24px). Item separation bằng `space-y` thay vì dividers.
8. **Border Radius:** Subtle → `rounded` (2px), Cards → `rounded-xl`, Buttons → `rounded-lg`.

---

## 4. QUẢN LÝ TRẠNG THÁI (STATE MANAGEMENT)

### 4.1 Zustand Store Architecture

```
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│  authStore   │────▶│ API Services │────▶│  Backend REST   │
│  (user,jwt)  │     │ (axios)      │     │  /api/*         │
└─────────────┘     └──────────────┘     └─────────────────┘
       │                                          │
       ▼                                          ▼
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│channelStore  │◀───│  Socket.io   │◀───│  Backend WS     │
│messageStore  │     │  (events)    │     │  Redis Pub/Sub  │
│presenceStore │     └──────────────┘     └─────────────────┘
│notification  │
│  Store       │
└─────────────┘
```

### 4.2 Chiến lược Optimistic Updates

- **Gửi tin nhắn:** Thêm message vào store ngay (status: `pending`) → API call → success: update `id` → fail: mark `failed` + retry button.
- **Reaction:** Toggle ngay trên UI → API call background.
- **Mark as read:** Update `last_read_message_id` local → API call background.
- **Typing indicator:** Debounce 300ms, emit socket event, auto-clear sau 3s.

### 4.3 Socket Events

| Event (Listen) | Action |
|---|---|
| `new_message` | Thêm vào messageStore, update unread count |
| `message_updated` | Update message trong store |
| `message_deleted` | Xóa message khỏi store |
| `user_presence` | Update presenceStore |
| `typing_start/stop` | Hiển thị typing indicator |
| `task_assigned` | Thêm notification, update todoStore |
| `task_status_changed` | Update todoStore |
| `notification` | Thêm vào notificationStore |

---

## 5. API SERVICE LAYER

### 5.1 Axios Instance

```typescript
// services/api.ts
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 10000,
});

// Request interceptor: attach JWT
// Response interceptor: auto refresh token on 401
// Retry queue: queue requests during refresh
```

### 5.2 API Endpoints Map

| Module | Endpoint | Method |
|---|---|---|
| **Auth** | `/auth/login` | POST |
| | `/auth/refresh` | POST |
| | `/auth/logout` | POST |
| | `/auth/me` | GET |
| | `/auth/change-password` | PUT |
| **Users** | `/users/` | GET, POST |
| | `/users/:id` | GET, PUT, DELETE |
| | `/users/:id/role` | PATCH |
| | `/users/:id/presence` | PATCH |
| **Projects** | `/projects/` | GET, POST |
| | `/projects/:id` | GET, PUT, DELETE |
| | `/projects/:id/members` | POST |
| | `/projects/:id/members/:userId` | DELETE |
| **Todos** | `/projects/:projectId/todos/` | GET, POST |
| | `/projects/:projectId/todos/:id` | GET, PUT, DELETE |
| | `/projects/:projectId/todos/:id/status` | PATCH |
| | `/projects/:projectId/todos/:id/assign` | PATCH |
| **Channels** | `/channels/` | GET |
| | `/channels/:id` | GET, PUT, DELETE |
| | `/channels/direct` | POST |
| | `/channels/public` | POST |
| **Messages** | `/channels/:channelId/messages/` | GET, POST |
| | `/channels/:channelId/messages/:id` | PUT, DELETE |
| | `/channels/:channelId/messages/:id/thread` | GET |
| | `/channels/:channelId/messages/:id/read` | POST |
| | `/channels/:channelId/messages/:id/reactions` | POST |
| **Notifications** | `/notifications/` | GET |
| | `/notifications/unread-count` | GET |
| | `/notifications/read-all` | PATCH |
| | `/notifications/:id/read` | PATCH |

---

## 6. ROUTING

```typescript
// App.tsx
<Routes>
  <Route path="/login" element={<LoginPage />} />
  <Route element={<AuthGuard><AppLayout /></AuthGuard>}>
    <Route path="/" element={<Navigate to="/chat" />} />
    <Route path="/chat" element={<ChatPage />} />
    <Route path="/chat/:channelId" element={<ChatPage />} />
    <Route path="/admin" element={<AdminGuard><AdminPage /></AdminGuard>} />
  </Route>
  <Route path="*" element={<NotFoundPage />} />
</Routes>
```

---

## 7. KẾ HOẠCH PHÁT TRIỂN (PHASES)

### Phase 1: Foundation & Auth (Ngày 1-2)
> **Mục tiêu:** Setup project, design tokens, auth flow hoàn chỉnh.

- [ ] **1.1** Cài đặt dependencies: `zustand`, `react-router-dom`, `axios`, `socket.io-client`
- [ ] **1.2** Cấu hình Tailwind config với design tokens từ `code.html`
- [ ] **1.3** Tạo `index.css` với global styles (font Inter, no-scrollbar, glass-panel, primary-gradient)
- [ ] **1.4** Tạo `types/` — định nghĩa tất cả TypeScript interfaces
- [ ] **1.5** Tạo `services/api.ts` — Axios instance + JWT interceptors + auto refresh
- [ ] **1.6** Tạo `stores/authStore.ts` — login, logout, persist token
- [ ] **1.7** Tạo `services/authService.ts` — login, refresh, me, logout
- [ ] **1.8** Build `LoginPage.tsx` — email/password form, error handling
- [ ] **1.9** Build `AuthGuard` component — redirect to /login if no token
- [ ] **1.10** Cấu hình React Router trong `App.tsx`

### Phase 2: Layout Shell (Ngày 2-3)
> **Mục tiêu:** Dựng khung giao diện chính theo design, tất cả static.

- [ ] **2.1** Build `AppLayout.tsx` — 3-column layout (Sidebar + Main + RightPanel)
- [ ] **2.2** Build `TopBar.tsx` — Logo "WORKX", search input, My Task button, notification bell, dark mode toggle, user profile
- [ ] **2.3** Build `Sidebar.tsx` — 3 sections: Projects, General, Messages
- [ ] **2.4** Build `SidebarSection.tsx` + `SidebarItem.tsx` — reusable nav components
- [ ] **2.5** Build `RightPanel.tsx` — Work Todos header + Add Task button + placeholder
- [ ] **2.6** Build common components: `Avatar`, `Badge`, `Button`, `Input`, `Icon`
- [ ] **2.7** Build `UserListItem.tsx` — DM contacts with presence dots

### Phase 3: Channel & Messaging Core (Ngày 3-5)
> **Mục tiêu:** Chat real-time hoạt động đầy đủ.

- [ ] **3.1** Tạo `stores/channelStore.ts` — fetch channels, set active channel, unread counts
- [ ] **3.2** Tạo `services/channelService.ts` — API calls
- [ ] **3.3** Kết nối Sidebar với channelStore — hiển thị channels thực từ API
- [ ] **3.4** Tạo `stores/messageStore.ts` — messages by channel, cursor-based pagination
- [ ] **3.5** Tạo `services/messageService.ts` — API calls
- [ ] **3.6** Build `ChannelHeader.tsx` — channel name, star, info, add member
- [ ] **3.7** Build `PinnedBanner.tsx` — pinned message display
- [ ] **3.8** Build `MessageList.tsx` — infinite scroll up, load older messages
- [ ] **3.9** Build `MessageBubble.tsx` — layout self vs others, avatar, name, time, content
- [ ] **3.10** Build `MessageInput.tsx` — compose bar, attach, emoji, send
- [ ] **3.11** Build `AttachmentPreview.tsx` — file card display
- [ ] **3.12** Build `ReactionBar.tsx` — emoji reactions
- [ ] **3.13** Build `ReadReceipt.tsx` — "Read ✓✓" cho tin nhắn tự gửi

### Phase 4: Real-time & Socket.io (Ngày 5-6)
> **Mục tiêu:** Kết nối WebSocket, nhận tin nhắn real-time, presence, typing.

- [ ] **4.1** Tạo `services/socket.ts` — Socket.io singleton, JWT auth
- [ ] **4.2** Tạo `hooks/useSocket.ts` — connect on login, disconnect on logout
- [ ] **4.3** Kết nối socket events → messageStore (new_message, updated, deleted)
- [ ] **4.4** Tạo `stores/presenceStore.ts` — track online users
- [ ] **4.5** Kết nối socket → presenceStore (user_presence events)
- [ ] **4.6** Build `TypingIndicator.tsx` + `hooks/useTypingIndicator.ts`
- [ ] **4.7** Implement optimistic message sending (pending → confirmed → failed)
- [ ] **4.8** Implement auto mark-as-read khi user scroll đến bottom

### Phase 5: Projects & Work Todos (Ngày 6-7)
> **Mục tiêu:** Quản lý project và tasks trong right panel.

- [ ] **5.1** Tạo `stores/projectStore.ts` + `services/projectService.ts`
- [ ] **5.2** Kết nối Sidebar Projects section với real data
- [ ] **5.3** Tạo `stores/todoStore.ts` + `services/todoService.ts`
- [ ] **5.4** Build `TodoCard.tsx` — priority badge, checkbox, title, due date, assignees
- [ ] **5.5** Build `TodoList.tsx` — render list of TodoCards
- [ ] **5.6** Build `AddTaskModal.tsx` — glass-panel modal, form fields
- [ ] **5.7** Build `TaskCheckbox.tsx` — toggle done state
- [ ] **5.8** Build `ProductivityCard.tsx` — dark card with stats + progress bar
- [ ] **5.9** Implement status flow: TODO → IN_PROGRESS → IN_REVIEW → DONE
- [ ] **5.10** Implement assign task (RBAC-aware)

### Phase 6: Notifications & Polish (Ngày 7-8)
> **Mục tiêu:** Notifications, admin page, final polish.

- [ ] **6.1** Tạo `stores/notificationStore.ts` + `services/notificationService.ts`
- [ ] **6.2** Build `NotificationBell.tsx` — bell icon + unread badge
- [ ] **6.3** Build `NotificationDropdown.tsx` — glass-panel popover with list
- [ ] **6.4** Build `AdminPage.tsx` — user management table (Admin only)
- [ ] **6.5** Build `UserProfile.tsx` — profile dropdown with logout
- [ ] **6.6** Implement dark mode toggle (Tailwind `dark:` classes)
- [ ] **6.7** Implement search workspace functionality
- [ ] **6.8** Responsive adjustments & accessibility
- [ ] **6.9** Error boundaries & global error handling
- [ ] **6.10** Performance audit: lazy loading, memo, virtualization

---

## 8. CHIẾN LƯỢC HIỆU NĂNG

| Vấn đề | Giải pháp |
|---|---|
| Danh sách tin nhắn dài | Cursor-based pagination + `useInfiniteScroll` |
| Re-render không cần thiết | Zustand selectors, `React.memo`, `useMemo` |
| Bundle size | Code splitting by route (`React.lazy`) |
| Message list scroll perf | CSS `contain: content`, batch DOM updates |
| Typing indicator spam | Debounce 300ms, throttle socket emit |
| Token expiry | Silent refresh via interceptor, request queue |
| Image/avatar loading | Lazy loading `loading="lazy"`, placeholder skeleton |

---

## 9. TỔNG KẾT

**Ước lượng thời gian:** 8-10 ngày làm việc cho 1 developer.
**Ưu tiên #1:** Chat real-time (Phase 1-4) — core feature.
**Ưu tiên #2:** Work Todos (Phase 5) — secondary feature.
**Ưu tiên #3:** Admin & Polish (Phase 6) — nice-to-have.

**Nguyên tắc phát triển:**
- Component nhỏ, tái sử dụng, props rõ ràng.
- Store tách biệt theo domain, không trộn lẫn.
- Service layer đóng gói toàn bộ API calls.
- Optimistic updates cho mọi user action.
- Design pixel-perfect theo `screen.png` và `code.html`.
