import { Dialog as DialogPrimitive } from 'radix-ui';
import { XIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

function Sheet({ ...props }) {
  return (
    <DialogPrimitive.Root
      data-slot="sheet"
      {...props}
    />
  );
}

function SheetTrigger({ ...props }) {
  return (
    <DialogPrimitive.Trigger
      data-slot="sheet-trigger"
      {...props}
    />
  );
}

function SheetClose({ ...props }) {
  return (
    <DialogPrimitive.Close
      data-slot="sheet-close"
      {...props}
    />
  );
}

function SheetPortal({ ...props }) {
  return (
    <DialogPrimitive.Portal
      data-slot="sheet-portal"
      {...props}
    />
  );
}

function SheetOverlay({ className, ...props }) {
  return (
    <DialogPrimitive.Overlay
      data-slot="sheet-overlay"
      className={cn(
        'fixed inset-0 z-50 bg-black/40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        className,
      )}
      {...props}
    />
  );
}

/**
 * Slide-in panel from any side. Built on Radix Dialog so it inherits focus
 * management, escape-to-close, and the portal behaviour.
 *
 * @param side - "right" (default), "left", "top", or "bottom"
 */
function SheetContent({ className, children, side = 'right', showClose = true, ...props }) {
  const sideClasses = {
    right:
      'inset-y-0 right-0 h-full w-3/4 sm:max-w-md border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right',
    left: 'inset-y-0 left-0 h-full w-3/4 sm:max-w-md border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left',
    top: 'inset-x-0 top-0 h-auto border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top',
    bottom:
      'inset-x-0 bottom-0 h-auto border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom',
  };

  return (
    <SheetPortal>
      <SheetOverlay />
      <DialogPrimitive.Content
        data-slot="sheet-content"
        className={cn(
          'fixed z-50 flex flex-col gap-0 bg-white shadow-xl outline-none transition ease-in-out',
          'data-[state=open]:duration-300 data-[state=closed]:duration-200',
          'data-[state=open]:animate-in data-[state=closed]:animate-out',
          sideClasses[side],
          className,
        )}
        {...props}
      >
        {children}
        {showClose && (
          <DialogPrimitive.Close
            data-slot="sheet-close-button"
            // Offset by the iOS safe-area insets so the button never hides under the
            // status bar / Dynamic Island on notched devices. On desktop env() is 0, so
            // this resolves to the original 1rem (top-4 / right-4) — no visual change.
            style={{
              top: 'max(1rem, calc(env(safe-area-inset-top, 0px) + 0.5rem))',
              right: 'max(1rem, calc(env(safe-area-inset-right, 0px) + 0.5rem))',
            }}
            className="absolute z-10 inline-flex h-7 w-7 items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal/30"
            aria-label="Close"
          >
            <XIcon className="size-4" />
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </SheetPortal>
  );
}

function SheetHeader({ className, ...props }) {
  return (
    <div
      data-slot="sheet-header"
      className={cn('flex shrink-0 flex-col gap-1 border-b border-neutral-200 px-5 py-4', className)}
      {...props}
    />
  );
}

function SheetFooter({ className, ...props }) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn('flex shrink-0 items-center justify-end gap-2 border-t border-neutral-200 px-5 py-3', className)}
      {...props}
    />
  );
}

function SheetTitle({ className, ...props }) {
  return (
    <DialogPrimitive.Title
      data-slot="sheet-title"
      className={cn('text-base font-black text-neutral-900', className)}
      {...props}
    />
  );
}

function SheetDescription({ className, ...props }) {
  return (
    <DialogPrimitive.Description
      data-slot="sheet-description"
      className={cn('text-sm text-neutral-500', className)}
      {...props}
    />
  );
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetPortal,
  SheetOverlay,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
};
