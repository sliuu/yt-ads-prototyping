import type { CSSProperties, ReactNode } from 'react';
import { cx } from './cx';
import s from './ui.module.css';

type AvatarProps = {
  initials: string;
  color: string;
  size?: number;
  /** Overlapping stack look used on project cards. */
  stacked?: boolean;
};

export function Avatar({ initials, color, size = 34, stacked }: AvatarProps) {
  const style: CSSProperties = {
    width: size,
    height: size,
    background: color,
    fontSize: size <= 26 ? 10.5 : 14,
    ...(stacked ? { border: '2px solid #fff', marginLeft: -8 } : null),
  };
  return (
    <span className={s.avatar} style={style}>
      {initials}
    </span>
  );
}

/** "+2" chip that closes an overlapping avatar stack. */
export function AvatarOverflow({ label }: { label: string }) {
  return (
    <span
      className={s.avatar}
      style={{
        width: 24,
        height: 24,
        background: 'var(--chip-bg)',
        color: 'var(--text-muted)',
        border: '2px solid #fff',
        marginLeft: -8,
        fontSize: 10,
      }}
    >
      {label}
    </span>
  );
}

export function Badge({ children, small }: { children: ReactNode; small?: boolean }) {
  return <span className={cx(s.badge, small && s.badgeSm)}>{children}</span>;
}

/** 12px uppercase eyebrow that opens every content section. */
export function SectionLabel({ children }: { children: ReactNode }) {
  return <span className={s.sectionLabel}>{children}</span>;
}
