import { Icon } from '@/components/common/Icon';
import { Badge } from '@/components/common/Badge';
import { useUiStore } from '@/stores/uiStore';
import { cn } from '@/utils/cn';

/**
 * Right Panel — Work Todos sidebar.
 * Pixel-perfect match to code.html lines 308-375.
 * Collapsible with smooth width + opacity animation.
 */
export function RightPanel() {
  const isOpen = useUiStore((s) => s.isRightPanelOpen);
  const toggle = useUiStore((s) => s.toggleRightPanel);

  return (
    <div className="relative flex-shrink-0 h-full">
      {/* Toggle button — circular, always visible at the panel edge */}
      <button
        onClick={toggle}
        className="absolute top-4 -left-3.5 z-10 w-7 h-7 rounded-full bg-white shadow-ambient-md border border-zinc-100 flex items-center justify-center text-zinc-400 hover:text-zinc-900 hover:scale-110 active:scale-95"
        title={isOpen ? 'Thu gọn' : 'Mở rộng'}
      >
        <Icon name={isOpen ? 'chevron_right' : 'chevron_left'} size={16} />
      </button>

      {/* Panel */}
      <aside
        className={cn(
          'bg-zinc-50 h-full flex flex-col transition-all duration-300 ease-in-out overflow-hidden',
          isOpen ? 'w-[320px]' : 'w-0',
        )}
      >
        <div
          className={cn(
            'flex flex-col gap-6 h-full p-8 min-w-[288px] transition-opacity duration-200',
            isOpen ? 'opacity-100' : 'opacity-0',
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black tracking-tighter text-zinc-900 uppercase">
              Công Việc
            </h2>
            <button className="primary-gradient text-white px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest hover:opacity-90 flex items-center gap-1.5">
              <Icon name="add" size={16} />
              Thêm
            </button>
          </div>

          {/* Task cards */}
          <div className="space-y-4 flex-grow overflow-y-auto no-scrollbar">
            <TaskCard
              priority="urgent"
              title="Xem lại bài trình bày lộ trình Q4"
              dueText="Hôm nay, 17:00"
              assigneeCount={2}
            />
            <TaskCard
              priority="medium"
              label="Thiết kế"
              title="Hoàn thiện animation Xpiano Prototype"
              dueText="Ngày mai, 10:00"
              assigneeCount={1}
            />
            <TaskCard
              done
              label="Marketing"
              title="Soạn email thông báo"
              dueText="Hoàn thành 2 giờ trước"
              assigneeCount={1}
            />
          </div>

          {/* Productivity card */}
          <div className="mt-auto bg-zinc-900 rounded-2xl p-6 relative overflow-hidden group flex-shrink-0">
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
            <h4 className="text-white text-sm font-bold mb-2 relative z-10">
              Hiệu suất làm việc
            </h4>
            <p className="text-zinc-400 text-xs leading-relaxed mb-4 relative z-10">
              Bạn đã hoàn thành 85% công việc trong tuần này. Tiếp tục phát huy!
            </p>
            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
              <div className="bg-white h-full w-[85%] rounded-full" />
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

// ---- TaskCard ----

interface TaskCardProps {
  priority?: 'urgent' | 'high' | 'medium' | 'low';
  label?: string;
  title: string;
  dueText: string;
  done?: boolean;
  assigneeCount?: number;
}

function TaskCard({ priority, label, title, dueText, done = false, assigneeCount = 1 }: TaskCardProps) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-ambient-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-float cursor-pointer">
      {/* Top row: badge + assignees */}
      <div className="flex items-start justify-between mb-4">
        {done ? (
          <Badge variant="default">{label ?? 'Hoàn thành'}</Badge>
        ) : priority === 'urgent' ? (
          <Badge variant="urgent">Khẩn cấp</Badge>
        ) : (
          <Badge variant="medium">{label ?? 'Công việc'}</Badge>
        )}
        {/* Assignee avatar placeholders */}
        <div className="flex -space-x-2">
          {Array.from({ length: assigneeCount }).map((_, i) => (
            <div
              key={i}
              className="w-6 h-6 rounded-full bg-zinc-200 border-2 border-white"
            />
          ))}
        </div>
      </div>

      {/* Checkbox + title */}
      <div className="flex items-start gap-3">
        {done ? (
          <div className="mt-0.5 w-4 h-4 rounded-sm bg-zinc-900 flex items-center justify-center flex-shrink-0">
            <Icon name="done" size={12} className="text-white" />
          </div>
        ) : (
          <div className="mt-0.5 w-4 h-4 rounded border-2 border-zinc-200 cursor-pointer flex-shrink-0 hover:border-primary" />
        )}
        <div>
          <h3
            className={cn(
              'text-sm font-bold leading-tight',
              done ? 'text-zinc-400 line-through' : 'text-zinc-900',
            )}
          >
            {title}
          </h3>
          <p className="text-[10px] text-zinc-400 mt-2 font-semibold uppercase tracking-wide">
            {dueText}
          </p>
        </div>
      </div>
    </div>
  );
}
