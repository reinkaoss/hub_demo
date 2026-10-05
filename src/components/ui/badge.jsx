import { cva } from 'class-variance-authority';
import { Slot } from 'radix-ui';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center px-2 py-1 rounded-md text-[0.625rem] font-semibold uppercase tracking-wide',
  {
    variants: {
      variant: {
        // status badges
        pending: 'bg-slate-100 text-slate-600',
        approved: 'bg-success/10 text-success-700',
        paid: 'bg-signal/10 text-signal',
        rejected: 'bg-error-700/10 text-error-700',
        // ai verdict badges
        flagged: 'bg-warning/10 text-warning-700',
        needs_review: 'bg-amber-50 text-amber-700',
        // generic
        default: 'bg-neutral-100 text-neutral-500',
        outline: 'border border-neutral-200 text-neutral-400',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

function Badge({ className, variant = 'default', asChild = false, ...props }) {
  const Comp = asChild ? Slot.Root : 'span';

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
