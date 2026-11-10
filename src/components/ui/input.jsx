import { cn } from '@/lib/utils';

function Input({ className, type, ref, ...props }) {
  return (
    <input
      ref={ref}
      type={type}
      data-slot="input"
      className={cn(
        'wm-field w-full min-w-0 px-4 py-2.5 text-sm font-medium font-[inherit] outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  );
}

export { Input };
