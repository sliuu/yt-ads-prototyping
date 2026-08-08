import { useCallback, useRef, useState } from 'react';
import { cx } from './cx';
import { CheckIcon, ChevronDownIcon } from './icons';
import { useDismiss } from './useDismiss';
import s from './ui.module.css';

export type SelectOption<T extends string> = {
  id: T;
  label: string;
  /** Trailing detail, dimmed — a file's size, a theme's property count. */
  meta?: string;
};

type SelectProps<T extends string> = {
  options: ReadonlyArray<SelectOption<T>>;
  value: T;
  onChange: (id: T) => void;
  /** Names the control for screen readers; there is no visible label inside it. */
  label: string;
  /** Shown when `value` matches no option. */
  placeholder?: string;
  /** Filenames and other code-ish values read better in the mono face. */
  mono?: boolean;
  size?: 'md' | 'lg';
  /** Opens upward, for a control sitting near the bottom of a clipped modal. */
  placement?: 'down' | 'up';
};

/**
 * A select that draws its own menu. The native control is fine functionally but
 * hands the popup to the OS, which lands a system-styled list in the middle of
 * an otherwise custom panel — the same reason the variant chooser is hand-built.
 */
export function Select<T extends string>({
  options,
  value,
  onChange,
  label,
  placeholder = 'Select…',
  mono,
  size = 'md',
  placement = 'down',
}: SelectProps<T>) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);
  useDismiss(root, open, close);

  const current = options.find((option) => option.id === value);

  return (
    <div className={s.select} ref={root}>
      <button
        type="button"
        className={cx(
          s.selectButton,
          size === 'lg' && s.selectButtonLg,
          open && s.selectButtonOpen,
        )}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={label}
        onClick={() => setOpen((wasOpen) => !wasOpen)}
      >
        <span className={cx(s.selectValue, mono && s.selectValueMono, !current && s.selectEmpty)}>
          {current?.label ?? placeholder}
        </span>
        <ChevronDownIcon size={14} strokeWidth={1.6} className={s.selectChevron} />
      </button>

      {open && (
        <div
          className={cx(s.selectMenu, placement === 'up' && s.selectMenuUp)}
          role="listbox"
          aria-label={label}
        >
          {options.map((option) => {
            const on = option.id === value;
            return (
              <button
                key={option.id}
                type="button"
                role="option"
                aria-selected={on}
                className={cx(s.selectOption, on && s.selectOptionOn)}
                onClick={() => {
                  onChange(option.id);
                  setOpen(false);
                }}
              >
                <span className={cx(s.selectOptionLabel, mono && s.selectValueMono)}>
                  {option.label}
                </span>
                {option.meta && <span className={s.selectOptionMeta}>{option.meta}</span>}
                {on && <CheckIcon size={14} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
