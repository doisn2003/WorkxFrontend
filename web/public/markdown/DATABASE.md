-- =============================================
-- WORKX DATABASE SCHEMA (Full - Cập nhật Phase 1)
-- =============================================

-- ENUMS
CREATE TYPE channel_type_enum AS ENUM ('DIRECT', 'PROJECT', 'PUBLIC');
CREATE TYPE task_status_enum AS ENUM ('TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE', 'ARCHIVED');
CREATE TYPE task_priority_enum AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- ==========================================
-- 1. QUẢN LÝ USER & RBAC
-- ==========================================
CREATE TABLE roles (
    id SMALLSERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL, -- 'admin', 'pm', 'member'
    description TEXT
);

CREATE TABLE users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,          -- [MỚI] Bcrypt hash
    phone VARCHAR(20) UNIQUE,
    role_id SMALLINT NOT NULL REFERENCES roles(id),
    family_and_middle_name VARCHAR(150) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    avatar_url TEXT,
    date_of_birth DATE,
    presence_status VARCHAR(20) DEFAULT 'OFFLINE',
    working_hours JSONB,
    is_active BOOLEAN DEFAULT TRUE,               -- Soft delete cho user
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 2. DỰ ÁN & QUẢN LÝ CÔNG VIỆC (HIERARCHICAL)
-- ==========================================
CREATE TABLE projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    owner_id UUID NOT NULL REFERENCES users(id),
    is_active BOOLEAN DEFAULT TRUE,               -- [MỚI] Soft delete cho project
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE project_members (
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (project_id, user_id)
);

CREATE TABLE work_todos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES work_todos(id) ON DELETE CASCADE,
    creator_id UUID NOT NULL REFERENCES users(id),
    assignee_id UUID REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status task_status_enum DEFAULT 'TODO',
    priority task_priority_enum DEFAULT 'MEDIUM',
    due_date TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ,                       -- [MỚI] Soft delete
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 3. HỆ THỐNG TIN NHẮN (MESSAGING SYSTEM)
-- ==========================================
CREATE TABLE channels (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255),
    type channel_type_enum NOT NULL,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    created_by UUID REFERENCES users(id),
    is_archived BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE channel_members (
    channel_id UUID REFERENCES channels(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    last_read_message_id BIGINT,
    PRIMARY KEY (channel_id, user_id)
);

CREATE TABLE messages (
    id BIGSERIAL PRIMARY KEY,
    channel_id UUID NOT NULL REFERENCES channels(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id),
    parent_id BIGINT REFERENCES messages(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    metadata JSONB,
    deleted_at TIMESTAMPTZ,                       -- [MỚI] Soft delete
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE attachments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    message_id BIGINT NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_size INT,
    mime_type VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 4. AUDIT LOGS (Nhật ký hệ thống)        [MỚI]
-- ==========================================
CREATE TABLE audit_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    actor_id UUID NOT NULL REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 5. NOTIFICATIONS (Thông báo in-app)      [MỚI]
-- ==========================================
CREATE TABLE notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    body TEXT,
    reference_type VARCHAR(50),
    reference_id VARCHAR(255),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 6. REFRESH TOKENS (JWT Auth)             [MỚI]
-- ==========================================
CREATE TABLE refresh_tokens (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    device_info JSONB,
    expires_at TIMESTAMPTZ NOT NULL,
    revoked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 7. INDEXES
-- ==========================================
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_active ON users(is_active);
CREATE INDEX idx_todos_parent ON work_todos(parent_id);
CREATE INDEX idx_work_todos_project ON work_todos(project_id);
CREATE INDEX idx_work_todos_assignee ON work_todos(assignee_id);
CREATE INDEX idx_work_todos_status ON work_todos(status);
CREATE INDEX idx_channels_type ON channels(type);
CREATE INDEX idx_channels_project ON channels(project_id);
CREATE INDEX idx_messages_channel_pagination ON messages(channel_id, id DESC);
CREATE INDEX idx_attachments_message ON attachments(message_id);
CREATE INDEX idx_audit_logs_actor ON audit_logs(actor_id);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_notifications_user ON notifications(user_id, is_read, created_at DESC);
CREATE INDEX idx_refresh_tokens_user ON refresh_tokens(user_id);