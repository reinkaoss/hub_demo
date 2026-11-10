import { Toaster as Sonner } from 'sonner';

const Toaster = ({ ...props }) => {
  return (
    <Sonner
      theme="dark"
      position="top-right"
      offset={{ top: '4.75rem', right: '1rem' }}
      visibleToasts={4}
      toastOptions={{
        classNames: {
          toast: 'group toast',
          title: 'text-sm font-semibold text-foreground',
          description: 'text-xs text-muted-foreground',
          icon: 'wm-toast-icon',
          actionButton: 'rounded-full bg-purple-medium px-3 py-1 text-xs font-medium text-white',
          cancelButton: 'rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-foreground',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
