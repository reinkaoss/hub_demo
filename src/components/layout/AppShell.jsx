import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import {
  Clock,
  LayoutDashboard,
  Megaphone,
  Menu,
  MessageSquare,
  Plus,
  Receipt,
  RotateCcw,
  Users,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
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
  { to: '/inbox', label: 'Inbox', icon: MessageSquare },
];

const AMBASSADOR_NAV = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/campaigns', label: 'My campaigns', icon: Megaphone },
  { to: '/submissions', label: 'My timesheets', icon: Clock, end: true },
  { to: '/submissions/new', label: 'New timesheet', icon: Plus },
  { to: '/expenses', label: 'My expenses', icon: Receipt },
  { to: '/inbox', label: 'Inbox', icon: MessageSquare },
];

function Logo({ compact = false }) {
  return (
    <div className="flex items-center gap-2.5">
      <svg viewBox="0 0 32 32" className="size-8" aria-hidden="true">
        <rect width="32" height="32" rx="8" fill="currentColor" className="text-signal" />
        <path d="M9 21.5V10.5l7 4.2 7-4.2v11" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div className={cn('leading-tight', compact && 'hidden')}>
        <p className="text-sm font-bold text-slate-900">Ambassador Console</p>
        <p className="text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-signal">Interactive demo</p>
      </div>
    </div>
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
    <div role="group" aria-label="View as" className="inline-flex rounded-lg bg-slate-100 p-0.5 text-xs font-semibold">
      {[
        ['admin', 'Admin'],
        ['ambassador', 'Ambassador'],
      ].map(([value, label]) => (
        <button
          key={value}
          type="button"
          onClick={() => choose(value)}
          aria-pressed={role === value}
          className={cn(
            'rounded-md px-3 py-1.5 transition',
            role === value ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800',
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function NavList({ onNavigate }) {
  const { isAdmin } = useViewer();
  const { data: threads = [] } = useThreadsQuery();
  const unread = threads.filter((thread) => thread.unread).length;
  const items = isAdmin ? ADMIN_NAV : AMBASSADOR_NAV;

  return (
    <nav className="flex flex-col gap-1" aria-label="Main">
      {items.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition',
              isActive ? 'bg-signal/10 text-signal' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
            )
          }
        >
          <Icon className="size-4" />
          <span className="flex-1">{label}</span>
          {to === '/inbox' && unread > 0 ? (
            <span className="rounded-full bg-signal px-1.5 py-0.5 text-[0.65rem] font-bold leading-none text-white">
              {unread}
            </span>
          ) : null}
        </NavLink>
      ))}
    </nav>
  );
}

export default function AppShell() {
  const [menuOpen, setMenuOpen] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { viewer } = useViewer();

  function reset() {
    resetDb();
    queryClient.clear();
    navigate('/');
    toast.success('Demo data reset to its starting state');
  }

  return (
    <div className="min-h-dvh md:grid md:grid-cols-[250px_1fr]">
      <aside className="hidden border-r border-slate-200 bg-white p-4 md:sticky md:top-0 md:flex md:h-dvh md:flex-col">
        <Logo />
        <div className="mt-8 flex-1">
          <NavList />
        </div>
        <p className="rounded-xl bg-slate-50 p-3 text-[0.7rem] leading-relaxed text-slate-500">
          Everything here is fictional and lives in memory. There is no sign-in and no database; a refresh starts over.
        </p>
      </aside>

      <div className="flex min-w-0 flex-col">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Open menu"
            onClick={() => setMenuOpen(true)}
          >
            <Menu />
          </Button>
          <div className="md:hidden">
            <Logo compact />
          </div>
          <div className="ml-auto flex items-center gap-3">
            <span className="hidden text-xs text-slate-500 sm:inline">
              Viewing as <strong className="font-semibold text-slate-800">{viewer.name}</strong>
            </span>
            <RoleSwitch />
            <Button variant="ghost" size="sm" onClick={reset} title="Reset demo data">
              <RotateCcw /> <span className="hidden sm:inline">Reset</span>
            </Button>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 md:px-8 md:py-8">
          <Outlet />
        </main>
      </div>

      {menuOpen ? (
        <div className="fixed inset-0 z-40 md:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="absolute inset-0 bg-slate-900/40" onClick={() => setMenuOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-72 bg-white p-4 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <Logo />
              <Button variant="ghost" size="icon" aria-label="Close menu" onClick={() => setMenuOpen(false)}>
                <X />
              </Button>
            </div>
            <NavList onNavigate={() => setMenuOpen(false)} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
