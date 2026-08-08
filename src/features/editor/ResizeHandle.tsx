import { useState, type KeyboardEvent, type PointerEvent, type RefObject } from 'react';
import { cx } from '../../ui/cx';
import s from './shell.module.css';

/** `col` drags left/right and resizes width; `row` drags up/down and resizes height. */
type Axis = 'col' | 'row';

type ResizeHandleProps = {
  axis: Axis;
  /** The element being sized — measured at drag start, so it can rest on a token default. */
  target: RefObject<HTMLElement | null>;
  min: number;
  max: number;
  /** For panels that grow as the pointer moves *towards* them (the right panel). */
  invert?: boolean;
  label: string;
  /** Current size, once dragged; only used to describe the handle to assistive tech. */
  value?: number | null;
  onResize: (size: number) => void;
};

/* How far one arrow-key press moves the divider. */
const STEP = 16;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

/**
 * The grab strip between two panes. Its negative margins cancel its own width,
 * so it straddles the seam it controls rather than pushing the panes apart.
 */
export function ResizeHandle({
  axis,
  target,
  min,
  max,
  invert,
  label,
  value,
  onResize,
}: ResizeHandleProps) {
  const [dragging, setDragging] = useState(false);

  const sizeOf = (el: HTMLElement) => {
    const rect = el.getBoundingClientRect();
    return axis === 'col' ? rect.width : rect.height;
  };

  const startDrag = (event: PointerEvent<HTMLDivElement>) => {
    const el = target.current;
    if (!el || event.button !== 0) return;
    /* Otherwise the drag selects text across the whole editor. */
    event.preventDefault();

    const startSize = sizeOf(el);
    const origin = axis === 'col' ? event.clientX : event.clientY;
    setDragging(true);

    /* The pointer regularly leaves the 9px strip mid-drag, so the window listens. */
    const move = (moveEvent: globalThis.PointerEvent) => {
      const delta = (axis === 'col' ? moveEvent.clientX : moveEvent.clientY) - origin;
      onResize(clamp(startSize + (invert ? -delta : delta), min, max));
    };

    const previousCursor = document.body.style.cursor;
    document.body.style.cursor = axis === 'col' ? 'col-resize' : 'row-resize';

    const stop = () => {
      window.removeEventListener('pointermove', move);
      document.body.style.cursor = previousCursor;
      setDragging(false);
    };

    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', stop, { once: true });
    window.addEventListener('pointercancel', stop, { once: true });
  };

  const nudge = (event: KeyboardEvent<HTMLDivElement>) => {
    const el = target.current;
    if (!el) return;
    const [less, more] = axis === 'col' ? ['ArrowLeft', 'ArrowRight'] : ['ArrowUp', 'ArrowDown'];
    if (event.key !== less && event.key !== more) return;
    event.preventDefault();
    const direction = (event.key === more ? 1 : -1) * (invert ? -1 : 1);
    onResize(clamp(sizeOf(el) + direction * STEP, min, max));
  };

  return (
    <div
      role="separator"
      aria-label={label}
      aria-orientation={axis === 'col' ? 'vertical' : 'horizontal'}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value ?? undefined}
      tabIndex={0}
      className={cx(s.handle, axis === 'col' ? s.handleCol : s.handleRow, dragging && s.handleOn)}
      onPointerDown={startDrag}
      onKeyDown={nudge}
    />
  );
}
