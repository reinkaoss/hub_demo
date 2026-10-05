import { Progress as ProgressPrimitive } from 'radix-ui';

import { cn } from '@/lib/utils';

function Progress({ className, value, indicatorStyle, ...props }) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn('relative flex h-2.5 w-full items-center overflow-x-hidden rounded-full bg-neutral-200', className)}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="size-full flex-1 bg-primary transition-all duration-700"
        style={{ transform: `translateX(-${100 - (value || 0)}%)`, ...indicatorStyle }}
      />
    </ProgressPrimitive.Root>
  );
}

export { Progress };
