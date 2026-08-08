import { useState, type ReactNode } from 'react';
import { AdPreview } from '../../components/ad/AdPreview';
import { Button } from '../../ui/Button';
import { SegmentedControl } from '../../ui/SegmentedControl';
import { cx } from '../../ui/cx';
import {
  BrowserIcon,
  ComponentMarkIcon,
  HeartIcon,
  PlayerMarkIcon,
  PlusIcon,
  SearchIcon,
  ShortsPlayerIcon,
  SquareIcon,
  TeamIcon,
  TvIcon,
  type IconProps,
} from '../../ui/icons';
import { ROUTES } from '../../router';
import { SiteTopBar } from '../site/SiteTopBar';
import {
  COLLECTION_GROUPS,
  INITIAL_SAVED,
  MARKET_COMPONENTS,
  SORTS,
  deviceForSurface,
  formatUpdated,
  inCollection,
  matchesSearch,
  sortComponents,
  type CollectionIcon,
  type CollectionId,
  type MarketComponent,
  type SortId,
} from './marketplaceData';
import s from './marketplace.module.css';

const COLLECTION_ICONS: Record<CollectionIcon, (props: IconProps) => ReactNode> = {
  all: SquareIcon,
  team: TeamIcon,
  mine: ComponentMarkIcon,
  saved: HeartIcon,
  youtube: PlayerMarkIcon,
  shorts: ShortsPlayerIcon,
  livingroom: TvIcon,
  web: BrowserIcon,
};

/*
 * Tile thumbnails sit on plain white — the black phone mock is the figure, and a
 * tint or a dot grid behind it only muddies that. A transparent dot colour keeps
 * AdPreview's grid in place while drawing nothing.
 */
const PREVIEW_TINT = 'transparent';
const PREVIEW_BG = '#ffffff';

/**
 * Where components come from. Every surface team publishes its own shelf, and
 * your team's and your own components sit alongside them — the sidebar is the
 * only thing that separates a first-party component from one of yours.
 */
export function MarketplacePage() {
  const [collection, setCollection] = useState<CollectionId>('all');
  const [sort, setSort] = useState<SortId>('popular');
  const [query, setQuery] = useState('');
  const [saved, setSaved] = useState<Set<string>>(() => new Set(INITIAL_SAVED));

  const toggleSaved = (id: string) =>
    setSaved((current) => {
      const next = new Set(current);
      if (!next.delete(id)) next.add(id);
      return next;
    });

  const countIn = (id: CollectionId) =>
    MARKET_COMPONENTS.filter((component) => inCollection(component, id, saved)).length;

  const results = sortComponents(
    MARKET_COMPONENTS.filter(
      (component) => inCollection(component, collection, saved) && matchesSearch(component, query),
    ),
    sort,
  );

  const activeName = COLLECTION_GROUPS.flatMap((group) => group.collections).find(
    (entry) => entry.id === collection,
  )?.name;

  return (
    <div className={s.page} data-accent="green">
      <SiteTopBar />

      <header className={s.hero}>
        <div className={s.heroInner}>
          <div>
            <h1 className={s.heroTitle}>Component marketplace</h1>
          </div>
          <a href={ROUTES.componentEditor} className={s.heroAction}>
            <Button size="md">
              <PlusIcon size={15} />
              New component
            </Button>
          </a>
        </div>
      </header>

      <div className={s.body}>
        <aside className={s.sidebar}>
          <label className={s.search}>
            <SearchIcon size={15} style={{ color: 'var(--text-muted)' }} />
            <input
              className={s.searchInput}
              placeholder="Search components"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>

          {COLLECTION_GROUPS.map((group) => (
            <nav key={group.label} className={s.group}>
              <span className={s.groupLabel}>{group.label}</span>
              {group.collections.map((entry) => {
                const Icon = COLLECTION_ICONS[entry.icon];
                const on = entry.id === collection;
                return (
                  <button
                    key={entry.id}
                    type="button"
                    className={cx(s.collection, on && s.collectionOn)}
                    onClick={() => setCollection(entry.id)}
                  >
                    <Icon size={15} style={{ color: on ? 'var(--accent-deep)' : 'var(--text-muted)' }} />
                    <span className={s.collectionName}>{entry.name}</span>
                    <span className={s.collectionCount}>{countIn(entry.id)}</span>
                  </button>
                );
              })}
            </nav>
          ))}
        </aside>

        <main className={s.results}>
          <div className={s.resultsHead}>
            <div>
              <h2 className={s.resultsTitle}>{activeName}</h2>
              <span className={s.resultsCount}>
                {results.length} {results.length === 1 ? 'component' : 'components'}
                {query.trim() && ` matching “${query.trim()}”`}
              </span>
            </div>
            <SegmentedControl options={SORTS.map(toSegment)} value={sort} onChange={setSort} />
          </div>

          {results.length === 0 ? (
            <div className={s.empty}>
              Nothing here yet. Try another collection, or{' '}
              <a href={ROUTES.componentEditor}>build the component yourself</a>.
            </div>
          ) : (
            <div className={s.grid}>
              {results.map((component) => (
                <ComponentTile
                  key={component.id}
                  component={component}
                  saved={saved.has(component.id)}
                  onToggleSaved={() => toggleSaved(component.id)}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

const toSegment = (sort: (typeof SORTS)[number]) => ({ id: sort.id, label: sort.label });

type ComponentTileProps = {
  component: MarketComponent;
  saved: boolean;
  onToggleSaved: () => void;
};

function ComponentTile({ component, saved, onToggleSaved }: ComponentTileProps) {
  return (
    <div className={s.tile}>
      <div className={s.tilePreview}>
        <AdPreview
          kind={component.kind}
          device={deviceForSurface(component.surface)}
          tint={PREVIEW_TINT}
          bg={PREVIEW_BG}
        />
      </div>
      <div className={s.tileBody}>
        <div className={s.tileTop}>
          {/* The name is the tile's only link; `.tileName::after` stretches it over
              the whole tile so anywhere but the save button opens the component. */}
          <a href={ROUTES.componentEditor} className={s.tileName}>
            {component.name}
          </a>
          {/* Saving is what fills the Saved shelf in the sidebar. */}
          <button
            type="button"
            className={cx(s.saveButton, saved && s.saveButtonOn)}
            title={saved ? 'Remove from saved' : 'Save for later'}
            aria-pressed={saved}
            onClick={onToggleSaved}
          >
            <HeartIcon size={16} filled={saved} />
          </button>
        </div>
        <p className={s.tileDesc}>{component.desc}</p>
        {/* Who published it and when, on one line — the sidebar already sorts by owner. */}
        <div className={s.tileFooter}>
          <span className={s.tilePublisher}>{component.publisher}</span>
          <span className={s.tileUpdated}>{formatUpdated(component.updatedDays)}</span>
        </div>
      </div>
    </div>
  );
}
