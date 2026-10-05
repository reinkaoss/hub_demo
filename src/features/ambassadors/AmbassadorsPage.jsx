import { useState } from 'react';
import { Ban, Search, ShieldAlert, UserCheck, Users } from 'lucide-react';
import { toast } from 'sonner';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card } from '@/components/Card';
import { EmptyState } from '@/components/EmptyState';
import { PageHeader } from '@/components/PageHeader';
import { StatusBadge } from '@/components/StatusBadge';
import { cn } from '@/lib/utils';
import { useViewer } from '@/lib/viewer';
import { useAmbassadorsQuery, useSetSuspended } from './ambassadorsQueries';
import { describePresence } from './presence';

const DOT = { online: 'bg-emerald-500', idle: 'bg-slate-300', never: 'bg-amber-400' };
const TEXT = { online: 'text-emerald-700 font-semibold', idle: 'text-slate-500', never: 'text-amber-700' };

const initials = (name) =>
  name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('');

export default function AmbassadorsPage() {
  const { isAdmin } = useViewer();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [activation, setActivation] = useState('all');
  const { data: rows = [], isLoading } = useAmbassadorsQuery({ search, status, activation });
  const suspend = useSetSuspended();

  if (!isAdmin) {
    return (
      <div>
        <PageHeader eyebrow="Ambassadors" title="Ambassadors" />
        <EmptyState icon={ShieldAlert} title="Admins only" description="Switch to the admin view to manage ambassadors." />
      </div>
    );
  }

  async function toggle(ambassador) {
    try {
      await suspend.mutateAsync({ id: ambassador.id, suspended: !ambassador.suspended });
      toast.success(ambassador.suspended ? `${ambassador.name} reinstated` : `${ambassador.name} suspended`);
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <div>
      <PageHeader
        eyebrow="Ambassadors"
        title="Ambassadors"
        description="Everyone on the programme. Filter by account status or by whether they have ever signed in."
      />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search name or email"
            className="pl-9"
            aria-label="Search ambassadors"
          />
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-40" aria-label="Filter by status">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All accounts</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>
        <Select value={activation} onValueChange={setActivation}>
          <SelectTrigger className="w-44" aria-label="Filter by activation">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any activation</SelectItem>
            <SelectItem value="activated">Activated</SelectItem>
            <SelectItem value="not_activated">Not activated</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Spinner size="lg" className="text-slate-300" />
        </div>
      ) : rows.length === 0 ? (
        <EmptyState icon={Users} title="No ambassadors match" description="Try clearing a filter." />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-signal hover:bg-signal">
                  <TableHead>Ambassador</TableHead>
                  <TableHead>University</TableHead>
                  <TableHead>Campaigns</TableHead>
                  <TableHead>Activity</TableHead>
                  <TableHead>Account</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((ambassador) => {
                  const presence = describePresence(ambassador);
                  return (
                    <TableRow key={ambassador.id} className={cn(ambassador.suspended && 'opacity-60')}>
                      <TableCell className="max-w-[240px]">
                        <div className="flex items-center gap-3">
                          <Avatar className="size-8">
                            <AvatarFallback>{initials(ambassador.name)}</AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="truncate font-medium text-slate-900">{ambassador.name}</p>
                            <p className="truncate text-xs text-slate-500">{ambassador.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[180px]">{ambassador.university}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {ambassador.campaigns.map((code) => (
                            <span
                              key={code}
                              className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[0.65rem] font-semibold text-slate-600"
                            >
                              {code}
                            </span>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={cn('inline-flex items-center gap-1.5 text-xs', TEXT[presence.tone])}>
                          <span className={cn('size-2 rounded-full', DOT[presence.tone])} />
                          {presence.label}
                        </span>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={ambassador.suspended ? 'suspended' : 'active'} />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant={ambassador.suspended ? 'success-soft' : 'ghost'}
                          disabled={suspend.isPending}
                          onClick={() => toggle(ambassador)}
                        >
                          {ambassador.suspended ? <UserCheck /> : <Ban />}
                          {ambassador.suspended ? 'Reinstate' : 'Suspend'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}
    </div>
  );
}
