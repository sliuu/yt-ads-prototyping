import type { SegmentOption } from '../../ui/SegmentedControl';
import type { TabOption } from '../../ui/Tabs';

/** Placeholder content — a real build would load these from the server. */

/* ---------- Layers ---------- */

export type ElementId = 'screen1' | 'shorts' | 'banner' | 'screen2' | 'screen3';

/** Which glyph a layer row draws; resolved to a component in `LeftPanel`. */
export type LayerIcon = 'screen' | 'shorts' | 'banner';

export type Layer = {
  id: ElementId;
  name: string;
  icon: LayerIcon;
  /** Tree depth — elements sit under their screen, text under its banner. */
  indent: number;
};

/* The banner's header and subtitle aren't layers of their own: they ship as part
   of the banner, and are styled from its Style tab. */
export const LAYERS: Layer[] = [
  { id: 'screen1', name: 'Screen 1', icon: 'screen', indent: 0 },
  { id: 'shorts', name: 'YouTube Shorts player', icon: 'shorts', indent: 1 },
  { id: 'banner', name: 'Ad banner', icon: 'banner', indent: 1 },
  { id: 'screen2', name: 'Screen 2', icon: 'screen', indent: 0 },
  { id: 'screen3', name: 'Screen 3', icon: 'screen', indent: 0 },
];

/* ---------- Variants ---------- */

export type VariantId = string;

export type Variant = { id: VariantId; name: string };

export const VARIANTS: ReadonlyArray<Variant> = [
  { id: 'home', name: 'Home' },
  { id: 'a', name: 'Experiment A' },
  { id: 'b', name: 'Experiment B' },
];

/* ---------- Panel tabs ---------- */

export type PanelTab = 'properties' | 'actions' | 'style';

export const PANEL_TABS: ReadonlyArray<TabOption<PanelTab>> = [
  { id: 'properties', label: 'Properties' },
  { id: 'actions', label: 'Actions' },
  { id: 'style', label: 'Style' },
];

export type DataTab = 'data' | 'themes' | 'code';

export type ThemeProperty = {
  id: string;
  name: string;
  value: string;
};

export type Theme = {
  id: string;
  name: string;
  properties: ThemeProperty[];
};

export type CodeFile = {
  id: string;
  name: string;
  content: string;
};

export type DataSource = {
  id: string;
  name: string;
  type: 'search' | 'playlist' | 'channel';
  query: string;
  count: number;
  safe: boolean;
};

export const DATA_TABS: ReadonlyArray<SegmentOption<DataTab>> = [
  { id: 'data', label: 'Data' },
  { id: 'code', label: 'Code' },
  { id: 'themes', label: 'Themes' },
];

export type TextAlign = 'left' | 'center' | 'right' | 'justify';

/* ---------- Ad creative on the canvas ---------- */

export const AD_COPY = {
  heading: 'Candy Crush',
  subtitle: 'Match & win — install free',
};

/** The two runs of text inside the ad banner, each styled on its own. */
export type TextPart = 'heading' | 'subtitle';

export const TEXT_PARTS: ReadonlyArray<{
  id: TextPart;
  label: string;
  font: string;
  weight: string;
  size: number;
  lineHeight: string;
  color: string;
}> = [
  {
    id: 'heading',
    label: 'Header',
    font: 'Google Sans',
    weight: 'Bold',
    size: 15,
    lineHeight: '1.4',
    color: '#FFFFFF',
  },
  {
    id: 'subtitle',
    label: 'Subtitle',
    font: 'Google Sans',
    weight: 'Regular',
    size: 12,
    lineHeight: '1.4',
    color: '#FFFFFF',
  },
];

/** Source names read as clip ids on the canvas: "Kitten videos" → "kitten-videos". */
export const slugify = (value: string) => value.toLowerCase().replace(/\s+/g, '-');

/* ---------- Variables ---------- */

export type VariableType = 'string' | 'number' | 'boolean' | 'color';

export const VARIABLE_TYPES: ReadonlyArray<{ id: VariableType; label: string }> = [
  { id: 'string', label: 'String' },
  { id: 'number', label: 'Number' },
  { id: 'boolean', label: 'Boolean' },
  { id: 'color', label: 'Color' },
];

/** Defaults are stored as text whatever the type; the type decides how they're edited. */
export type Variable = {
  id: string;
  name: string;
  type: VariableType;
  value: string;
};

