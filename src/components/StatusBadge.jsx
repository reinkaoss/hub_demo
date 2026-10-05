import { Badge } from '@/components/ui/badge';

const VARIANT = {
  pending: 'pending',
  approved: 'approved',
  paid: 'paid',
  rejected: 'rejected',
  suspended: 'rejected',
  active: 'approved',
};

export function StatusBadge({ status }) {
  return <Badge variant={VARIANT[status] ?? 'default'}>{status}</Badge>;
}
