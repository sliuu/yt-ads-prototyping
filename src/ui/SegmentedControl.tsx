import type { ReactNode } from 'react';
import { cx } from './cx';
import s from './ui.module.css';

export type SegmentOption<T extends string> = {
  id: T;
  label: ReactNode;
  /** Tooltip — used by the icon-only variant, where the label is a glyph. */
  title?: string;
};

type SegmentedControlProps<T extends string> = {
  options: ReadonlyArray<SegmentOption<T>>;
  value: T;
  onChange: (id: T) => void;
  variant?: 'text' | 'icon';
};

/** Pill-in-a-track switch: Data/Themes/Code, and the text-align buttons. */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  variant = 'text',
}: SegmentedControlProps<T>) {
  return (
    <div className={s.segmented}>
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          title={option.title}
          className={cx(
            s.segment,
            variant === 'icon' && s.segmentIcon,
            option.id === value && s.segmentOn,
          )}
          onClick={() => onChange(option.id)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
