import { Outlet } from 'react-router-dom';
import { TopBar } from '@/components/layout/TopBar';
import { Sidebar } from '@/components/layout/Sidebar';
import { RightPanel } from '@/components/layout/RightPanel';
import { useSocket } from '@/hooks/useSocket';

/**
 * AppLayout — 3-column layout matching code.html structure.
 * TopBar (fixed h-16) + Sidebar (w-64 zinc-50) + Main (white flex-grow) + RightPanel (320px collapsible)
 * Also initializes WebSocket connection via useSocket().
 */
export function AppLayout() {
  // Connect WebSocket when authenticated — routes events to stores
  useSocket();

  return (
    <div className="flex flex-col h-screen w-screen bg-surface text-on-surface overflow-hidden">
      <TopBar />
      <div className="flex flex-1 pt-16 h-full overflow-hidden">
        <Sidebar />
        <main className="flex-grow flex flex-col bg-white h-full overflow-hidden relative min-w-0">
          <Outlet />
        </main>
        <RightPanel />
      </div>
    </div>
  );
}
