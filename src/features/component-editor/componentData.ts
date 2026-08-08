import type { TabOption } from '../../ui/Tabs';

export type LayerId = 'player' | 'rail' | 'adslot' | 'timer';

export type ComponentLayer = {
  id: LayerId;
  name: string;
  /** Layers with an exposed option carry the "prop" badge. */
  exposed?: boolean;
};

export const LAYERS: ComponentLayer[] = [
  { id: 'player', name: 'Video player' },
  { id: 'rail', name: 'Right rail' },
  { id: 'adslot', name: 'Ad slot' },
  { id: 'timer', name: 'Countdown timer', exposed: true },
];

/** The component's public API, as the prototype editor will see it. */
export const EXPOSED_PROPS = [
  { type: 'bool', name: 'unskippable' },
  { type: 'int', name: 'skipAfterSeconds' },
  { type: 'src', name: 'streamSource' },
  { type: 'bool', name: 'muted' },
];

export type PanelTab = 'properties' | 'behavior' | 'style';

export const PANEL_TABS: ReadonlyArray<TabOption<PanelTab>> = [
  { id: 'properties', label: 'Properties' },
  { id: 'behavior', label: 'Behavior' },
  { id: 'style', label: 'Style' },
];
