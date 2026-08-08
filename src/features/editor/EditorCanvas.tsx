import type { ReactNode } from 'react';
import s from './shell.module.css';

type EditorCanvasProps = {
  label: string;
  /** Width of the phone frame, used to align the label with its left edge. */
  frameWidth: number;
  /** Floating pill in the corner; omitted when the canvas needs no coaching. */
  hint?: ReactNode;
  children: ReactNode;
};

/** Dot-grid work area holding the phone frame, plus the floating hint pill. */
export function EditorCanvas({ label, frameWidth, hint, children }: EditorCanvasProps) {
  return (
    <div className={s.canvas}>
      <div className={s.canvasInner}>
        <span className={s.canvasLabel} style={{ marginLeft: `calc(50% - ${frameWidth / 2}px)` }}>
          {label}
        </span>
        {children}
      </div>
      {hint && (
        <div className={s.hintPill}>
          <span className={s.hintDot} />
          {hint}
        </div>
      )}
    </div>
  );
}
