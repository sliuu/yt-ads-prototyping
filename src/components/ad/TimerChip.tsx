import type { CSSProperties } from 'react';
import { LockIcon } from '../../ui/icons';
import { cx } from '../../ui/cx';
import s from './ad.module.css';

type TimerChipProps = {
  label: string;
  blur?: boolean;
  style?: CSSProperties;
};

/** Locked-countdown pill: the visible half of the unskippable-timer feature. */
export function TimerChip({ label, blur, style }: TimerChipProps) {
  return (
    <div className={cx(s.timerChip, blur && s.timerBlur)} style={style}>
      <LockIcon />
      <span className={s.timerLabel}>{label}</span>
    </div>
  );
}
