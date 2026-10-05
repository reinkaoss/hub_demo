import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

const Textarea = forwardRef(function Textarea({ className, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      data-slot="textarea"
      className={cn(
        'w-full min-w-0 min-h-[80px] rounded-[10px] border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm font-medium text-foreground font-[inherit] resize-vertical transition-all outline-none placeholder:text-muted-foreground focus-visible:border-signal focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-signal/10 disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  );
});

export { Textarea };
