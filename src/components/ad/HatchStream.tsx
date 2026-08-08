import type { CSSProperties, ReactNode } from 'react';
import { cx } from '../../ui/cx';
import s from './ad.module.css';

export type HatchTone = 'shorts' | 'video' | 'thumb';

const TONES: Record<HatchTone, string> = {
  shorts: s.toneShorts,
  video: s.toneVideo,
  thumb: s.toneThumb,
};

type HatchStreamProps = {
  /** Stripe width in px; larger phones use wider stripes. */
  step: number;
  tone?: HatchTone;
  children?: ReactNode;
  className?: string;
};

/**
 * The diagonal-stripe placeholder standing in for playing video. In a real
 * build this is where a `<video>` or poster frame goes.
 */
export function HatchStream({ step, tone = 'video', children, className }: HatchStreamProps) {
  return (
    <div
      className={cx(s.hatch, TONES[tone], className)}
      style={{ '--hatch-step': `${step}px` } as CSSProperties}
    >
      {children}
    </div>
  );
}

/** Mono caption overlaid on a stream, e.g. "▶ shorts stream · kitten-videos". */
export function StreamCaption({ children }: { children: ReactNode }) {
  return <span className={s.streamCaption}>{children}</span>;
}

export function NowPlaying({ children }: { children: ReactNode }) {
  return <div className={s.nowPlaying}>{children}</div>;
}
