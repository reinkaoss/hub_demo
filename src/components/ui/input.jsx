import { cn } from '@/lib/utils';

function Input({ className, type, ref, ...props }) {
  return (
    <input
      ref={ref}
      type={type}
      data-slot="input"
      className={cn(
        'w-full min-w-0 rounded-[10px] border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm font-medium text-foreground font-[inherit] transition-all outline-none placeholder:text-muted-foreground focus-visible:border-signal focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-signal/10 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20',
        className,
      )}
      {...props}
    />
  );
}

export { Input };
