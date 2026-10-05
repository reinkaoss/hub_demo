import { useState } from 'react';
import { Download, Receipt } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card } from '@/components/Card';
import { EmptyState } from '@/components/EmptyState';
import { PageHeader } from '@/components/PageHeader';
import { StatusBadge } from '@/components/StatusBadge';
import { formatGBP, formatPennies } from '@/lib/money';
import { timeAgo } from '@/lib/time';
import { useViewer } from '@/lib/viewer';
import { ExpenseDialog } from './ExpenseDialog';
import { groupsToCsv, totalsByStatus } from './expenseRules';
import { useExpensesQuery, useExportPaid, useSetExpenseStatus, useUpdateExpenseAmount } from './expensesQueries';

const STATUSES = ['all', 'pending', 'approved', 'paid', 'rejected'];

function downloadFile(filename, text) {
  const url = URL.createObjectURL(new Blob([text], { type: 'text/csv;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function Total({ label, value, tone }) {
  return (
    <Card className="p-4">
      <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-slate-400">{label}</p>
      <p className={`mt-1 text-2xl font-bold tabular-nums ${tone}`}>{value}</p>
    </Card>
  );
}

export default function ExpensesPage() {
  const { isAdmin } = useViewer();
  const [status, setStatus] = useState('all');
  const [selectedId, setSelectedId] = useState(null);

  const { data: rows = [], isLoading } = useExpensesQuery({ status });
  const { data: allRows = [] } = useExpensesQuery({ status: 'all' });
  const setStatusMutation = useSetExpenseStatus();
  const updateAmount = useUpdateExpenseAmount();
  const exportPaid = useExportPaid();

  const selected = rows.find((row) => row.id === selectedId) ?? allRows.find((row) => row.id === selectedId) ?? null;
  const totals = totalsByStatus(allRows);
  const busy = setStatusMutation.isPending || updateAmount.isPending;

  async function review(id, nextStatus, message, reason) {
    try {
      await setStatusMutation.mutateAsync({ id, status: nextStatus, reason });
      toast.success(message);
      setSelectedId(null);
    } catch (error) {
      // The £0.00 guard lands here, with wording that tells the admin what to do next.
      toast.error(error.message);
    }
  }

  async function saveAmount(value) {
    try {
      const updated = await updateAmount.mutateAsync({ id: selected.id, amount: value });
      toast.success(`Amount updated to ${formatGBP(updated.amount)}`);
    } catch (error) {
      toast.error(error.message);
    }
  }

  async function exportCsv() {
    try {
      const groups = await exportPaid.mutateAsync();
      if (!groups.length) return toast.info('Nothing paid yet to export.');
      downloadFile('paid-expenses.csv', groupsToCsv(groups));
      const total = formatPennies(groups.reduce((sum, g) => sum + g.pennies, 0));
      toast.success(`Exported ${groups.length} payment lines · ${total}`);
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <div>
      <PageHeader
        eyebrow="Expenses"
        title={isAdmin ? 'Expenses' : 'My expenses'}
        description={
          isAdmin
            ? 'Approve, reject and pay out-of-pocket costs. Nothing worth £0.00 can be approved or paid.'
            : 'Costs you have claimed, and where each one is in review. You can correct the amount while it is pending.'
        }
        actions={
          isAdmin ? (
            <Button variant="outline" onClick={exportCsv} disabled={exportPaid.isPending}>
              <Download /> Export paid (CSV)
            </Button>
          ) : null
        }
      />

      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        <Total label="Awaiting review" value={totals.pending} tone="text-slate-700" />
        <Total label="Approved, unpaid" value={totals.approved} tone="text-emerald-700" />
        <Total label="Paid" value={totals.paid} tone="text-signal" />
      </div>

      <div className="mb-4">
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
        <EmptyState icon={Receipt} title="No expenses match" description="Try a different status." />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-signal hover:bg-signal">
                  {isAdmin ? <TableHead>Ambassador</TableHead> : null}
                  <TableHead>Client</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
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
                    <TableCell>{row.campaignName}</TableCell>
                    <TableCell className="max-w-[260px]">
                      {row.description}
                      {row.isChargeback ? (
                        <span className="ml-2 rounded bg-amber-100 px-1.5 py-0.5 text-[0.6rem] font-semibold uppercase text-amber-700">
                          chargeback
                        </span>
                      ) : null}
                    </TableCell>
                    <TableCell
                      className={`text-right font-medium tabular-nums ${row.amount === 0 ? 'text-amber-600' : ''}`}
                    >
                      {formatGBP(row.amount)}
                    </TableCell>
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

      <ExpenseDialog
        expense={selected}
        canReview={isAdmin}
        canEdit
        busy={busy}
        onClose={() => setSelectedId(null)}
        onApprove={() => review(selected.id, 'approved', 'Expense approved')}
        onReject={(reason) => review(selected.id, 'rejected', 'Expense rejected', reason)}
        onPay={() => review(selected.id, 'paid', 'Marked as paid')}
        onSaveAmount={saveAmount}
      />
    </div>
  );
}
