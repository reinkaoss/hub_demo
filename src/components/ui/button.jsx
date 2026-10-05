import { cva } from 'class-variance-authority';
import { Slot } from 'radix-ui';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-[10px] border bg-clip-padding text-[0.875rem] font-semibold uppercase tracking-[0.5px] whitespace-nowrap transition-all duration-300 outline-none select-none cursor-pointer focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50 active:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          'bg-signal text-white border-2 border-signal/20 shadow-md shadow-signal/25 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-signal/40',
        success:
          'bg-success text-white border-2 border-success shadow-[rgba(16,185,129,0.25)_0px_4px_12px] hover:bg-success-600',
        warning:
          'bg-warning text-white border-2 border-warning shadow-[rgba(249,115,22,0.25)_0px_4px_12px] hover:bg-warning-600',
        destructive:
          'bg-destructive text-white border-2 border-destructive shadow-[rgba(220,38,38,0.25)_0px_4px_12px] hover:bg-destructive/90',
        ghost: 'bg-transparent border-transparent text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900',
        outline:
          'bg-transparent border-2 border-neutral-200 text-neutral-700 hover:bg-neutral-50 hover:border-neutral-300',
        'success-soft': 'bg-success/10 text-success border-success/20 hover:bg-success/20',
        'warning-soft': 'bg-warning/10 text-warning border-warning/20 hover:bg-warning/20',
        'destructive-soft': 'bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20',
      },
      size: {
        default: 'py-3 px-5 gap-2',
        xs: "h-6 gap-1 rounded-[8px]  px-2   text-xs [&_svg:not([class*='size-'])]:size-3",
        sm: 'h-8 gap-1 rounded-[10px] px-2.5',
        lg: 'h-10 gap-2 px-6',
        icon: 'size-9',
        'icon-xs': "size-6 rounded-[8px]  [&_svg:not([class*='size-'])]:size-3",
        'icon-sm': 'size-8 rounded-[10px]',
        'icon-lg': 'size-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

function Button({ className, variant = 'default', size = 'default', asChild = false, ...props }) {
  const Comp = asChild ? Slot.Root : 'button';

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
