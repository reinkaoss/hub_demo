import { useEffect, useRef, useState } from 'react';
import { NavLink, useMatch, useResolvedPath } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { cn } from '@/lib/utils';

const BASE = 44;
const MAG = 74;
const DIST = 140;

function useMedia(query) {
  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false,
  );

  useEffect(() => {
    const media = window.matchMedia(query);
    const onChange = () => setMatches(media.matches);
    onChange();
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}

function DockIcon({ mouseX, base, mag, item }) {
  const ref = useRef(null);
  const resolved = useResolvedPath(item.to);
  const match = useMatch({ path: resolved.pathname, end: item.end ?? false });
  const isActive = Boolean(match);

  const distance = useTransform(mouseX, (x) => {
    const bounds = ref.current?.getBoundingClientRect();
    if (!bounds || !Number.isFinite(x)) return DIST;
    return x - bounds.left - bounds.width / 2;
  });
  const target = useTransform(distance, [-DIST, 0, DIST], [base, mag, base]);
  const size = useSpring(target, { mass: 0.12, stiffness: 240, damping: 18, restDelta: 0.001 });
  const Icon = item.icon;

  return (
    <div className="flex flex-col items-center">
      <motion.div ref={ref} style={{ width: size, height: size }} className="group relative">
        <span
          className={cn(
            'pointer-events-none absolute bottom-[calc(100%+8px)] left-1/2 z-10 -translate-x-1/2 translate-y-1',
            'rounded-md border border-white/10 bg-[#2a2a2a] px-2 py-1 text-[11px] font-medium whitespace-nowrap text-white',
            'opacity-0 shadow-lg transition duration-150',
            'group-hover:translate-y-0 group-hover:opacity-100',
            'group-focus-within:translate-y-0 group-focus-within:opacity-100',
          )}
        >
          {item.label}
        </span>
        <NavLink
          to={item.to}
          end={item.end}
          aria-label={item.label}
          className={cn(
            'flex size-full items-center justify-center rounded-[14px] border text-white outline-none transition-colors duration-200',
            'focus-visible:ring-2 focus-visible:ring-purple-medium',
            isActive ? 'border-white/30 bg-[#262626]' : 'border-white/10 bg-[#161616] hover:border-white/20',
          )}
        >
          <Icon className="size-[46%]" strokeWidth={1.75} />
        </NavLink>
        {item.badge > 0 ? (
          <span className="absolute -top-1 -right-1 z-10 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold leading-none text-white">
            {item.badge}
          </span>
        ) : null}
      </motion.div>
      <span
        aria-hidden="true"
        className={cn('mt-1.5 size-1 rounded-full', isActive ? 'bg-white' : 'bg-transparent')}
      />
    </div>
  );
}

export function MagneticDock({ items }) {
  const mouseX = useMotionValue(Number.POSITIVE_INFINITY);
  const reduce = useMedia('(prefers-reduced-motion: reduce)');
  const narrow = useMedia('(max-width: 640px)');
  const base = narrow ? 40 : BASE;
  const mag = reduce || narrow ? base : MAG;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
      <nav
        aria-label="Main"
        onMouseMove={(event) => mouseX.set(event.clientX)}
        onMouseLeave={() => mouseX.set(Number.POSITIVE_INFINITY)}
        className="pointer-events-auto flex max-w-[calc(100vw-1.5rem)] items-end gap-2 rounded-[22px] border border-white/10 bg-[#121212] px-2.5 pt-2.5 pb-1.5 shadow-[0_16px_40px_rgba(0,0,0,0.45)]"
      >
        {items.map((item) => (
          <div key={item.to} className="contents">
            {item.separated ? <span aria-hidden="true" className="mb-3 h-7 w-px self-end bg-white/15" /> : null}
            <DockIcon mouseX={mouseX} base={base} mag={mag} item={item} />
          </div>
        ))}
      </nav>
    </div>
  );
}
