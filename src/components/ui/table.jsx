import { cn } from '@/lib/utils';

function Table({ className, ...props }) {
  return (
    <div
      data-slot="table-container"
      // Thin, always-visible scrollbar: macOS overlay scrollbars gave no hint that wide
      // tables (e.g. the BA index) have more columns off-screen.
      className="relative w-full overflow-x-auto pb-0.5 [scrollbar-color:rgba(100,100,120,0.35)_transparent] [scrollbar-width:thin]"
    >
      <table
        data-slot="table"
        className={cn('w-full caption-bottom text-[13px] font-[var(--font-family)]', className)}
        {...props}
      />
    </div>
  );
}

function TableHeader({ className, ...props }) {
  return (
    <thead
      data-slot="table-header"
      className={cn(
        '[&_tr]:border-b font-bold border-gray-200 centered font-[var(--font-family)] bg-signal',
        className,
      )}
      {...props}
    />
  );
}

function TableBody({ className, ...props }) {
  return (
    <tbody
      data-slot="table-body"
      className={cn('[&_tr:last-child]:border-0 bg-white font-[var(--font-family)]', className)}
      {...props}
    />
  );
}

function TableRow({ className, ...props }) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        'border-b border-gray-100 transition-colors [tbody_&]:hover:bg-[rgba(112,98,171,0.05)] font-[var(--font-family)]',
        className,
      )}
      {...props}
    />
  );
}

function TableHead({ className, ...props }) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        'h-10 px-3 py-2.5 text-left align-middle text-xs font-semibold uppercase tracking-wider text-white whitespace-nowrap font-[var(--font-family)]',
        className,
      )}
      {...props}
    />
  );
}

function TableCell({ className, ...props }) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        'max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap px-3 py-2.5 align-middle text-[13px] font-[var(--font-family)]',
        className,
      )}
      {...props}
    />
  );
}

function TableCaption({ className, ...props }) {
  return (
    <caption
      data-slot="table-caption"
      className={cn('mt-4 text-sm text-gray-500 font-[var(--font-family)]', className)}
      {...props}
    />
  );
}

export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption };
