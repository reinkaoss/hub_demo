import { useEffect } from 'react';
import { ChevronLeft, ChevronRight, Download, FileText, Film, ImageOff, Play } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { ResourceThumb } from './ResourceThumb';

function Message({ icon: Icon, title, hint }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center text-white/80">
      <Icon className="size-12" />
      <p className="text-base font-semibold text-white">{title}</p>
      <p className="max-w-sm text-sm text-white/60">{hint}</p>
    </div>
  );
}

/** What the stage shows for the current resource. Every kind has a defined, honest fallback. */
function Stage({ item }) {
  if (item.kind === 'image') {
    if (item.tooLarge) {
      return (
        <Message icon={ImageOff} title="Too large to preview here" hint="Use Download to view the original at full size." />
      );
    }
    return <img src={item.thumb} alt={item.title} className="mx-auto max-h-full max-w-full rounded-lg object-contain" />;
  }
  if (item.kind === 'video') {
    return (
      <div className="relative mx-auto flex h-full max-h-full items-center justify-center">
        {item.thumb ? (
          <img src={item.thumb} alt={item.title} className="max-h-full max-w-full rounded-lg object-contain" />
        ) : (
          <Message icon={Film} title="No preview frame" hint="This video was uploaded before previews existed." />
        )}
        {item.thumb ? (
          <span className="absolute flex size-16 items-center justify-center rounded-full bg-black/60 text-white">
            <Play className="ml-1 size-8 fill-current" />
          </span>
        ) : null}
      </div>
    );
  }
  return <Message icon={FileText} title={item.title} hint="This file type cannot be previewed here. Download it to view." />;
}

function download(item) {
  if (item.kind === 'image' && item.thumb && !item.tooLarge) {
    const link = document.createElement('a');
    link.href = item.thumb;
    link.download = item.title.replace(/\.[^.]+$/, '') + '.svg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return;
  }
  toast.info('Downloads of sample files are disabled in this demo.');
}

export function MediaViewer({ items, index, onIndexChange, onClose }) {
  const open = index !== null && items[index] !== undefined;
  const item = open ? items[index] : null;

  // Arrow keys move through the folder; clamp at the ends rather than wrapping.
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key === 'ArrowRight') onIndexChange(Math.min(items.length - 1, index + 1));
      if (event.key === 'ArrowLeft') onIndexChange(Math.max(0, index - 1));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, index, items.length, onIndexChange]);

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="h-[min(90dvh,44rem)] bg-slate-950 text-white sm:max-w-3xl">
        {item ? (
          <>
            <div className="flex items-center justify-between gap-4 border-b border-white/10 py-3 pl-5 pr-14">
              <div className="min-w-0">
                <DialogTitle className="truncate text-sm text-white">{item.title}</DialogTitle>
                <DialogDescription className="text-xs text-white/50">
                  {index + 1} / {items.length}
                </DialogDescription>
              </div>
              <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10" onClick={() => download(item)}>
                <Download /> Download
              </Button>
            </div>

            <div className="relative min-h-0 flex-1 p-4">
              <Stage item={item} />
              <Button
                size="icon"
                variant="ghost"
                aria-label="Previous"
                disabled={index === 0}
                onClick={() => onIndexChange(index - 1)}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white hover:bg-black/60"
              >
                <ChevronLeft />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                aria-label="Next"
                disabled={index === items.length - 1}
                onClick={() => onIndexChange(index + 1)}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white hover:bg-black/60"
              >
                <ChevronRight />
              </Button>
            </div>

            <div className="flex gap-2 overflow-x-auto border-t border-white/10 p-3">
              {items.map((entry, i) => (
                <button
                  key={entry.id}
                  type="button"
                  aria-label={`Open ${entry.title}`}
                  onClick={() => onIndexChange(i)}
                  className={cn(
                    'size-14 shrink-0 overflow-hidden rounded-lg border-2 transition',
                    i === index ? 'border-signal-soft' : 'border-transparent opacity-60 hover:opacity-100',
                  )}
                >
                  <ResourceThumb resource={entry} />
                </button>
              ))}
            </div>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
