import type { CSSProperties, ReactNode } from 'react';
import { ChevronDownIcon } from './icons';
import { cx } from './cx';
import s from './ui.module.css';

type FieldSize = 'sm' | 'md' | 'lg';

const SIZES: Record<FieldSize, string> = {
  sm: s.fieldSm,
  md: s.fieldMd,
  lg: s.fieldLg,
};

type FieldProps = {
  children: ReactNode;
  size?: FieldSize;
  /** Renders the value in the mono face (IDs, counts, code-ish values). */
  mono?: boolean;
  /** Adds a trailing chevron so the field reads as a dropdown. */
  select?: boolean;
  /** Fills the remaining space in a row. */
  grow?: boolean;
  className?: string;
  style?: CSSProperties;
};

/**
 * Read-only value chip. These prototypes never accept typed input — every
 * "input" is a filled grey field showing a fixed value.
 */
export function Field({
  children,
  size = 'md',
  mono,
  select,
  grow,
  className,
  style,
}: FieldProps) {
  return (
    <div
      className={cx(
        s.field,
        SIZES[size],
        mono && s.fieldMono,
        select && s.fieldSelect,
        grow && s.fieldGrow,
        className,
      )}
      style={style}
    >
      {children}
      {select && <ChevronDownIcon size={13} strokeWidth={1.6} />}
    </div>
  );
}

type LabeledRowProps = {
  label: ReactNode;
  /** Fixed label column width, so stacked rows line up. */
  labelWidth?: number;
  children: ReactNode;
};

export function LabeledRow({ label, labelWidth, children }: LabeledRowProps) {
  return (
    <div className={s.labeledRow}>
      <span className={s.rowLabel} style={{ width: labelWidth }}>
        {label}
      </span>
      {children}
    </div>
  );
}
