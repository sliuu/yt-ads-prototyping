import { PlayIcon } from '../../ui/icons';
import s from './ad.module.css';

type SourceThumbProps = {
  size: number;
  radius: number;
  /** Stripe width — scaled down on the smaller thumbnails. */
  step: number;
};

/** Hatched square that represents a video source in lists and modal headers. */
export function SourceThumb({ size, radius, step }: SourceThumbProps) {
  return (
    <span
      className={s.sourceThumb}
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        background: `repeating-linear-gradient(135deg,#2c3138 0 ${step}px,#3a4048 ${step}px ${step * 2}px)`,
      }}
    >
      <PlayIcon size={Math.round(size * 0.42)} />
    </span>
  );
}
