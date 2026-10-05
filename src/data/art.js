/**
 * Procedural artwork. The demo ships no photographs or video: every "image" is a small SVG generated
 * from a seed string, so there are no licensing questions and no binary assets to host.
 */
const hash = (s) => {
  let h = 2166136261;
  for (const ch of String(s)) {
    h ^= ch.charCodeAt(0);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};

const toUri = (svg) => `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

/** @param {'photo'|'frame'} variant  photo = landscape-style scene, frame = video still */
export function svgArt(seed, { variant = 'photo', label = '' } = {}) {
  const h = hash(seed);
  const hue = h % 360;
  const hue2 = (hue + 40 + ((h >> 8) % 60)) % 360;
  const c1 = `hsl(${hue} 70% 56%)`;
  const c2 = `hsl(${hue2} 72% 38%)`;
  const sun = `hsl(${(hue + 180) % 360} 70% 88%)`;

  const scene =
    variant === 'photo'
      ? `<circle cx="${160 + (h % 280)}" cy="${140 + ((h >> 4) % 110)}" r="${46 + (h % 28)}" fill="${sun}" opacity=".92"/>
         <path d="M0 450 Q150 ${350 + (h % 60)} 300 430 T600 ${410 + ((h >> 6) % 50)} V600 H0Z" fill="rgba(0,0,0,.26)"/>
         <path d="M0 515 Q200 ${445 + ((h >> 3) % 50)} 380 505 T600 485 V600 H0Z" fill="rgba(0,0,0,.4)"/>`
      : `<rect x="46" y="${110 + (h % 70)}" width="508" height="${210 + ((h >> 5) % 70)}" rx="30" fill="rgba(255,255,255,.14)"/>
         <circle cx="${130 + (h % 340)}" cy="300" r="92" fill="rgba(255,255,255,.2)"/>
         <circle cx="${440 - (h % 200)}" cy="${380 + ((h >> 7) % 60)}" r="44" fill="rgba(255,255,255,.12)"/>`;

  const caption = label
    ? `<text x="300" y="558" text-anchor="middle" font-family="system-ui,sans-serif" font-size="28" font-weight="700" fill="rgba(255,255,255,.88)">${label}</text>`
    : '';

  return toUri(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs><rect width="600" height="600" fill="url(#g)"/>${scene}${caption}</svg>`,
  );
}
