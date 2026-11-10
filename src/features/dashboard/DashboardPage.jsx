import { Link } from 'react-router-dom';
import { Clock, MessageSquare, Receipt, Users } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { Card } from '@/components/Card';
import { PageHeader } from '@/components/PageHeader';
import { StatusBadge } from '@/components/StatusBadge';
import { timeAgo } from '@/lib/time';
import { useViewer } from '@/lib/viewer';
import { useDashboardQuery } from './dashboardQueries';

function Stat({ to, icon: Icon, label, value, hint }) {
  return (
    <Link to={to} className="group block">
      <Card className="p-4 transition group-hover:-translate-y-0.5 group-hover:border-white/20">
        <div className="flex items-start justify-between">
          <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
          <div className="flex size-8 items-center justify-center rounded-lg bg-signal/10 text-signal">
            <Icon className="size-4" />
          </div>
        </div>
        <p className="mt-2 text-3xl font-bold tabular-nums text-foreground">{value}</p>
        <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
      </Card>
    </Link>
  );
}

export default function DashboardPage() {
  const { viewer, isAdmin } = useViewer();
  const { data, isLoading } = useDashboardQuery();

  if (isLoading || !data) {
    return (
      <div className="flex justify-center py-24">
        <Spinner size="lg" className="text-muted-foreground" />
      </div>
    );
  }

  const maxHours = Math.max(1, ...data.hoursByCampaign.map((row) => row.hours));

  return (
    <div>
      <PageHeader
        eyebrow={isAdmin ? 'Overview' : 'Welcome back'}
        title={isAdmin ? `Good to see you, ${viewer.name.split(' ')[0]}` : `Hi ${viewer.name.split(' ')[0]}`}
        description={
          isAdmin
            ? 'What needs your attention across the programme right now.'
            : 'Your hours, expenses and messages at a glance.'
        }
      />

      <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Stat
          to="/submissions"
          icon={Clock}
          label={isAdmin ? 'Timesheets to review' : 'Timesheets in review'}
          value={data.pendingTimesheets}
          hint={`${data.approvedHours}h approved or paid so far`}
        />
        <Stat
          to="/expenses"
          icon={Receipt}
          label={isAdmin ? 'Expenses to review' : 'Expenses in review'}
          value={data.pendingExpenseCount}
          hint={`${data.pendingExpenseTotal} awaiting a decision`}
        />
        <Stat
          to="/inbox"
          icon={MessageSquare}
          label="Unread messages"
          value={data.unreadMessages}
          hint={data.unreadMessages ? 'Open the inbox to reply' : 'You are all caught up'}
        />
        {isAdmin ? (
          <Stat
            to="/ambassadors"
            icon={Users}
            label="Ambassadors online"
            value={data.online}
            hint={`of ${data.totalAmbassadors} active accounts`}
          />
        ) : (
          <Stat to="/campaigns" icon={Users} label="My campaigns" value={data.hoursByCampaign.length || '—'} hint="Open one for resources" />
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="p-5 lg:col-span-3">
          <h2 className="mb-4 text-sm font-semibold text-foreground">Approved hours by campaign</h2>
          {data.hoursByCampaign.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No approved hours yet.</p>
          ) : (
            <ul className="space-y-3">
              {data.hoursByCampaign.map((row) => (
                <li key={row.code}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="font-medium text-foreground/90">{row.label}</span>
                    <span className="tabular-nums text-muted-foreground">{row.hours}h</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${(row.hours / maxHours) * 100}%`,
                        background: `hsl(${row.hue} 65% 42%)`,
                      }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="p-5 lg:col-span-2">
          <h2 className="mb-4 text-sm font-semibold text-foreground">Recent activity</h2>
          <ul className="divide-y divide-border">
            {data.activity.map((item) => (
              <li key={item.id} className="flex items-center justify-between gap-3 py-2.5">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{isAdmin ? item.who : item.text}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {isAdmin ? item.text : item.kind} · {timeAgo(item.at)}
                  </p>
                </div>
                <StatusBadge status={item.status} />
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
