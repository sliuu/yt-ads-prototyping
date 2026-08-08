import type { ReactNode } from 'react';
import { PlayIcon } from '../../ui/icons';
import { HatchStream } from '../../components/ad/HatchStream';
import { cx } from '../../ui/cx';
import s from './welcome.module.css';

export type MiniEditorKind = 'shorts' | 'reel' | 'interstitial';

/**
 * Thumbnail for a custom component: a doll's-house version of the component
 * editor, so the card shows *where* the element was built, not just what it is.
 */
export function MiniEditorPreview({ kind }: { kind: MiniEditorKind }) {
  return (
    <div className={s.mini}>
      <div className={s.miniBar}>
        <span className={s.miniMark} />
        <span className={s.miniTitleLine} />
        <span className={s.miniPublish} />
      </div>
      <div className={s.miniBody}>
        <MiniSidePanel side="left" rows={['#dfe3dc', '#d3ecd6', '#eceee9', '#eceee9']} />
        <div className={s.miniCanvas}>
          <div className={s.miniPhone}>{SUBJECTS[kind]()}</div>
        </div>
        <MiniSidePanel side="right" rows={['#dfe3dc', '#eceee9', '#eceee9', '#d3ecd6']} />
      </div>
    </div>
  );
}

const ROW_WIDTHS = [16, 24, 20, 22];

function MiniSidePanel({ side, rows }: { side: 'left' | 'right'; rows: string[] }) {
  return (
    <div className={cx(s.miniSide, side === 'left' ? s.miniSideLeft : s.miniSideRight)}>
      {rows.map((background, index) => (
        <span
          key={index}
          className={s.miniRow}
          style={{ width: ROW_WIDTHS[side === 'left' ? index : rows.length - 1 - index], background }}
        />
      ))}
    </div>
  );
}

const SUBJECTS: Record<MiniEditorKind, () => ReactNode> = {
  shorts: () => (
    <>
      <HatchStream step={7} tone="shorts">
        <PlayIcon size={14} style={{ color: 'rgba(255,255,255,.45)' }} />
      </HatchStream>
      <div className={s.miniShortsDots}>
        <span />
        <span />
      </div>
      <div className={s.miniShortsTimer}>0:05</div>
      <div className={s.miniShortsBanner} />
    </>
  ),

  reel: () => (
    <>
      <div className={s.miniReel}>
        <div className={cx(s.miniReelCard, s.miniReelLead)}>
          <div />
        </div>
        <div className={cx(s.miniReelCard, s.miniReelNext)} />
      </div>
      <div className={s.miniDots}>
        <span />
        <span />
        <span />
      </div>
    </>
  ),

  interstitial: () => (
    <div className={s.miniInterstitial}>
      <div className={s.miniClose}>×</div>
      <span className={s.miniTile} />
      <span
        style={{ width: 32, height: 5, borderRadius: 2, background: 'rgba(255,255,255,.35)' }}
      />
      <span style={{ width: 22, height: 4, borderRadius: 2, background: 'rgba(255,255,255,.2)' }} />
      <span className={s.miniClaim}>Claim</span>
    </div>
  ),
};
