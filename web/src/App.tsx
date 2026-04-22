import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthGuard } from '@/components/common/AuthGuard';
import { LoginPage } from '@/pages/LoginPage';
import { ChatPage } from '@/pages/ChatPage';
import { AppLayout } from '@/layouts/AppLayout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected routes — wrapped in AppLayout */}
        <Route element={<AuthGuard />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<ChatPage />} />
            {/* Future: /chat/:channelId, /projects/:id, /admin, etc. */}
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
