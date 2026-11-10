import { cva } from 'class-variance-authority';
import { Slot } from 'radix-ui';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-full border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all duration-200 outline-none select-none cursor-pointer focus-visible:ring-2 focus-visible:ring-purple-medium/70 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: 'bg-purple-medium text-white hover:bg-[#62569a]',
        success: 'bg-emerald-500 text-white hover:bg-emerald-400',
        warning: 'bg-orange-500 text-white hover:bg-orange-400',
        destructive: 'bg-destructive text-white hover:bg-red-500',
        ghost: 'bg-transparent text-muted-foreground hover:bg-white/8 hover:text-foreground',
        outline: 'bg-transparent border-border text-foreground hover:bg-white/6 hover:border-white/20',
        'success-soft': 'bg-emerald-400/15 text-emerald-300 hover:bg-emerald-400/25',
        'warning-soft': 'bg-orange-400/15 text-orange-300 hover:bg-orange-400/25',
        'destructive-soft': 'bg-red-400/15 text-red-300 hover:bg-red-400/25',
      },
      size: {
        default: 'h-9 gap-2 px-4',
        xs: "h-6 gap-1 px-2 text-xs [&_svg:not([class*='size-'])]:size-3",
        sm: 'h-8 gap-1.5 px-3 text-[13px]',
        lg: 'h-11 gap-2 px-5',
        icon: 'size-9',
        'icon-xs': "size-6 [&_svg:not([class*='size-'])]:size-3",
        'icon-sm': 'size-8',
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
