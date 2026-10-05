import { useState } from 'react';
import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

/**
 * Footer for a review dialog: approve / reject-with-reason / mark paid, depending on the item's
 * status and whether the viewer is allowed to review. Shared by timesheets and expenses.
 */
export function ReviewFooter({ status, canReview, busy, onApprove, onReject, onPay, onClose }) {
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState('');

  if (!canReview || status === 'paid' || status === 'rejected') {
    return (
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </DialogFooter>
    );
  }

  if (rejecting) {
    return (
      <>
        <div className="space-y-1.5 px-6 pb-4">
          <Label htmlFor="reject-reason">Reason shown to the ambassador</Label>
          <Textarea
            id="reject-reason"
            autoFocus
            rows={3}
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            placeholder="e.g. The evidence screenshot is cropped. Please re-upload the full image."
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setRejecting(false)} disabled={busy}>
            Back
          </Button>
          <Button variant="destructive" disabled={busy || !reason.trim()} onClick={() => onReject(reason.trim())}>
            <X /> Confirm rejection
          </Button>
        </DialogFooter>
      </>
    );
  }

  return (
    <DialogFooter>
      <Button variant="outline" onClick={onClose} disabled={busy}>
        Close
      </Button>
      <Button variant="destructive-soft" onClick={() => setRejecting(true)} disabled={busy}>
        <X /> Reject
      </Button>
      {status === 'pending' ? (
        <Button onClick={onApprove} disabled={busy}>
          <Check /> Approve
        </Button>
      ) : (
        <Button onClick={onPay} disabled={busy}>
          <Check /> Mark as paid
        </Button>
      )}
    </DialogFooter>
  );
}
