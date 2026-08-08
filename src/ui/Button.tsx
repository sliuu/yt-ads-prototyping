import type { ButtonHTMLAttributes } from 'react';
import { cx } from './cx';
import s from './ui.module.css';

type Variant = 'primary' | 'outline' | 'ghost' | 'dashed';
type Size = 'sm' | 'md' | 'bar';

const VARIANTS: Record<Variant, string> = {
  primary: s.primary,
  outline: s.outline,
  ghost: s.ghost,
  dashed: s.dashed,
};

const SIZES: Record<Size, string> = {
  sm: s.sizeSm,
  md: s.sizeMd,
  bar: s.sizeBar,
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  /** Ghost and dashed carry their own padding, so they ignore `size`. */
  size?: Size;
};

export function Button({ variant = 'primary', size = 'sm', className, ...rest }: ButtonProps) {
  const sized = variant === 'primary' || variant === 'outline';
  return (
    <button
      type="button"
      className={cx(s.button, VARIANTS[variant], sized && SIZES[size], className)}
      {...rest}
    />
  );
}

/** Bare glyph button: no chrome, tints to the accent on hover. */
export function IconButton({ className, ...rest }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button type="button" className={cx(s.iconButton, className)} {...rest} />;
}