export const VARIABLES: Variable[] = [
  { id: 'var-1', name: 'username', type: 'string', value: 'test' },
  { id: 'var-2', name: 'ad_name', type: 'string', value: AD_COPY.heading },
];

export const DEFAULT_VALUES: Record<VariableType, string> = {
  string: '',
  number: '0',
  boolean: 'false',
  color: '#0d9488',
};

/** Used when the type changes, to tell a default worth keeping from one that isn't. */
export function isValidValue(value: string, type: VariableType): boolean {
  switch (type) {
    case 'number':
      return value.trim() !== '' && !Number.isNaN(Number(value));
    case 'boolean':
      return value === 'true' || value === 'false';
    case 'color':
      return /^#[0-9a-f]{6}$/i.test(value);
    case 'string':
      return true;
  }
}

/* ---------- Element library ---------- */

export const BASIC_ELEMENTS: ReadonlyArray<{ name: string; glyph: string }> = [
  { name: 'Screen', glyph: '▢' },
  { name: 'Text', glyph: 'T' },
  { name: 'Button', glyph: '▭' },
  { name: 'Image', glyph: '▤' },
  { name: 'Box', glyph: '□' },
];

/* ---------- Actions ---------- */

export type ActionTriggerId = 'click' | 'complete' | 'skip';

export const ACTION_TRIGGERS: ReadonlyArray<{ id: ActionTriggerId; label: string }> = [
  { id: 'click', label: 'On click' },
  { id: 'complete', label: 'On ad complete' },
  { id: 'skip', label: 'On skip' },
];

export type ActionTypeId = 'goto' | 'url' | 'log' | 'toggle' | 'script';

export type AddedAction = {
  id: string;
  trigger: ActionTriggerId;
  type: ActionTypeId;
  scriptId?: string;
};

export type ActionType = {
  id: ActionTypeId;
  glyph: string;
  name: string;
  desc: string;
  /** Actions without a target skip the third field in the picker. */
  target?: { label: string; value: string };
};

export const ACTION_TYPES: ReadonlyArray<ActionType> = [
  {
    id: 'goto',
    glyph: '→',
    name: 'Go to screen',
    desc: 'Navigate to another screen',
    target: { label: 'Destination screen', value: 'Screen 2' },
  },
  {
    id: 'url',
    glyph: '↗',
    name: 'Open URL',
    desc: 'Send the participant to a link',
    target: { label: 'Destination URL', value: 'https://…' },
  },
  { id: 'log', glyph: '◉', name: 'Log event', desc: 'Record a custom event in results' },
  {
    id: 'toggle',
    glyph: '◐',
    name: 'Show / hide element',
    desc: 'Reveal or dismiss another element',
    target: { label: 'Target element', value: 'Ad banner' },
  },
  {
    id: 'script',
    glyph: '</>',
    name: 'Run script',
    desc: 'Run JavaScript from the project code files',
  },
];

/* ---------- Start gallery ---------- */

export const GALLERY_TEMPLATES: ReadonlyArray<{
  name: string;
  desc: string;
  kind: 'shorts' | 'video' | 'livingroom';
  screen: string;
}> = [
  {
    name: 'YouTube Shorts',
    desc: 'A vertical Shorts screen with an ad placement ready to customize.',
    kind: 'shorts',
    screen: '#111418',
  },
  {
    name: 'YouTube Video',
    desc: 'A watch page with a video player and a templated in-stream ad.',
    kind: 'video',
    screen: '#e9edf1',
  },
  {
    name: 'YouTube Living Room',
    desc: 'A TV viewing screen with a remote-ready ad placement already included.',
    kind: 'livingroom',
    screen: '#131720',
  },
];

/* ---------- Results ---------- */

export const RESULT_ROWS: ReadonlyArray<{
  name: string;
  /** 0–1; drives both the bar width and the headline percentage. */
  completed: number;
  skipped: string;
}> = [
  { name: 'Home', completed: 0.86, skipped: '9%' },
  { name: 'Variant A', completed: 0.71, skipped: '38%' },
  { name: 'Variant B', completed: 0.62, skipped: '44%' },
];

export const RESULTS_SUMMARY =
  '142 sessions · last 7 days. The unskippable timer in Variant A/B lifts watch time but costs completion.';
