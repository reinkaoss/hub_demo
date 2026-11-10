import { cva } from 'class-variance-authority';
import { Slot } from 'radix-ui';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center px-2 py-1 rounded-md text-[0.625rem] font-semibold uppercase tracking-wide',
  {
    variants: {
      variant: {
        // status badges
        pending: 'bg-white/8 text-zinc-300',
        approved: 'bg-emerald-400/15 text-emerald-300',
        paid: 'bg-purple-medium/20 text-[#d4cceb]',
        rejected: 'bg-red-400/15 text-red-300',
        flagged: 'bg-orange-400/15 text-orange-300',
        needs_review: 'bg-amber-400/15 text-amber-200',
        default: 'bg-white/8 text-zinc-400',
        outline: 'border border-border text-muted-foreground',
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
