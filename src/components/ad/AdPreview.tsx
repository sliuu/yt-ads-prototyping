import type { CSSProperties, ReactNode } from 'react';
import { ChevronUpIcon, PlayIcon, SkipIcon } from '../../ui/icons';
import { cx } from '../../ui/cx';
import { HatchStream } from './HatchStream';
import s from './adPreview.module.css';

export type AdFormatKind =
  | 'shorts'
  | 'infeed'
  | 'interstitial'
  | 'banner'
  | 'rewarded'
  | 'preroll'
  | 'masthead'
  | 'carousel'
  | 'story';

/** The screen a format is shown on. Decides the frame's shape, not its contents. */
export type PreviewDevice = 'phone' | 'desktop' | 'tv';

type AdPreviewProps = {
  kind: AdFormatKind;
  /** Defaults to the phone — the surface most of these formats ship on. */
  device?: PreviewDevice;
  /** Dot color of the surrounding grid. */
  tint?: string;
  /** Canvas color behind the dots. */
  bg?: string;
};

const SCREENS: Record<PreviewDevice, string> = {
  phone: s.phoneScreen,
  desktop: s.desktopScreen,
  tv: s.tvScreen,
};

/**
 * A miniature device showing one ad format, sitting on a dotted canvas. Every
 * template / project / component card uses this so its thumbnail reflects both
 * the format it contains and the surface that format runs on: a phone in
 * portrait, a desktop monitor at 16:10 under browser chrome, a 16:9 TV.
 */
export function AdPreview({
  kind,
  device = 'phone',
  tint = '#dde3da',
  bg = '#f3f5f2',
}: AdPreviewProps) {
  return (
    <div
      className={s.stage}
      style={{ '--preview-bg': bg, '--preview-dot': tint } as CSSProperties}
    >
      <div className={s.device}>
        <div className={cx(s.screen, SCREENS[device])}>
          {device === 'desktop' && (
            <div className={s.chrome}>
              <span />
              <span />
              <span />
              <i />
            </div>
          )}
          {/* The formats position themselves against this box, so the chrome bar
              above it stays clear of the creative. */}
          <div className={cx(s.viewport, device !== 'phone' && s.wide)}>{FORMATS[kind](device)}</div>
        </div>
        {/* Only the TV stands on something — the browser chrome is what tells a
            desktop screen apart, and a stand under it just read as a second TV. */}
        {device === 'tv' && (
          <>
            <span className={s.neck} />
            <span className={s.base} />
          </>
        )}
      </div>
    </div>
  );
}

