import { useState } from 'react';
import { FileText, Film, ImageOff, Play } from 'lucide-react';
import { cn } from '@/lib/utils';

function Tile({ icon: Icon, label, dark }) {
  return (
    <div
      className={cn(
        'flex size-full flex-col items-center justify-center gap-2 p-3 text-center',
        dark ? 'bg-slate-800 text-white/60' : 'bg-slate-100 text-slate-400',
      )}
    >
      <Icon className="size-8" />
      {label ? <span className="text-[0.65rem] font-medium">{label}</span> : null}
    </div>
  );
}

function PdfTile() {
  return (
    <div className="flex size-full flex-col items-center justify-center gap-1 bg-slate-100">
      <span className="rounded-md bg-red-600 px-2 py-3 text-xs font-extrabold tracking-wider text-white">PDF</span>
    </div>
  );
}

/**
 * Grid preview for one resource. It renders a small thumbnail or a type tile, never the original,
 * and an image that fails to load falls back to a tile rather than the browser's broken-image glyph.
 */
export function ResourceThumb({ resource }) {
  const [failed, setFailed] = useState(false);
  const { kind, thumb, tooLarge, title } = resource;

  if (kind === 'pdf') return <PdfTile />;
  if (kind === 'document') return <Tile icon={FileText} label="Document" />;

  if (kind === 'image') {
    if (tooLarge || !thumb || failed) return <Tile icon={ImageOff} label="Preview unavailable" />;
    return (
      <img
        src={thumb}
        alt={title}
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
        className="size-full bg-slate-100 object-cover"
      />
    );
  }

  // video
  if (!thumb || failed) return <Tile icon={Film} dark />;
  return (
    <div className="relative size-full">
      <img
        src={thumb}
        alt={title}
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
        className="size-full object-cover"
      />
      <span className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden="true">
        <span className="flex size-10 items-center justify-center rounded-full bg-black/55 text-white shadow-md">
          <Play className="ml-0.5 size-5 fill-current" />
        </span>
      </span>
    </div>
  );
}
