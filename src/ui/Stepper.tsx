import { cx } from './cx';
import s from './ui.module.css';

type StepperProps = {
  value: number;
  onChange: (next: number) => void;
  min: number;
  max: number;
  /** `lg` is the roomier stepper used inside modals. */
  size?: 'sm' | 'lg';
};

export function Stepper({ value, onChange, min, max, size = 'sm' }: StepperProps) {
  const clamp = (next: number) => onChange(Math.min(max, Math.max(min, next)));
  return (
    <div className={cx(s.stepper, size === 'lg' && s.stepperLg)}>
      <button
        type="button"
        className={s.stepperButton}
        onClick={() => clamp(value - 1)}
        aria-label="Decrease"
      >
        −
      </button>
      <span className={s.stepperValue}>{value}</span>
      <button
        type="button"
        className={s.stepperButton}
        onClick={() => clamp(value + 1)}
        aria-label="Increase"
      >
        +
      </button>
    </div>
  );
}
