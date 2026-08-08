import type { AdFormatKind, PreviewDevice } from '../../components/ad/AdPreview';

/** Placeholder catalogue — a real build would load this from the component registry. */

/** Where a component was published from. Drives the sidebar's Browse collections. */
export type Owner = 'youtube' | 'team' | 'mine';

/** The YouTube surface a component targets, if it targets one in particular. */
export type Surface = 'shorts' | 'livingroom' | 'web';

export type MarketComponent = {
  id: string;
  name: string;
  desc: string;
  kind: AdFormatKind;
  owner: Owner;
  surface?: Surface;
  publisher: string;
  /** Times dropped into a prototype. Not shown on the tile — it drives the "Popular" sort. */
  uses: number;
  updatedDays: number;
};

export type CollectionId = 'all' | Owner | Surface | 'saved';

export type CollectionIcon = 'all' | 'team' | 'mine' | 'saved' | 'youtube' | Surface;

export type Collection = {
  id: CollectionId;
  name: string;
  icon: CollectionIcon;
};

/** Sidebar groups: your own shelves first, then the surface teams' shelves. */
export const COLLECTION_GROUPS: { label: string; collections: Collection[] }[] = [
  {
    label: 'Browse',
    collections: [
      { id: 'all', name: 'All components', icon: 'all' },
      { id: 'team', name: 'My team', icon: 'team' },
      { id: 'mine', name: 'My components', icon: 'mine' },
      { id: 'saved', name: 'Saved', icon: 'saved' },
    ],
  },
  {
    label: 'YouTube surfaces',
    collections: [
      { id: 'youtube', name: 'YouTube', icon: 'youtube' },
      { id: 'shorts', name: 'YouTube Shorts', icon: 'shorts' },
      { id: 'livingroom', name: 'YouTube Living Room', icon: 'livingroom' },
      { id: 'web', name: 'YouTube Web', icon: 'web' },
    ],
  },
];

export const MARKET_COMPONENTS: MarketComponent[] = [
  {
    id: 'shorts-page',
    name: 'YouTube Shorts page',
    desc: 'Vertical player, right rail and an ad slot wired to a stream source.',
    kind: 'shorts',
    owner: 'youtube',
    surface: 'shorts',
    publisher: 'Shorts Platform',
    uses: 4820,
    updatedDays: 2,
  },
  {
    id: 'shorts-banner',
    name: 'Ad banner',
    desc: 'Install banner pinned over the player, with a headline, subtitle and CTA.',
    kind: 'banner',
    owner: 'youtube',
    surface: 'shorts',
    publisher: 'Shorts Platform',
    uses: 3140,
    updatedDays: 9,
  },
  {
    id: 'shorts-reel',
    name: 'Ad reel',
    desc: 'Swipeable carousel of ad cards with page dots and a lead frame.',
    kind: 'carousel',
    owner: 'team',
    surface: 'shorts',
    publisher: 'Ads Research',
    uses: 612,
    updatedDays: 1,
  },
  {
    id: 'shorts-story',
    name: 'Story ad frame',
    desc: 'Full-screen story unit with segmented progress and a swipe-up CTA.',
    kind: 'story',
    owner: 'youtube',
    surface: 'shorts',
    publisher: 'Shorts Platform',
    uses: 1890,
    updatedDays: 21,
  },
  {
    id: 'lr-masthead',
    name: 'Living Room masthead',
    desc: 'Full-bleed TV masthead with a focus ring and remote-friendly CTA.',
    kind: 'masthead',
    owner: 'youtube',
    surface: 'livingroom',
    publisher: 'Living Room Ads',
    uses: 2260,
    updatedDays: 5,
  },
  {
    id: 'lr-preroll',
    name: 'TV pre-roll pod',
    desc: 'Two-slot pre-roll with a progress track and countdown to skip.',
    kind: 'preroll',
    owner: 'youtube',
    surface: 'livingroom',
    publisher: 'Living Room Ads',
    uses: 1745,
    updatedDays: 12,
  },
  {
    id: 'lr-rewarded',
    name: 'Rewarded interstitial',
    desc: 'Full-screen unit with a reward pill and a dismiss affordance.',
    kind: 'rewarded',
    owner: 'team',
    surface: 'livingroom',
    publisher: 'Ads Research',
    uses: 430,
    updatedDays: 7,
  },
  {
    id: 'web-infeed',
    name: 'In-feed video ad',
    desc: 'Autoplaying ad card in a scrolling feed, with an AD chip and headline.',
    kind: 'infeed',
    owner: 'youtube',
    surface: 'web',
    publisher: 'Web Platform',
    uses: 5310,
    updatedDays: 3,
  },
  {
    id: 'web-banner',
    name: 'Player banner overlay',
    desc: 'Dismissible overlay strip pinned to the bottom of the desktop player.',
    kind: 'banner',
    owner: 'youtube',
    surface: 'web',
    publisher: 'Web Platform',
    uses: 2980,
    updatedDays: 16,
  },
  {
    id: 'web-masthead',
    name: 'Homepage takeover',
    desc: 'Desktop masthead with a companion tile grid underneath.',
    kind: 'masthead',
    owner: 'youtube',
    surface: 'web',
    publisher: 'Web Platform',
    uses: 1120,
    updatedDays: 28,
  },
  {
    id: 'team-interstitial',
    name: 'Frequency test interstitial',
    desc: 'Interstitial instrumented for repeat-exposure studies.',
    kind: 'interstitial',
    owner: 'team',
    publisher: 'Ads Research',
    uses: 284,
    updatedDays: 4,
  },
  {
    id: 'mine-shorts',
    name: 'Shorts page (skip study)',
    desc: 'My fork of the Shorts page with the skip timer exposed as a prop.',
    kind: 'shorts',
    owner: 'mine',
    surface: 'shorts',
    publisher: 'Stephanie Liu',
    uses: 12,
    updatedDays: 0,
  },
  {
    id: 'mine-banner',
    name: 'Install banner (A/B)',
    desc: 'Two-line banner with alignment and copy exposed for variant tests.',
    kind: 'banner',
    owner: 'mine',
    publisher: 'Stephanie Liu',
    uses: 8,
    updatedDays: 6,
  },
];

