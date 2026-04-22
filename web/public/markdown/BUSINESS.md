# WORKX BACKEND - BẢN ĐỒ NGHIỆP VỤ (BUSINESS LOGIC LANDSCAPE)

Tài liệu này mô tả toàn cảnh các luồng nghiệp vụ, cơ chế phân quyền, và các chiến lược hệ thống nền tảng cho backend của WorkX.

---

## 1. TỔNG QUAN TÍNH NĂNG & LUỒNG NGHIỆP VỤ (CORE DOMAINS)

### 1.1. Authentication & User Management
* **Đăng nhập/Đăng xuất:** Sử dụng JWT (JSON Web Token) cho Stateless Authentication. Token chứa `user_id` và `role_id` để tiện cho việc kiểm tra quyền ở Middleware.
* **Quản lý nhân sự:** * Định danh chính: Email.
    * Admin có quyền thêm, sửa (thông tin, role), xóa (Soft Delete) user.
    * Cập nhật `presence_status` (ONLINE, OFFLINE, BUSY) tự động thông qua kết nối WebSocket.

### 1.2. Project & Work Todo Management
* **Project:** Nơi gom nhóm các Members và Work Todos. Khi một Project được tạo, backend sẽ tự động tạo một Channel type `PROJECT` tương ứng để trao đổi.
* **Work Todo (Hierarchical Tasks):**
    * Hỗ trợ cấu trúc cha - con (`parent_id`) để chia nhỏ công việc.
    * Luồng trạng thái: `TODO` -> `IN_PROGRESS` -> `IN_REVIEW` -> `DONE` -> `ARCHIVED`.
    * Logic gán việc (Assign) được chặn chặt chẽ tại Backend theo RBAC (xem mục 2).

### 1.3. Chat & Messaging System (Core)
* **Định tuyến Kênh (Channel Routing):**
    * `DIRECT`: 1vs1. Backend kiểm tra bảng `channel_members` xem 2 người đã có kênh chung chưa, nếu chưa thì tạo mới.
    * `PROJECT`: Kênh chat tự động dựa trên `project_members`.
    * `PUBLIC`: Kênh chung (VD: Tán gẫu, Đặt đồ ăn) do Admin quản lý. Mọi active users đều có thể truy cập đọc/ghi.
* **Tin nhắn & Threading:** Hỗ trợ reply tin nhắn qua `parent_id`. 
* **Read Receipts:** Tính toán số tin nhắn chưa đọc thông qua việc so sánh `id` của tin nhắn mới nhất với `last_read_message_id` của user trong kênh.
* **Attachments:** Upload file lên cloud storage (S3/GCS), lưu URL và metadata vào database trước khi broadcast tin nhắn.

---

## 2. HỆ THỐNG PHÂN QUYỀN (RBAC - ROLE BASED ACCESS CONTROL)

Việc kiểm tra quyền được thực hiện ở tầng Middleware hoặc Service Layer, tuyệt đối không dùng Trigger của Database.

| Domain / Hành động | Admin | PM (Project Manager) | Member |
| :--- | :--- | :--- | :--- |
| **User** | Toàn quyền (Thêm, Sửa role, Soft Delete). | Chỉ xem danh sách (Read-only). | Chỉ xem danh sách và sửa profile cá nhân. |
| **Project** | Toàn quyền vào mọi project. | Tạo, Sửa, Đóng project. Quản lý member trong project của mình. | Chỉ xem và thao tác trong project được thêm vào. |
| **Work Todo** | Gán task cho mọi role. Sửa/Xóa mọi task. | Gán task cho PM khác và Member trong project. | Chỉ được tự gán task cho chính mình (Self-assign). Cập nhật trạng thái. |
| **Channel (Public)**| Tạo, Đổi tên, Xóa kênh. | Chat. | Chat. |
| **Channel (Project)**| Chat, vào mọi kênh dự án. | Chat. | Chat. |
| **Message** | Xóa mọi tin nhắn vi phạm. | Xóa tin nhắn trong project của mình. | Xóa/Sửa tin nhắn của chính mình. |

---

## 3. CHIẾN LƯỢC REAL-TIME & NOTIFICATION (THÔNG BÁO)

Với quy mô ~100 user, hệ thống cần phản hồi tức thời nhưng không cần kiến trúc quá cồng kềnh.

