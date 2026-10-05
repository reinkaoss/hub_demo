import { ExternalLink } from 'lucide-react';
import { Dialog, DialogBody, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PromotionTypeBadge } from '@/components/PromotionTypeBadge';
import { ReviewFooter } from '@/components/ReviewFooter';
import { StatusBadge } from '@/components/StatusBadge';
import { formatDate } from '@/lib/time';

const Fact = ({ label, children }) => (
  <div>
    <dt className="text-[0.65rem] font-semibold uppercase tracking-wider text-slate-400">{label}</dt>
    <dd className="mt-0.5 text-sm font-medium text-slate-800">{children}</dd>
  </div>
);

export function SubmissionDialog({ submission, canReview, busy, onClose, onApprove, onReject, onPay }) {
  return (
    <Dialog open={Boolean(submission)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        {submission ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-white">Timesheet · {submission.id}</DialogTitle>
              <DialogDescription className="text-white/80">
                {submission.ambassadorName} · {submission.campaignName}
              </DialogDescription>
            </DialogHeader>

            <DialogBody>
              <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <Fact label="Status">
                  <StatusBadge status={submission.status} />
                </Fact>
                <Fact label="Hours">
                  {submission.hours}
                  {submission.bonus ? ` + £${submission.bonus} bonus` : ''}
                </Fact>
                <Fact label="Reach">{submission.reach.toLocaleString('en-GB')}</Fact>
                <Fact label="Submitted">{formatDate(submission.createdAt)}</Fact>
              </dl>

              <div>
                <p className="mb-1 text-[0.65rem] font-semibold uppercase tracking-wider text-slate-400">Channel</p>
                <PromotionTypeBadge type={submission.promotionType} />
              </div>

              <div>
                <p className="mb-1 text-[0.65rem] font-semibold uppercase tracking-wider text-slate-400">
                  Description
                </p>
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
                  {submission.description}
                </p>
              </div>

              {submission.socialUrl ? (
                <p className="flex items-center gap-1.5 text-xs text-slate-500">
                  <ExternalLink className="size-3.5" />
                  <span className="truncate">{submission.socialUrl}</span>
                </p>
              ) : null}

              {submission.rejectionReason ? (
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-3">
                  <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-rose-600">
                    Reason for rejection
                  </p>
                  <p className="mt-1 text-sm text-rose-700">{submission.rejectionReason}</p>
                </div>
              ) : null}
            </DialogBody>

            <ReviewFooter
              status={submission.status}
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
