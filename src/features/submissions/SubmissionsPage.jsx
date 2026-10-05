import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Plus, Search } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card } from '@/components/Card';
import { EmptyState } from '@/components/EmptyState';
import { PageHeader } from '@/components/PageHeader';
import { PromotionTypeBadge } from '@/components/PromotionTypeBadge';
import { StatusBadge } from '@/components/StatusBadge';
import { timeAgo } from '@/lib/time';
import { useViewer } from '@/lib/viewer';
import { SubmissionDialog } from './SubmissionDialog';
import { useSetSubmissionStatus, useSubmissionsQuery } from './submissionsQueries';

const STATUSES = ['all', 'pending', 'approved', 'paid', 'rejected'];

export default function SubmissionsPage() {
  const { isAdmin } = useViewer();
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState(null);

  const { data: rows = [], isLoading } = useSubmissionsQuery({ status, search });
  const setStatusMutation = useSetSubmissionStatus();
  const selected = rows.find((row) => row.id === selectedId) ?? null;

  async function review(id, nextStatus, successMessage, reason) {
    try {
      await setStatusMutation.mutateAsync({ id, status: nextStatus, reason });
      toast.success(successMessage);
      setSelectedId(null);
    } catch (error) {
      // Rule violations (e.g. a £0.00 row) surface here with a message an admin can act on.
      toast.error(error.message);
    }
  }

  return (
    <div>
      <PageHeader
        eyebrow="Timesheets"
        title={isAdmin ? 'Submissions' : 'My timesheets'}
        description={
          isAdmin
            ? 'Review ambassador timesheets. Open one to approve, reject with a reason, or mark it paid.'
            : 'Everything you have submitted, and where it is in review.'
        }
        actions={
          !isAdmin ? (
            <Button asChild>
              <Link to="/submissions/new">
                <Plus /> New timesheet
              </Link>
            </Button>
          ) : null
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search name, campaign or description"
            className="pl-9"
            aria-label="Search submissions"
          />
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-44" aria-label="Filter by status">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUSES.map((value) => (
              <SelectItem key={value} value={value} className="capitalize">
                {value === 'all' ? 'All statuses' : value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Spinner size="lg" className="text-slate-300" />
        </div>
      ) : rows.length === 0 ? (
        <EmptyState icon={Clock} title="No timesheets match" description="Try a different status or search term." />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-signal hover:bg-signal">
                  {isAdmin ? <TableHead>Ambassador</TableHead> : null}
                  <TableHead>Campaign</TableHead>
                  <TableHead>Channel</TableHead>
                  <TableHead className="text-right">Hours</TableHead>
                  <TableHead className="text-right">Reach</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => (
                  <TableRow
                    key={row.id}
                    onClick={() => setSelectedId(row.id)}
                    className="cursor-pointer hover:bg-slate-50"
                  >
                    {isAdmin ? <TableCell className="font-medium text-slate-900">{row.ambassadorName}</TableCell> : null}
                    <TableCell className="max-w-[220px]">{row.campaignName}</TableCell>
                    <TableCell>
                      <PromotionTypeBadge type={row.promotionType} />
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {row.hours}
                      {row.bonus ? <span className="ml-1 text-xs text-slate-400">+£{row.bonus}</span> : null}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">{row.reach.toLocaleString('en-GB')}</TableCell>
                    <TableCell>
                      <StatusBadge status={row.status} />
                    </TableCell>
                    <TableCell className="text-slate-500">{timeAgo(row.createdAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}

      <SubmissionDialog
        submission={selected}
        canReview={isAdmin}
        busy={setStatusMutation.isPending}
        onClose={() => setSelectedId(null)}
        onApprove={() => review(selected.id, 'approved', 'Timesheet approved')}
        onReject={(reason) => review(selected.id, 'rejected', 'Timesheet rejected', reason)}
        onPay={() => review(selected.id, 'paid', 'Marked as paid')}
      />
    </div>
  );
}
