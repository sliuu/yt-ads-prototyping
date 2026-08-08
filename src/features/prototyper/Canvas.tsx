import type { MouseEvent } from 'react';
import { HatchStream, StreamCaption } from '../../components/ad/HatchStream';
import { TimerChip } from '../../components/ad/TimerChip';
import { cx } from '../../ui/cx';
import { EditorCanvas } from '../editor/EditorCanvas';
import { AD_COPY, slugify, type ElementId } from './prototyperData';
import type { PrototyperStore } from './usePrototyper';
import s from './prototyper.module.css';

const SCREEN_WIDTH = 392;

/** The phone under construction. Clicking any part of it selects that layer. */
export function Canvas({ store }: { store: PrototyperStore }) {
  /* Nested elements would otherwise also select every ancestor. */
  const pick = (id: ElementId) => (event: MouseEvent) => {
    event.stopPropagation();
    store.select(id);
  };

  const isSelected = (id: ElementId) => store.selected === id;

  return (
    <EditorCanvas label={`${store.variantName} variant`} frameWidth={SCREEN_WIDTH}>
      <div
        className={cx(s.screen, isSelected('screen1') && s.screenOn)}
        onClick={() => store.select('screen1')}
      >
        <div className={s.screenInner}>
          {store.hasLayer('shorts') && (
            <div
              className={cx(s.stream, isSelected('shorts') && s.streamOn)}
              onClick={pick('shorts')}
            >
              <HatchStream step={12}>
                <StreamCaption>
                  {store.source
                    ? `▶ shorts stream · ${slugify(store.source.name)}`
                    : '▶ shorts stream · no-source'}
                </StreamCaption>
              </HatchStream>

              {store.hasLayer('banner') && (
                <div
                  className={cx(s.banner, isSelected('banner') && s.selectedOnAd)}
                  onClick={pick('banner')}
                >
                  <div className={s.bannerHeading} style={{ textAlign: store.textAlign.heading }}>
                    {AD_COPY.heading}
                  </div>
                  <div className={s.bannerSubtitle} style={{ textAlign: store.textAlign.subtitle }}>
                    {AD_COPY.subtitle}
                  </div>
                </div>
              )}

              {store.showTimer && (
                <div className={s.timerSlot}>
                  <TimerChip blur label={`0:0${store.skipAfter}`} />
                </div>
              )}
            </div>
          )}
          {!store.hasLayer('shorts') && store.hasLayer('banner') && (
            <div
              className={cx(s.banner, isSelected('banner') && s.selectedOnAd)}
              onClick={pick('banner')}
            >
              <div className={s.bannerHeading} style={{ textAlign: store.textAlign.heading }}>
                {AD_COPY.heading}
              </div>
              <div className={s.bannerSubtitle} style={{ textAlign: store.textAlign.subtitle }}>
                {AD_COPY.subtitle}
              </div>
            </div>
          )}
        </div>
      </div>
    </EditorCanvas>
  );
}
