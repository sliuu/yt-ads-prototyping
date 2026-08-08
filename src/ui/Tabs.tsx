import { cx } from './cx';
import s from './ui.module.css';

export type TabOption<T extends string> = { id: T; label: string };

type TabsProps<T extends string> = {
  options: ReadonlyArray<TabOption<T>>;
  value: T;
  onChange: (id: T) => void;
};

/** Underlined tab row at the top of a property panel. */
export function Tabs<T extends string>({ options, value, onChange }: TabsProps<T>) {
  return (
    <div className={s.tabs}>
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          className={cx(s.tab, option.id === value && s.tabOn)}
          onClick={() => onChange(option.id)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
