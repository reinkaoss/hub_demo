import { Mail, MessageCircle, Sparkles, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

/** The channels a promotion can run on. Order is the order shown in the form's dropdown. */
export const PROMOTION_TYPES = [
  'whatsapp',
  'instagram',
  'tiktok',
  'facebook',
  'linkedin',
  'twitter',
  'youtube',
  'email',
  'face_to_face',
  'other',
];

export const PROMOTION_LABELS = {
  whatsapp: 'WhatsApp',
  instagram: 'Instagram',
  tiktok: 'TikTok',
  facebook: 'Facebook',
  linkedin: 'LinkedIn',
  twitter: 'X / Twitter',
  youtube: 'YouTube',
  email: 'Email',
  face_to_face: 'Face to face',
  other: 'Other',
};

// Initials on a coloured chip instead of third-party logos: neutral, and nothing to license.
const CHIPS = {
  instagram: { text: 'IG', className: 'bg-pink-500' },
  tiktok: { text: 'TT', className: 'bg-slate-900' },
  facebook: { text: 'f', className: 'bg-blue-600' },
  linkedin: { text: 'in', className: 'bg-sky-700' },
  twitter: { text: 'X', className: 'bg-neutral-800' },
  youtube: { text: 'YT', className: 'bg-red-600' },
};

const ICONS = {
  whatsapp: { Icon: MessageCircle, className: 'bg-emerald-500' },
  email: { Icon: Mail, className: 'bg-amber-500' },
  face_to_face: { Icon: Users, className: 'bg-signal' },
  other: { Icon: Sparkles, className: 'bg-slate-500' },
};

export function PlatformChip({ type, className }) {
  const chip = CHIPS[type];
  const icon = ICONS[type] ?? ICONS.other;
  return (
    <span
      aria-hidden="true"
      className={cn(
        'inline-flex size-5 shrink-0 items-center justify-center rounded-md text-[0.6rem] font-bold text-white',
        chip ? chip.className : icon.className,
        className,
      )}
    >
      {chip ? chip.text : <icon.Icon className="size-3" />}
    </span>
  );
}

export function PromotionTypeBadge({ type }) {
  const key = PROMOTION_LABELS[type] ? type : 'other';
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-xs font-medium text-slate-700">
      <PlatformChip type={key} />
      {PROMOTION_LABELS[key]}
    </span>
  );
}
