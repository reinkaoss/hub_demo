import { useQueryClient } from '@tanstack/react-query';
import { motion } from 'motion/react';
import {
  Clock,
  LayoutDashboard,
  Megaphone,
  Plus,
  Receipt,
  RotateCcw,
  Users,
  MessageSquare,
} from 'lucide-react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { MagneticDock } from '@/components/layout/MagneticDock';
import { resetDb } from '@/data/store';
import { useThreadsQuery } from '@/features/inbox/inboxQueries';
import { cn } from '@/lib/utils';
import { useViewer } from '@/lib/viewer';

const ADMIN_NAV = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/campaigns', label: 'Campaigns', icon: Megaphone },
  { to: '/submissions', label: 'Submissions', icon: Clock },
  { to: '/expenses', label: 'Expenses', icon: Receipt },
  { to: '/ambassadors', label: 'Ambassadors', icon: Users },
  { to: '/inbox', label: 'Inbox', icon: MessageSquare, separated: true },
];

const AMBASSADOR_NAV = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/campaigns', label: 'Campaigns', icon: Megaphone },
  { to: '/submissions', label: 'Timesheets', icon: Clock, end: true },
  { to: '/expenses', label: 'Expenses', icon: Receipt },
  { to: '/submissions/new', label: 'New timesheet', icon: Plus, separated: true },
  { to: '/inbox', label: 'Inbox', icon: MessageSquare },
];

function Logo() {
  return (
    <NavLink to="/" className="flex items-center gap-2.5 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-purple-medium">
      <svg viewBox="0 0 32 32" className="size-8" aria-hidden="true">
        <rect width="32" height="32" rx="8" fill="currentColor" className="text-purple-medium" />
        <path
          d="M9 21.5V10.5l7 4.2 7-4.2v11"
          fill="none"
          stroke="#fff"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <div className="leading-tight">
        <p className="text-sm font-semibold text-foreground">Ambassador Console</p>
        <p className="text-[0.6rem] font-medium uppercase tracking-[0.16em] text-muted-foreground">In-memory demo</p>
      </div>
    </NavLink>
  );
}

function RoleSwitch() {
  const { role, setRole } = useViewer();
  const navigate = useNavigate();
  const choose = (next) => {
    if (next === role) return;
    setRole(next);
    navigate('/');
  };

  return (
    <div role="group" aria-label="View as" className="inline-flex rounded-full bg-[#111] p-1 text-xs font-medium ring-1 ring-white/10">
      {[
        ['admin', 'Admin'],
        ['ambassador', 'Ambassador'],
      ].map(([value, label]) => {
        const active = role === value;
        return (
          <button
            key={value}
            type="button"
            onClick={() => choose(value)}
            aria-pressed={active}
            className={cn(
              'relative rounded-full px-3 py-1.5 transition-colors',
              active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {active ? (
              <motion.span
                layoutId="role-pill"
                className="absolute inset-0 rounded-full bg-[#2a2a2a]"
                transition={{ type: 'spring', stiffness: 420, damping: 32 }}
              />
            ) : null}
            <span className="relative">{label}</span>
          </button>
        );
      })}
    </div>
  );
}

export default function AppShell() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { viewer, isAdmin } = useViewer();
  const { data: threads = [] } = useThreadsQuery();
  const unread = threads.filter((thread) => thread.unread).length;
  const items = (isAdmin ? ADMIN_NAV : AMBASSADOR_NAV).map((item) =>
    item.to === '/inbox' ? { ...item, badge: unread } : item,
  );

  function reset() {
    resetDb();
    queryClient.clear();
    navigate('/');
    toast.success('Demo data reset', { description: 'Everything is back to its starting state.' });
  }

  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-background/85 px-4 py-3 backdrop-blur-md">
        <Logo />
        <div className="ml-auto flex items-center gap-3">
          <span className="hidden text-xs text-muted-foreground sm:inline">
            Viewing as <strong className="font-medium text-foreground">{viewer.name}</strong>
          </span>
          <RoleSwitch />
          <Button variant="ghost" size="sm" onClick={reset} title="Reset demo data">
            <RotateCcw /> <span className="hidden sm:inline">Reset</span>
          </Button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 pt-6 pb-32 md:px-8 md:pt-8">
        <Outlet />
      </main>

      <MagneticDock items={items} />
    </div>
  );
}
