/*
 * Placeholder QR art, in the same spirit as the hatched video thumbnails: it is
 * a plausible-looking code derived from the value, not a scannable one. Swap in
 * a real encoder when these links point at something.
 */

type QrCodeProps = {
  value: string;
  size?: number;
  className?: string;
};

/* Modules per side, the count a short URL would really need. */
const GRID = 25;
const QUIET = 2;

/** Cheap deterministic hash, so the same URL always draws the same code. */
function hash(value: string) {
  let h = 2166136261;
  for (let i = 0; i < value.length; i++) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/* Top-left, top-right and bottom-left, the way a real code carries them. */
const FINDERS = [
  [0, 0],
  [GRID - 7, 0],
  [0, GRID - 7],
];

/** True on the ring or the core of a position marker — the parts that are inked. */
function isFinder(x: number, y: number) {
  return FINDERS.some(([ox, oy]) => {
    const dx = x - ox;
    const dy = y - oy;
    if (dx < 0 || dy < 0 || dx > 6 || dy > 6) return false;
    const ring = dx === 0 || dx === 6 || dy === 0 || dy === 6;
    const core = dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4;
    return ring || core;
  });
}

/** The 8×8 corners belong to the markers, so no noise lands there. */
function isReserved(x: number, y: number) {
  return FINDERS.some(([ox, oy]) => {
    const dx = x - (ox === 0 ? 0 : ox - 1);
    const dy = y - (oy === 0 ? 0 : oy - 1);
    return dx >= 0 && dy >= 0 && dx < 8 && dy < 8;
  });
}

export function QrCode({ value, size = 128, className }: QrCodeProps) {
  const seed = hash(value);
  const span = GRID + QUIET * 2;
  const modules = [];

  for (let y = 0; y < GRID; y++) {
    for (let x = 0; x < GRID; x++) {
      /* Markers are fixed; everything else is noise the seed decides. */
      const on = isFinder(x, y) || (!isReserved(x, y) && (hash(`${seed}:${x}:${y}`) & 7) > 3);
      if (!on) continue;
      modules.push(
        <rect key={`${x}-${y}`} x={x + QUIET} y={y + QUIET} width="1" height="1" rx="0.18" />,
      );
    }
  }

  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox={`0 0 ${span} ${span}`}
      role="img"
      aria-label={`QR code for ${value}`}
      shapeRendering="crispEdges"
    >
      <rect width={span} height={span} fill="#fff" />
      <g fill="var(--text)">{modules}</g>
    </svg>
  );
}
