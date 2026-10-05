import { useState } from 'react';
import { Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogBody, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ReviewFooter } from '@/components/ReviewFooter';
import { StatusBadge } from '@/components/StatusBadge';
import { formatGBP } from '@/lib/money';
import { formatDate } from '@/lib/time';

/** Amount editor for a pending expense: this is how a £0.00 entry gets fixed so it can be approved. */
function AmountEditor({ expense, busy, onSave }) {
  const [value, setValue] = useState(String(expense.amount));
  return (
    <div className="space-y-1.5 rounded-xl border border-slate-200 bg-slate-50 p-3">
      <Label htmlFor="expense-amount">Amount (£)</Label>
      <div className="flex gap-2">
        <Input
          id="expense-amount"
          type="number"
          step="0.01"
          min="0"
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
        <Button variant="outline" disabled={busy || Number(value) === expense.amount} onClick={() => onSave(value)}>
          <Pencil /> Save
        </Button>
      </div>
    </div>
  );
}

export function ExpenseDialog({ expense, canReview, canEdit, busy, onClose, onApprove, onReject, onPay, onSaveAmount }) {
  return (
    <Dialog open={Boolean(expense)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        {expense ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-white">Expense · {expense.id}</DialogTitle>
              <DialogDescription className="text-white/80">
                {expense.ambassadorName} · {expense.campaignName}
              </DialogDescription>
            </DialogHeader>
            <DialogBody>
              <dl className="grid grid-cols-3 gap-4">
                <div>
                  <dt className="text-[0.65rem] font-semibold uppercase tracking-wider text-slate-400">Amount</dt>
                  <dd className="mt-0.5 text-lg font-bold tabular-nums text-slate-900">{formatGBP(expense.amount)}</dd>
                </div>
                <div>
                  <dt className="text-[0.65rem] font-semibold uppercase tracking-wider text-slate-400">Status</dt>
                  <dd className="mt-1">
                    <StatusBadge status={expense.status} />
                  </dd>
                </div>
                <div>
                  <dt className="text-[0.65rem] font-semibold uppercase tracking-wider text-slate-400">Submitted</dt>
                  <dd className="mt-0.5 text-sm font-medium text-slate-800">{formatDate(expense.createdAt)}</dd>
                </div>
              </dl>
              <p className="text-sm text-slate-700">
                {expense.description}
                {expense.isChargeback ? (
                  <span className="ml-2 rounded bg-amber-100 px-1.5 py-0.5 text-[0.65rem] font-semibold uppercase text-amber-700">
                    chargeback
                  </span>
                ) : null}
              </p>
              {expense.amount === 0 && expense.status === 'pending' ? (
                <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
                  This entry is worth £0.00, so it cannot be approved. Set the real amount below first.
                </p>
              ) : null}
              {canEdit && expense.status === 'pending' ? (
                <AmountEditor key={`${expense.id}-${expense.amount}`} expense={expense} busy={busy} onSave={onSaveAmount} />
              ) : null}
              {expense.rejectionReason ? (
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-3">
                  <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-rose-600">
                    Reason for rejection
                  </p>
                  <p className="mt-1 text-sm text-rose-700">{expense.rejectionReason}</p>
                </div>
              ) : null}
            </DialogBody>
            <ReviewFooter
              status={expense.status}
              canReview={canReview}
              busy={busy}
              onClose={onClose}
              onApprove={onApprove}
              onReject={onReject}
              onPay={onPay}
            />
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
