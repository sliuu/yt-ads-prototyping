import { Button } from '../../ui/Button';
import { ChevronLeftIcon, SessionCheckIcon } from '../../ui/icons';
import { RESULTS_SUMMARY, RESULT_ROWS } from './prototyperData';
import type { PrototyperStore } from './usePrototyper';
import s from './prototyper.module.css';

/** The session that was just recorded, on top of the mocked aggregate. */
export function ResultsView({ store }: { store: PrototyperStore }) {
  return (
    <div className={s.results}>
      <div className={s.fullBar}>
        <button type="button" className={s.backButton} onClick={store.backToEditor}>
          <ChevronLeftIcon size={15} />
          Back to editor
        </button>
        <span className={s.fullBarTitle}>Results</span>
        <div className={s.barSpacer} />
      </div>

      <div className={s.resultsScroll}>
        <div className={s.resultsInner}>
          <div className={s.sessionCard}>
            <span className={s.sessionIcon}>
              <SessionCheckIcon />
            </span>
            <div>
              <div className={s.sessionEyebrow}>Session recorded</div>
              <div className={s.sessionOutcome}>
                {store.outcome === 'skipped'
                  ? 'Skipped at first opportunity'
                  : 'Watched to completion'}
              </div>
              <div className={s.sessionMeta}>
                {store.watched}s watched · skip unlocked at {store.skipAfter}s
              </div>
            </div>
          </div>

          <h1 className={s.resultsHeading}>Ad completion by variant</h1>
          <p className={s.resultsLead}>{RESULTS_SUMMARY}</p>

          <div className={s.resultRows}>
            {RESULT_ROWS.map((row) => (
              <div key={row.name} className={s.resultRow}>
                <span className={s.resultName}>{row.name}</span>
                <div className={s.resultTrack}>
                  <div className={s.resultBar} style={{ width: `${row.completed * 100}%` }} />
                </div>
                <div className={s.resultStat}>
                  <div className={s.resultValue}>{Math.round(row.completed * 100)}%</div>
                  <div className={s.resultCaption}>completed</div>
                </div>
                <div className={s.resultStat}>
                  <div className={s.resultValue}>{row.skipped}</div>
                  <div className={s.resultCaption}>skipped</div>
                </div>
              </div>
            ))}
          </div>

          <div className={s.resultsActions}>
            <Button size="md" onClick={store.backToEditor}>
              Edit the prototype
            </Button>
            <Button variant="outline" size="md">
              Export CSV
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
