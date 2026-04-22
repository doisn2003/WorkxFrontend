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
            <Route path="/" element={<Navigate to="/chat" replace />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/chat/:channelId" element={<ChatPage />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
