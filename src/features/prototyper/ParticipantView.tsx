import { HatchStream, NowPlaying, StreamCaption } from '../../components/ad/HatchStream';
import { ShortsRail } from '../../components/ad/ShortsRail';
import { cx } from '../../ui/cx';
import { ChevronLeftIcon, LockIcon, PlayIcon, SkipIcon } from '../../ui/icons';
import { AD_COPY, slugify } from './prototyperData';
import type { PrototyperStore } from './usePrototyper';
import s from './prototyper.module.css';

/**
 * What a recruited participant sees. The skip control is the whole point: it
 * stays locked until the session clock passes the configured skip-after value.
 */
export function ParticipantView({ store }: { store: PrototyperStore }) {
  return (
    <div className={s.stage}>
      <button type="button" className={s.exitButton} onClick={store.exitView}>
        <ChevronLeftIcon size={14} />
        Exit preview
      </button>
      <div className={s.stageLabel}>{store.variantName} · participant view</div>

      <div className={s.devicePhone}>
        <HatchStream step={16} tone="shorts">
          <NowPlaying>
            <PlayIcon size={42} style={{ color: 'rgba(255,255,255,.5)' }} />
            <StreamCaption>
              {store.source ? `${slugify(store.source.name)} · now playing` : 'no source linked'}
            </StreamCaption>
          </NowPlaying>
        </HatchStream>

        <ShortsRail />

        <div className={s.liveBanner}>
          <div className={s.liveBannerRow}>
            <div>
              <div className={s.liveHeading}>{AD_COPY.heading}</div>
              <div className={s.liveSubtitle}>{AD_COPY.subtitle}</div>
            </div>
            <div className={s.installPill}>Install</div>
          </div>
        </div>

        <div className={s.skipSlot}>
          {store.canSkip ? (
            <button
              type="button"
              className={cx(s.skipChip, s.skipChipReady)}
              onClick={store.skipNow}
            >
              Skip ad
              <SkipIcon />
            </button>
          ) : (
            <div className={s.skipChip}>
              <LockIcon size={15} />
              Skip in 0:0{store.countdown}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
