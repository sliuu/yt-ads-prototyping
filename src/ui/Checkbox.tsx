import { CheckIcon, HelpIcon } from './icons';
import { cx } from './cx';
import s from './ui.module.css';

type CheckboxProps = {
  label: string;
  checked: boolean;
  onChange: () => void;
  /** Shows a help glyph after the label (the Instrumentation option uses it). */
  help?: boolean;
};

export function Checkbox({ label, checked, onChange, help }: CheckboxProps) {
  return (
    <label className={s.checkbox}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
      />
      <span className={cx(s.checkboxBox, checked && s.checkboxOn)}>{checked && <CheckIcon />}</span>
      <span>{label}</span>
      {help && (
        <span className={s.checkboxHelp}>
          <HelpIcon size={14} />
        </span>
      )}
    </label>
  );
}