const FORMATS: Record<AdFormatKind, (device: PreviewDevice) => ReactNode> = {
  shorts: () => (
    <>
      <HatchStream step={7} tone="shorts">
        <PlayIcon size={15} style={{ color: 'rgba(255,255,255,.45)' }} />
      </HatchStream>
      <div className={s.shortsDots}>
        <span />
        <span />
      </div>
      <div className={cx(s.shortsTimer, s.monoTiny)}>0:05</div>
      <div className={s.shortsBanner} />
    </>
  ),

  /* On desktop the feed is a watch page: one wide player with the ad outline,
     and the rail of up-next rows that only fits alongside it on a big screen. */
  infeed: (device) =>
    device === 'phone' ? (
      <div className={cx(s.sheet, s.padded)} style={{ background: '#fff' }}>
        <div className={s.feedRow}>
          <span className={s.feedAvatar} />
          <span className={s.feedLine} />
        </div>
        <div className={s.block} style={{ height: 20 }} />
        <div className={s.feedVideo}>
          <PlayIcon size={12} />
          <span className={s.adChip} style={{ top: 2, left: 2 }}>
            AD
          </span>
        </div>
        <div className={s.block} style={{ height: 16 }} />
      </div>
    ) : (
      <div className={cx(s.sheet, s.webPage)}>
        <div className={s.webMain}>
          <div className={s.webVideo}>
            <PlayIcon size={14} />
            <span className={s.adChip} style={{ top: 3, left: 3 }}>
              AD
            </span>
          </div>
          <div className={s.feedRow}>
            <span className={s.feedAvatar} />
            <span className={s.feedLine} />
          </div>
        </div>
        <div className={s.webRail}>
          <span />
          <span />
          <span />
          <span />
        </div>
      </div>
    ),

  interstitial: () => (
    <div className={cx(s.sheet, s.stack)} style={{ background: 'var(--screen-navy)' }}>
      <div className={s.topRight}>
        <span className={s.monoTiny} style={{ color: 'rgba(255,255,255,.7)' }}>
          0:05
        </span>
        <span className={s.closeDot}>×</span>
      </div>
      <span className={s.creativeTile} />
      <span className={s.bar} style={{ width: 34, height: 5, background: 'rgba(255,255,255,.4)' }} />
      <span
        className={s.bar}
        style={{ width: 24, height: 4, background: 'rgba(255,255,255,.22)' }}
      />
      <span className={s.installPill} style={{ marginTop: 1 }}>
        Install
      </span>
    </div>
  ),

  banner: () => (
    <>
      <HatchStream step={7}>
        <PlayIcon size={15} style={{ color: 'rgba(255,255,255,.4)' }} />
      </HatchStream>
      <div className={s.bannerOverlay}>
        <span
          className={s.bar}
          style={{ flex: 1, height: 4, background: 'rgba(255,255,255,.85)' }}
        />
        <span className={s.bannerCta} />
      </div>
    </>
  ),

  rewarded: () => (
    <div className={cx(s.sheet, s.stack)} style={{ background: 'var(--screen-slate)' }}>
      <div className={s.closeDot} style={{ position: 'absolute', top: 4, right: 5 }}>
        ×
      </div>
      <span className={s.rewardStar}>★</span>
      <span className={s.bar} style={{ width: 34, height: 5, background: 'rgba(255,255,255,.4)' }} />
      <span className={s.rewardPill} style={{ marginTop: 1 }}>
        Reward
      </span>
    </div>
  ),

  preroll: () => (
    <>
      <div
        className={s.sheet}
        style={{
          background: 'var(--screen-dark)',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <PlayIcon size={16} style={{ color: 'rgba(255,255,255,.55)' }} />
      </div>
      <span className={s.adChip} style={{ top: 5, left: 5, fontSize: 5 }}>
        AD
      </span>
      <div className={s.skipBox}>
        <span>Skip</span>
        <SkipIcon size={7} strokeWidth={2} />
      </div>
      <div className={s.progressTrack}>
        <div className={s.progressFill} />
      </div>
    </>
  ),

  /* A TV masthead is the whole screen, so it drops the page around it and picks
     up the focus ring the remote moves between. */
  masthead: (device) =>
    device === 'tv' ? (
      <div className={s.tvHero}>
        <span className={cx(s.adChip, s.adChipDark)} style={{ top: 5, left: 5 }}>
          AD
        </span>
        <span className={s.bar} style={{ width: 54, height: 6, background: '#fff' }} />
        <span
          className={s.bar}
          style={{ width: 36, height: 4, background: 'rgba(255,255,255,.55)' }}
        />
        <span className={s.tvCta}>Watch now</span>
      </div>
    ) : (
      <div className={cx(s.sheet, s.padded)} style={{ background: '#fff' }}>
        <div className={s.mastheadHero}>
          <span className={cx(s.adChip, s.adChipDark)} style={{ top: 2, left: 2 }}>
            AD
          </span>
          <span className={s.mastheadCta}>Install</span>
        </div>
        <div className={s.mastheadGrid}>
          <div />
          <div />
          <div />
          <div />
        </div>
      </div>
    ),

  carousel: () => (
    <>
      <div className={s.carouselTrack}>
        <div className={cx(s.carouselCard, s.carouselCardLead)}>
          <div />
        </div>
        <div className={cx(s.carouselCard, s.carouselCardNext)} />
      </div>
      <div className={s.pageDots}>
        <span />
        <span />
        <span />
      </div>
    </>
  ),

  story: () => (
    <>
      <div className={s.storyBackdrop} />
      <div className={s.storyProgress}>
        <span />
        <span />
        <span />
      </div>
      <span className={cx(s.adChip, s.adChipDark)} style={{ top: 10, left: 5 }}>
        AD
      </span>
      <div className={s.storySwipe}>
        <ChevronUpIcon size={10} />
        <span>Swipe up</span>
      </div>
    </>
  ),
};