/** Components the marketplace opens with in the Saved shelf. */
export const INITIAL_SAVED = ['shorts-page', 'lr-masthead'];

export type SortId = 'popular' | 'recent' | 'name';

export const SORTS: { id: SortId; label: string }[] = [
  { id: 'popular', label: 'Popular' },
  { id: 'recent', label: 'Recent' },
  { id: 'name', label: 'Name' },
];

/**
 * A component belongs to a collection by who published it, which surface it
 * targets, or whether it's been saved — the sidebar mixes all three.
 */
export function inCollection(
  component: MarketComponent,
  collection: CollectionId,
  saved: Set<string>,
): boolean {
  switch (collection) {
    case 'all':
      return true;
    case 'saved':
      return saved.has(component.id);
    case 'youtube':
    case 'team':
    case 'mine':
      return component.owner === collection;
    default:
      return component.surface === collection;
  }
}

/** How a surface is named in prose — the sidebar's own labels are longer. */
const SURFACE_LABELS: Record<Surface, string> = {
  shorts: 'YouTube Shorts',
  livingroom: 'Living room',
  web: 'Desktop',
};

export function surfaceLabel(surface?: Surface): string {
  return surface ? SURFACE_LABELS[surface] : 'Any surface';
}

/**
 * The screen a component's thumbnail is drawn on. Components with no surface of
 * their own (a generic interstitial, say) are prototyped on the phone.
 */
export function deviceForSurface(surface?: Surface): PreviewDevice {
  switch (surface) {
    case 'web':
      return 'desktop';
    case 'livingroom':
      return 'tv';
    default:
      return 'phone';
  }
}

export function matchesSearch(component: MarketComponent, query: string): boolean {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;
  return [component.name, component.desc, component.publisher].some((field) =>
    field.toLowerCase().includes(needle),
  );
}

export function sortComponents(components: MarketComponent[], sort: SortId): MarketComponent[] {
  const sorted = [...components];
  switch (sort) {
    case 'popular':
      return sorted.sort((a, b) => b.uses - a.uses);
    case 'recent':
      return sorted.sort((a, b) => a.updatedDays - b.updatedDays);
    case 'name':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
  }
}

export function formatUpdated(days: number): string {
  if (days === 0) return 'Updated today';
  if (days === 1) return 'Updated yesterday';
  if (days < 14) return `Updated ${days}d ago`;
  return `Updated ${Math.round(days / 7)}w ago`;
}
