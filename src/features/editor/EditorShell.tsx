import { useRef, useState, type ReactNode } from 'react';
import { ROUTES } from '../../router';
import { IconButton } from '../../ui/Button';
import { ResizeHandle } from './ResizeHandle';
import s from './shell.module.css';

export type Accent = 'teal' | 'green';

/* Panels rest at their token width until dragged, so only the bounds live here. */
const PANEL_RANGE = { min: 260, max: 560 };

type EditorShellProps = {
  accent: Accent;
  topBar: ReactNode;
  left: ReactNode;
  canvas: ReactNode;
  right: ReactNode;
  /** Full-screen layers (participant view, results, gallery) and modals. */
  overlays?: ReactNode;
};

/** Top bar + left panel / canvas / right panel, in the product's accent mode. */
export function EditorShell({ accent, topBar, left, canvas, right, overlays }: EditorShellProps) {
  /* null until dragged — the panels sit at their token width to start with. */
  const [leftWidth, setLeftWidth] = useState<number | null>(null);
  const [rightWidth, setRightWidth] = useState<number | null>(null);
  const leftRef = useRef<HTMLElement>(null);
  const rightRef = useRef<HTMLElement>(null);

  return (
    <div className={s.app} data-accent={accent}>
      <div className={s.topBar}>{topBar}</div>
      <div className={s.body}>
        <aside
          ref={leftRef}
          className={s.leftPanel}
          style={leftWidth === null ? undefined : { width: leftWidth }}
        >
          {left}
        </aside>
        <ResizeHandle
          axis="col"
          target={leftRef}
          {...PANEL_RANGE}
          label="Resize the layers panel"
          value={leftWidth}
          onResize={setLeftWidth}
        />

        {canvas}

        <ResizeHandle
          axis="col"
          target={rightRef}
          {...PANEL_RANGE}
          invert
          label="Resize the properties panel"
          value={rightWidth}
          onResize={setRightWidth}
        />
        <aside
          ref={rightRef}
          className={s.rightPanel}
          style={rightWidth === null ? undefined : { width: rightWidth }}
        >
          {right}
        </aside>
      </div>
      {overlays}
    </div>
  );
}

export function EditorTopBar({
  left,
  center,
  right,
}: {
  left: ReactNode;
  center: ReactNode;
  right: ReactNode;
}) {
  return (
    <>
      <div className={s.topBarLeft}>{left}</div>
      <div className={s.topBarCenter}>{center}</div>
      <div className={s.topBarRight}>{right}</div>
    </>
  );
}

/** Accent-colored square that takes the user back to the Welcome screen. */
export function HomeLogo({ children }: { children: ReactNode }) {
  return (
    <a href={ROUTES.welcome} title="Back to home" className={s.homeLogo}>
      {children}
    </a>
  );
}

export function ProjectTitle({ children }: { children: ReactNode }) {
  return <span className={s.projectTitle}>{children}</span>;
}

type PanelHeadingProps = {
  title: string;
  /** Trailing affordance, usually a `+` icon button. */
  action?: { label: string; icon: ReactNode; onClick?: () => void };
  /** Static trailing content when the slot isn't a button. */
  trailing?: ReactNode;
};

export function PanelHeading({ title, action, trailing }: PanelHeadingProps) {
  return (
    <div className={s.panelHeading}>
      <span className={s.panelTitle}>{title}</span>
      {action && (
        <IconButton title={action.label} aria-label={action.label} onClick={action.onClick}>
          {action.icon}
        </IconButton>
      )}
      {trailing}
    </div>
  );
}
