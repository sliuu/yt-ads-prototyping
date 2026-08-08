/*
 * Icon set.
 *
 * Every icon inherits its color from `currentColor`, so callers set color in
 * CSS rather than passing hex values around. Stroke icons are drawn on a 16×16
 * grid unless noted; the few 24×24 ones come from the ad-surface mocks.
 */
import type { CSSProperties, ReactNode } from 'react';

export type IconProps = {
  size?: number;
  strokeWidth?: number;
  className?: string;
  style?: CSSProperties;
};

type ShapeProps = IconProps & { box?: number; children: ReactNode };

function Line({ size = 16, box = 16, strokeWidth = 1.6, children, ...rest }: ShapeProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${box} ${box}`}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...rest}
    >
      {children}
    </svg>
  );
}

function Solid({ size = 16, box = 16, children, ...rest }: ShapeProps) {
  return (
    <svg width={size} height={size} viewBox={`0 0 ${box} ${box}`} fill="currentColor" {...rest}>
      {children}
    </svg>
  );
}

/* ---------- Brand marks ---------- */

/** Play-in-a-rectangle — the prototype (teal) product mark. */
export function PlayerMarkIcon({ size = 18, ...rest }: IconProps) {
  return (
    <Line size={size} box={24} strokeWidth={2.2} {...rest}>
      <rect x="3" y="4" width="18" height="14" rx="2.5" />
      <path d="M10 9l4 2.5-4 2.5z" fill="currentColor" stroke="none" />
    </Line>
  );
}

/** Bracketed chip — the component-editor (green) product mark. */
export function ComponentMarkIcon({ size = 18, strokeWidth = 1.7, ...rest }: IconProps) {
  return (
    <Line size={size} strokeWidth={strokeWidth} {...rest}>
      {/* The bracket frame is square: 2.5–13.5 on both axes, so the mark doesn't
          read as squeezed next to round or square-framed icons. */}
      <path d="M5.5 2.5H2.5v3M10.5 2.5h3v3M5.5 13.5H2.5v-3M10.5 13.5h3v-3" />
      <rect x="6.5" y="6.5" width="3" height="3" rx=".6" />
    </Line>
  );
}

/* ---------- Chrome & navigation ---------- */

export function DocumentationIcon(props: IconProps) {
  return (
    <Line {...props}>
      <path d="M3 2.5h6a2 2 0 0 1 2 2V13H5a2 2 0 0 0-2 2z" />
      <path d="M13 4.5v10.5H7" />
    </Line>
  );
}

export function TeamIcon(props: IconProps) {
  return (
    <Line {...props}>
      <circle cx="6" cy="6" r="2.4" />
      <path d="M2.5 13.5a3.5 3.5 0 0 1 7 0" />
      <path d="M11 4.2a2.2 2.2 0 0 1 0 3.9M11.5 13.5a3.5 3.5 0 0 0-1.6-2.9" />
    </Line>
  );
}

export function PlusIcon({ strokeWidth = 1.7, ...rest }: IconProps) {
  return (
    <Line strokeWidth={strokeWidth} {...rest}>
      <line x1="8" y1="3" x2="8" y2="13" />
      <line x1="3" y1="8" x2="13" y2="8" />
    </Line>
  );
}

export function CloseIcon({ strokeWidth = 1.7, ...rest }: IconProps) {
  return (
    <Line strokeWidth={strokeWidth} {...rest}>
      <line x1="4" y1="4" x2="12" y2="12" />
      <line x1="12" y1="4" x2="4" y2="12" />
    </Line>
  );
}

export function ChevronDownIcon({ strokeWidth = 1.7, ...rest }: IconProps) {
  return (
    <Line strokeWidth={strokeWidth} {...rest}>
      <polyline points="4,6 8,10 12,6" />
    </Line>
  );
}

export function ChevronUpIcon({ strokeWidth = 1.8, ...rest }: IconProps) {
  return (
    <Line strokeWidth={strokeWidth} {...rest}>
      <polyline points="4,10 8,6 12,10" />
    </Line>
  );
}

export function ChevronLeftIcon({ strokeWidth = 1.7, ...rest }: IconProps) {
  return (
    <Line strokeWidth={strokeWidth} {...rest}>
      <polyline points="10,3 5,8 10,13" />
    </Line>
  );
}

export function ChevronRightIcon({ strokeWidth = 1.7, ...rest }: IconProps) {
  return (
    <Line strokeWidth={strokeWidth} {...rest}>
      <polyline points="6,3 11,8 6,13" />
    </Line>
  );
}

/** Box-with-arrow — opens the participant view. */
export function LaunchIcon({ strokeWidth = 1.7, ...rest }: IconProps) {
  return (
    <Line strokeWidth={strokeWidth} {...rest}>
      <path d="M6 3H3v10h10v-3" />
      <path d="M9 3h4v4" />
      <line x1="13" y1="3" x2="7.5" y2="8.5" />
    </Line>
  );
}

export function ExternalLinkIcon({ strokeWidth = 1.5, ...rest }: IconProps) {
  return (
    <Line strokeWidth={strokeWidth} {...rest}>
      <path d="M4 11.5V4a1 1 0 0 1 1-1h5.5" />
      <path d="M9 13h3.5a.5.5 0 0 0 .5-.5V8" />
      <path d="M13 3l-6 6" />
    </Line>
  );
}

export function CopyIcon({ strokeWidth = 1.5, ...rest }: IconProps) {
  return (
    <Line strokeWidth={strokeWidth} {...rest}>
      <rect x="5.5" y="5.5" width="7" height="7" rx="1.5" />
      <path d="M3.5 10.5V4a1 1 0 0 1 1-1h6" />
    </Line>
  );
}

export function UploadIcon({ strokeWidth = 1.7, ...rest }: IconProps) {
  return (
    <Line strokeWidth={strokeWidth} {...rest}>
      <path d="M8 11V3" />
      <polyline points="5,6 8,3 11,6" />
      <path d="M3 11v2h10v-2" />
    </Line>
  );
}

export function SearchIcon({ strokeWidth = 1.6, ...rest }: IconProps) {
  return (
    <Line strokeWidth={strokeWidth} {...rest}>
      <circle cx="7" cy="7" r="4.5" />
      <line x1="10.5" y1="10.5" x2="14" y2="14" />
    </Line>
  );
}

export function InfoIcon({ strokeWidth = 1.6, ...rest }: IconProps) {
  return (
    <Line strokeWidth={strokeWidth} {...rest}>
      <circle cx="8" cy="8" r="6" />
      <path d="M8 3.5v5" />
      <circle cx="8" cy="11.2" r=".7" fill="currentColor" stroke="none" />
    </Line>
  );
}

export function HelpIcon({ strokeWidth = 1.5, ...rest }: IconProps) {
  return (
    <Line strokeWidth={strokeWidth} {...rest}>
      <circle cx="8" cy="8" r="6" />
      <path d="M6.5 6.2a1.5 1.5 0 1 1 2 1.4c-.5.2-.8.5-.8 1" />
      <circle cx="8" cy="11" r=".6" fill="currentColor" stroke="none" />
    </Line>
  );
}

export function CheckIcon({ size = 12, strokeWidth = 2, ...rest }: IconProps) {
  return (
    <Line size={size} box={14} strokeWidth={strokeWidth} {...rest}>
      <polyline points="3,7.5 6,10.5 11,4" />
    </Line>
  );
}

/** Larger tick used in the action picker and the results banner. */
export function CheckMarkIcon({ size = 17, strokeWidth = 2, ...rest }: IconProps) {
  return (
    <Line size={size} strokeWidth={strokeWidth} {...rest}>
      <polyline points="3.5,8.5 6.5,11.5 12.5,4.5" />
    </Line>
  );
}

/* ---------- Layer & element glyphs ---------- */

export function SquareIcon({ strokeWidth = 1.5, ...rest }: IconProps) {
  return (
    <Line strokeWidth={strokeWidth} {...rest}>
      <rect x="2.5" y="2.5" width="11" height="11" rx="2" />
    </Line>
  );
}

/** Phone outline — a screen layer in the tree. */
export function ScreenIcon({ strokeWidth = 1.5, ...rest }: IconProps) {
  return (
    <Line strokeWidth={strokeWidth} {...rest}>
      <rect x="4" y="1.5" width="8" height="13" rx="2" />
      <line x1="6.9" y1="3.7" x2="9.1" y2="3.7" />
      <line x1="6.6" y1="12.3" x2="9.4" y2="12.3" />
    </Line>
  );
}

/** Two offset frames — one variant of a screen stacked behind another. */
export function VariantIcon({ strokeWidth = 1.5, ...rest }: IconProps) {
  return (
    <Line strokeWidth={strokeWidth} {...rest}>
      <path d="M5.5 3.5h5a2 2 0 0 1 2 2v5" />
      <rect x="2.5" y="6" width="7.5" height="7.5" rx="2" />
    </Line>
  );
}

export function ShortsPlayerIcon({ strokeWidth = 1.5, ...rest }: IconProps) {
  return (
    <Line strokeWidth={strokeWidth} {...rest}>
      <circle cx="8" cy="8" r="5.5" />
      <path d="M6.6 5.6 L10.4 8 L6.6 10.4 Z" fill="currentColor" stroke="none" />
    </Line>
  );
}

export function SideRailIcon({ strokeWidth = 1.5, ...rest }: IconProps) {
  return (
    <Line strokeWidth={strokeWidth} {...rest}>
      <rect x="2.5" y="2.5" width="11" height="11" rx="2" />
      <line x1="10" y1="3" x2="10" y2="13" />
      <circle cx="11.8" cy="5.3" r=".65" fill="currentColor" stroke="none" />
      <circle cx="11.8" cy="8" r=".65" fill="currentColor" stroke="none" />
      <circle cx="11.8" cy="10.7" r=".65" fill="currentColor" stroke="none" />
    </Line>
  );
}

export function AdSlotIcon({ strokeWidth = 1.5, ...rest }: IconProps) {
  return (
    <Line strokeWidth={strokeWidth} {...rest}>
      <rect x="2.5" y="4" width="11" height="8" rx="1.5" strokeDasharray="2 1.5" />
      <path d="M5.5 9.5 7.2 7.8l1.4 1.3 1.7-2 1.2 1.4" />
    </Line>
  );
}

export function TimerIcon({ strokeWidth = 1.5, ...rest }: IconProps) {
  return (
    <Line strokeWidth={strokeWidth} {...rest}>
      <circle cx="8" cy="8.5" r="5" />
      <path d="M6.3 2.5h3.4M8 5.5v3.2l2 1.2" />
    </Line>
  );
}

/** Connected-TV surface. */
export function TvIcon({ strokeWidth = 1.5, ...rest }: IconProps) {
  return (
    <Line strokeWidth={strokeWidth} {...rest}>
      <rect x="2" y="3.5" width="12" height="8.5" rx="1.6" />
      <path d="M6 14.5h4M6.4 3.5 8 1.8l1.6 1.7" />
    </Line>
  );
}

/** Desktop-web surface. */
export function BrowserIcon({ strokeWidth = 1.5, ...rest }: IconProps) {
  return (
    <Line strokeWidth={strokeWidth} {...rest}>
      <rect x="2" y="3" width="12" height="10" rx="1.6" />
      <path d="M2 6h12" />
      <path d="M4.3 4.5h.01M6.1 4.5h.01" strokeWidth={1.4} />
    </Line>
  );
}

export function BannerIcon({ strokeWidth = 1.5, ...rest }: IconProps) {
  return (
    <Line strokeWidth={strokeWidth} {...rest}>
      <rect x="2.5" y="4" width="11" height="8" rx="2" />
    </Line>
  );
}

export function DiamondIcon({ strokeWidth = 1.5, ...rest }: IconProps) {
  return (
    <Line strokeWidth={strokeWidth} {...rest}>
      <rect x="4" y="4" width="8" height="8" transform="rotate(45 8 8)" rx="1.5" />
    </Line>
  );
}

/* ---------- Text alignment ---------- */

export function AlignLeftIcon(props: IconProps) {
  return (
    <Line {...props}>
      <line x1="3" y1="4" x2="13" y2="4" />
      <line x1="3" y1="8" x2="10" y2="8" />
      <line x1="3" y1="12" x2="12" y2="12" />
    </Line>
  );
}

export function AlignCenterIcon(props: IconProps) {
  return (
    <Line {...props}>
      <line x1="3" y1="4" x2="13" y2="4" />
      <line x1="5" y1="8" x2="11" y2="8" />
      <line x1="4" y1="12" x2="12" y2="12" />
    </Line>
  );
}

export function AlignRightIcon(props: IconProps) {
  return (
    <Line {...props}>
      <line x1="3" y1="4" x2="13" y2="4" />
      <line x1="6" y1="8" x2="13" y2="8" />
      <line x1="4" y1="12" x2="13" y2="12" />
    </Line>
  );
}

export function AlignJustifyIcon(props: IconProps) {
  return (
    <Line {...props}>
      <line x1="3" y1="4" x2="13" y2="4" />
      <line x1="3" y1="8" x2="13" y2="8" />
      <line x1="3" y1="12" x2="13" y2="12" />
    </Line>
  );
}

export function LineHeightIcon({ strokeWidth = 1.5, ...rest }: IconProps) {
  return (
    <Line strokeWidth={strokeWidth} {...rest}>
      <line x1="3" y1="5" x2="13" y2="5" />
      <line x1="3" y1="11" x2="13" y2="11" />
      <polyline points="2,3 2,13" />
    </Line>
  );
}

/* ---------- Ad surfaces ---------- */

export function PlayIcon({ size = 15, ...rest }: IconProps) {
  return (
    <Solid size={size} box={24} {...rest}>
      <path d="M8 5v14l11-7z" />
    </Solid>
  );
}

export function LockIcon({ size = 13, ...rest }: IconProps) {
  return (
    <Line size={size} {...rest}>
      <rect x="4" y="7" width="8" height="6" rx="1.5" />
      <path d="M5.5 7V5.5a2.5 2.5 0 0 1 5 0V7" />
    </Line>
  );
}

export function SkipIcon({ size = 15, strokeWidth = 1.8, ...rest }: IconProps) {
  return (
    <Line size={size} strokeWidth={strokeWidth} {...rest}>
      <polyline points="4,3 9,8 4,13" />
      <line x1="12" y1="3" x2="12" y2="13" />
    </Line>
  );
}

export function HeartIcon({ size = 26, filled, ...rest }: IconProps & { filled?: boolean }) {
  return (
    <Line size={size} box={24} {...rest}>
      <path
        d="M12 20s-7-4.3-7-9a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 4.7-7 9-7 9z"
        fill={filled ? 'currentColor' : 'none'}
      />
    </Line>
  );
}

export function CommentIcon({ size = 26, ...rest }: IconProps) {
  return (
    <Line size={size} box={24} {...rest}>
      <path d="M21 12a8 8 0 0 1-11.5 7.2L4 20l1-4.5A8 8 0 1 1 21 12z" />
    </Line>
  );
}

export function MoreIcon({ size = 26, ...rest }: IconProps) {
  return (
    <Line size={size} box={24} {...rest}>
      <circle cx="12" cy="5" r="1.6" />
      <circle cx="12" cy="12" r="1.6" />
      <circle cx="12" cy="19" r="1.6" />
    </Line>
  );
}

/** Session-recorded tick in the results banner. */
export function SessionCheckIcon({ size = 22, strokeWidth = 2, ...rest }: IconProps) {
  return (
    <Line size={size} box={24} strokeWidth={strokeWidth} {...rest}>
      <polyline points="5,13 10,18 19,6" />
    </Line>
  );
}