* **Kết nối:** Sử dụng `Socket.io` (hoặc `ws`) kết nối trực tiếp với client. Xác thực socket connection bằng JWT.
* **Cơ chế Pub/Sub:** Tích hợp **Redis Pub/Sub**. Khi backend nhận 1 tin nhắn REST API, nó lưu DB xong sẽ `publish` event vào Redis. Các Socket server sẽ `subscribe` và đẩy (emit) về cho đúng user/room. Điều này giúp dễ dàng scale backend thành nhiều instances (Load Balancing) mà không bị mất tin nhắn.
* **Room Strategy:** Mỗi user sẽ tự động join vào các Socket Rooms tương ứng: `user_{id}`, `channel_{id}`, `project_{id}`.
* **Notification Flow (In-app & Push):**
    * Nếu user đang online (trong room): Emit event `new_message` hoặc `task_assigned` để cập nhật UI ngay lập tức.
    * Nếu user offline: Increment bộ đếm Unread. Đối với các sự kiện quan trọng (bị tag `@`, bị gán task `URGENT`), đẩy message qua queue job (ví dụ: BullMQ) để gửi Email thông báo.

---

## 4. CHIẾN LƯỢC QUẢN LÝ DỮ LIỆU & LƯU VẾT

### 4.1. Soft Delete (Xóa mềm)
* **Nguyên tắc:** Dữ liệu trong hệ thống mạng nội bộ hiếm khi bị xóa hẳn (Hard Delete) để đảm bảo tính toàn vẹn và tra cứu sau này.
* **Thực thi:** Sử dụng các trường `is_active` (cho User/Project) hoặc `deleted_at` (cho Messages/Tasks).
* **Hậu quả query:** Mọi câu query `GET` mặc định ở backend phải có điều kiện `WHERE deleted_at IS NULL` hoặc `WHERE is_active = TRUE`.

### 4.2. Audit Logs (Nhật ký hệ thống)
* **Mục đích:** Theo dõi các hành động nhạy cảm để quy trách nhiệm khi có sự cố. Đối với WorkX, không cần log thao tác chat, nhưng phải log các thao tác quản trị.
* **Đối tượng cần log:**
    * Admin thao tác với User (Đổi role, Xóa user).
    * PM thao tác với Project (Xóa project).
    * Mọi thay đổi trạng thái (Status) của Work Todo.
* **Cấu trúc bảng `audit_logs`:**
    * `id` (UUID)
    * `actor_id` (Ai thực hiện)
    * `action` (VD: 'UPDATE_USER_ROLE', 'DELETE_PROJECT')
    * `entity_type` (VD: 'USER', 'PROJECT', 'WORK_TODO')
    * `entity_id` (ID của dòng dữ liệu bị tác động)
    * `old_values` (JSONB)
    * `new_values` (JSONB)
    * `ip_address`, `user_agent`
    * `created_at`

### 4.3. Data Pagination & Indexing
* **Cursor-based Pagination:** Bắt buộc áp dụng cho API lấy danh sách `messages`. Client gửi lên `last_message_id`, backend query `WHERE id < last_message_id ORDER BY id DESC LIMIT 20`. Tốc độ ổn định O(1) bất kể dữ liệu lớn đến đâu.
* **Offset-based Pagination:** Áp dụng cho các trang quản trị (Danh sách User, Danh sách Project) có tích hợp bộ lọc (Filter) và sắp xếp (Sort).

---

## 5. CẤU TRÚC KIẾN TRÚC BACKEND (GỢI Ý)

Sử dụng mô hình 3 lớp (3-Layer Architecture) để tách biệt trách nhiệm:

1.  **Controllers (Routes Layer):** Chỉ xử lý req/res, parse body, gọi Service tương ứng.
2.  **Services (Business Logic Layer):** Nơi chứa toàn bộ luật RBAC, kiểm tra điều kiện (Ai được gán task cho ai?), chuẩn bị dữ liệu.
3.  **Data Access (Repository / ORM Layer):** Giao tiếp với PostgreSQL, thực thi các câu lệnh query. (Khuyến nghị dùng Prisma hoặc Kysely để đảm bảo Type-safe với TypeScript).

**Xử lý Lỗi (Global Error Handling):**
Mọi lỗi ở Service sẽ ném ra các Custom Error (VD: `NotFoundError`, `ForbiddenError`). Controller catch lỗi và đưa xuống một Middleware `errorHandler` duy nhất ở cuối vòng đời Express để chuẩn hóa định dạng trả về (VD: `{ "success": false, "code": 403, "message": "You don't have permission to assign this task." }`).