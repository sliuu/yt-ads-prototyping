import type { AdFormatKind } from '../../components/ad/AdPreview';
import type { MiniEditorKind } from './MiniEditorPreview';

/** Placeholder content — a real build would load these from the server. */

export type Template = {
  name: string;
  desc: string;
  kind: AdFormatKind;
};

export type Collaborator = {
  initials: string;
  color: string;
};

export type Project = {
  name: string;
  kind: AdFormatKind;
  /** Days since anyone last changed it; formatted by `formatAge`. */
  editedDays: number;
  /** Days since the signed-in user last opened it. Drives the default sort. */
  viewedDays: number;
  /** Drives the "My projects" filter; always the first face in the stack. */
  owner: Collaborator;
  collaborators: Collaborator[];
  /** Rendered as a "+N" chip closing the avatar stack. */
  more?: string;
};

export type ProjectSortId = 'viewed' | 'edited' | 'alpha';

export const PROJECT_SORTS: { id: ProjectSortId; label: string }[] = [
  { id: 'viewed', label: 'Last viewed by me' },
  { id: 'edited', label: 'Last edited' },
  { id: 'alpha', label: 'Alphabetically' },
];

export type CustomComponent = {
  name: string;
  desc: string;
  kind: MiniEditorKind;
};

const STEPHANIE: Collaborator = { initials: 'S', color: '#0d9488' };
const MAYA: Collaborator = { initials: 'MR', color: '#7c3aed' };
const ALEX: Collaborator = { initials: 'AK', color: '#e5675a' };
const JUNE: Collaborator = { initials: 'JL', color: '#db2777' };

/** The signed-in user. Projects they own are what "My projects" keeps. */
export const ME = STEPHANIE;

/**
 * The empty account behind `#/newuser`. They own nothing in `PROJECTS`, so the
 * ownership filter needs no special case: "My projects" comes back empty on its
 * own, while "All projects" still lists everyone else's.
 */
export const NEW_USER: Collaborator = { initials: 'N', color: '#6366f1' };

export const TEMPLATES: Template[] = [
  { name: 'YouTube Shorts', desc: 'Vertical player + ad overlay', kind: 'shorts' },
  { name: 'In-feed video', desc: 'Autoplay ad in a scrolling feed', kind: 'infeed' },
  { name: 'Interstitial ad', desc: 'Full-screen ad with countdown', kind: 'interstitial' },
];

export const PROJECTS: Project[] = [
  {
    name: 'Rewarded video Q3',
    kind: 'rewarded',
    editedDays: 0,
    viewedDays: 0,
    owner: STEPHANIE,
    collaborators: [STEPHANIE, MAYA],
    more: '+2',
  },
  {
    name: 'Pre-roll skip study',
    kind: 'preroll',
    editedDays: 1,
    viewedDays: 4,
    owner: STEPHANIE,
    collaborators: [STEPHANIE, ALEX],
    more: '+3',
  },
  {
    name: 'Interstitial countdown test',
    kind: 'interstitial',
    editedDays: 2,
    viewedDays: 7,
    owner: STEPHANIE,
    collaborators: [STEPHANIE, JUNE],
  },
  {
    name: 'Masthead takeover',
    kind: 'masthead',
    editedDays: 3,
    viewedDays: 1,
    owner: STEPHANIE,
    collaborators: [STEPHANIE],
  },
  {
    name: 'Banner dismissal test',
    kind: 'banner',
    editedDays: 10,
    viewedDays: 2,
    owner: MAYA,
    collaborators: [MAYA, JUNE],
  },
  {
    name: 'Masthead motion pass',
    kind: 'masthead',
    editedDays: 13,
    viewedDays: 16,
    owner: JUNE,
    collaborators: [JUNE, MAYA],
    more: '+1',
  },
  {
    name: 'Carousel ad reel',
    kind: 'carousel',
    editedDays: 17,
    viewedDays: 12,
    owner: STEPHANIE,
    collaborators: [STEPHANIE, ALEX],
  },
  {
    name: 'Story ad frequency',
    kind: 'story',
    editedDays: 20,
    viewedDays: 6,
    owner: MAYA,
    collaborators: [MAYA, STEPHANIE],
  },
  {
    name: 'Shorts overlay refresh',
    kind: 'shorts',
    editedDays: 24,
    viewedDays: 9,
    owner: STEPHANIE,
    collaborators: [STEPHANIE, MAYA],
  },
  {
    name: 'In-feed autoplay study',
    kind: 'infeed',
    editedDays: 29,
    viewedDays: 3,
    owner: STEPHANIE,
    collaborators: [STEPHANIE, ALEX],
    more: '+1',
  },
  {
    name: 'Carousel swipe depth',
    kind: 'carousel',
    editedDays: 35,
    viewedDays: 18,
    owner: MAYA,
    collaborators: [MAYA, ALEX],
    more: '+2',
  },
  {
    name: 'Companion banner sweep',
    kind: 'banner',
    editedDays: 41,
    viewedDays: 30,
    owner: ALEX,
    collaborators: [ALEX, JUNE],
  },
  {
    name: 'Pre-roll length A/B',
    kind: 'preroll',
    editedDays: 48,
    viewedDays: 21,
    owner: STEPHANIE,
    collaborators: [STEPHANIE, JUNE],
  },
  {
    name: 'Story ad recall',
    kind: 'story',
    editedDays: 53,
    viewedDays: 44,
    owner: MAYA,
    collaborators: [MAYA, ALEX],
    more: '+2',
  },
  {
    name: 'Rewarded opt-in flow',
    kind: 'rewarded',
    editedDays: 60,
    viewedDays: 27,
    owner: ALEX,
    collaborators: [ALEX, STEPHANIE],
  },
];

/** Relative age for a project's meta line. Same shape as the marketplace's `formatUpdated`. */
export function formatAge(days: number): string {
  if (days === 0) return 'today';
  if (days === 1) return 'yesterday';
  if (days < 14) return `${days} days ago`;
  if (days < 60) return `${Math.round(days / 7)} weeks ago`;
  return `${Math.round(days / 30)} months ago`;
}

/**
 * Sorted and labelled together, so the card's meta line always names the value the
 * list is ordered by — a list sorted by one date showing another reads as broken.
 */
export function sortProjects(projects: Project[], sort: ProjectSortId): Project[] {
  return [...projects].sort((a, b) => {
    if (sort === 'alpha') return a.name.localeCompare(b.name);
    if (sort === 'edited') return a.editedDays - b.editedDays;
    return a.viewedDays - b.viewedDays;
  });
}

export function projectAge(project: Project, sort: ProjectSortId): string {
  return sort === 'edited'
    ? `Edited ${formatAge(project.editedDays)}`
    : `Viewed ${formatAge(project.viewedDays)}`;
}

export const CUSTOM_COMPONENTS: CustomComponent[] = [
  { name: 'YouTube Shorts page', desc: 'Vertical player, rail & ad slot', kind: 'shorts' },
  { name: 'Ad reel', desc: 'Swipeable carousel of ad cards', kind: 'reel' },
  { name: 'Rewarded interstitial', desc: 'Full-screen unit with reward CTA', kind: 'interstitial' },
];

/*
 * Card thumbnails sit on plain white — the black phone mock is the figure, and a
 * tint or a dot grid behind it only muddies that. A transparent dot colour keeps
 * AdPreview's grid in place while drawing nothing.
 */
export const CARD_PREVIEW_TINT = 'transparent';
export const CARD_PREVIEW_BG = '#ffffff';
