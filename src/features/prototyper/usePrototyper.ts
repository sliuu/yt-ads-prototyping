import { useCallback, useEffect, useRef, useState } from 'react';
import { useRenames } from '../editor/useRenames';
import {
  DEFAULT_VALUES,
  LAYERS,
  VARIABLES,
  VARIANTS,
  isValidValue,
  slugify,
  type AddedAction,
  type ActionTriggerId,
  type ActionTypeId,
  type CodeFile,
  type DataSource,
  type DataTab,
  type ElementId,
  type Layer,
  type PanelTab,
  type TextAlign,
  type TextPart,
  type Theme,
  type ThemeProperty,
  type Variable,
  type Variant,
  type VariantId,
} from './prototyperData';

/** Only one of these can be up at a time, so they're one value rather than five booleans. */
export type Overlay =
  | 'projectMenu'
  | 'viewMenu'
  | 'library'
  | 'componentMarketplace'
  | 'gallery'
  | 'source'
  | 'addSource'
  | 'action'
  | null;

/** The editor, the participant preview, and the results readout are one app in three modes. */
export type Mode = 'editor' | 'view' | 'results';

export type StreamOption = 'instrumentation' | 'loop' | 'muted' | 'reset' | 'unskippable';

/** How the prototype goes out to participants, set from the View menu. */
export type ShareOption = 'instrumentation' | 'external';

const SKIP_AFTER_RANGE = { min: 1, max: 9 };
const SOURCE_COUNT_RANGE = { min: 1, max: 50 };
const DEFAULT_PROJECT_NAME = 'Prototyping Research Prototype';
const EXAMPLE_CODE_FILE: CodeFile = {
  id: 'code-file-1',
  name: 'fade-in-ad.js',
  content: `// Fade an ad into view when a trigger is clicked.
export function run({ trigger, ad }) {
  trigger.addEventListener('click', () => {
    ad.animate(
      [{ opacity: 0 }, { opacity: 1 }],
      { duration: 1200, easing: 'ease-out', fill: 'forwards' },
    );
  });
}
`,
};
const DEFAULT_THEME: Theme = {
  id: 'theme-1',
  name: 'Theme 1',
  properties: [
    { id: 'theme-prop-1', name: 'background-color', value: '#111418' },
    { id: 'theme-prop-2', name: 'opacity', value: '0.92' },
  ],
};
const DEFAULT_SOURCE: DataSource = {
  id: 'source-1',
  name: 'Kitten videos',
  type: 'search',
  query: 'cute kittens #shorts',
  count: 12,
  safe: true,
};

export type PrototyperStore = ReturnType<typeof usePrototyper>;

/** Lets a route open the editor in a particular state instead of the default one. */
export type PrototyperInit = {
  /** `#/prototyper/templates` opens with the template gallery already up. */
  overlay?: Overlay;
  /** Which layer the editor opens with selected; defaults to the Shorts player. */
  selected?: ElementId;
  /** Starts with only Home and Screen 1, with no elements placed on the canvas. */
  blank?: boolean;
};

/**
 * All prototype-editor state. The session values are deliberately thin: a single
 * `watched` counter ticks while the participant view is open, and the countdown
 * and skip availability are derived from it.
 */
export function usePrototyper({
  overlay: initialOverlay = null,
  selected: requestedSelected,
  blank = false,
}: PrototyperInit = {}) {
  const initialSelected = requestedSelected ?? (blank ? 'screen1' : 'shorts');
  const [projectName, setProjectName] = useState(
    blank ? 'Untitled Project' : DEFAULT_PROJECT_NAME,
  );
  const [selected, setSelected] = useState<ElementId>(initialSelected);
  const [layers, setLayers] = useState<Layer[]>(() =>
    blank ? [LAYERS[0]] : [...LAYERS],
  );
  const [panelTab, setPanelTab] = useState<PanelTab>('properties');
  const [dataTab, setDataTab] = useState<DataTab>('data');
  const [themes, setThemes] = useState<Theme[]>(() =>
    blank ? [] : [{ ...DEFAULT_THEME }],
  );
  const nextTheme = useRef(2);
  const [selectedThemeId, setSelectedThemeId] = useState<string | null>(null);
  const nextThemeProperty = useRef(3);
  const [codeFiles, setCodeFiles] = useState<CodeFile[]>(() =>
    blank ? [] : [{ ...EXAMPLE_CODE_FILE }],
  );
  const [activeCodeFileId, setActiveCodeFileId] = useState<string | null>(null);
  const nextCodeFile = useRef(2);
  const [variant, setVariant] = useState<VariantId>('home');
  const [variants, setVariants] = useState<Variant[]>(() =>
    blank ? [VARIANTS[0]] : [...VARIANTS],
  );
  const nextVariant = useRef(VARIANTS.length + 1);
  /* The banner's header and subtitle align independently. */
  const [textAlign, setTextAlign] = useState<Record<TextPart, TextAlign>>({
    heading: 'left',
    subtitle: 'left',
  });
  const [skipAfter, setSkipAfter] = useState(5);
  const [opts, setOpts] = useState<Record<StreamOption, boolean>>({
    instrumentation: true,
    loop: true,
    muted: false,
    reset: false,
    unskippable: false,
  });
  const [share, setShare] = useState<Record<ShareOption, boolean>>({
    instrumentation: true,
    external: true,
  });
  const [sources, setSources] = useState<DataSource[]>(() =>
    blank ? [] : [{ ...DEFAULT_SOURCE }],
  );
  const [attachedSourceIds, setAttachedSourceIds] = useState<string[]>(
    blank ? [] : [DEFAULT_SOURCE.id],
  );
  const [editingSourceId, setEditingSourceId] = useState<string | null>(null);
  /* Set by whichever + opened the new-source dialog — see `newSource`. */
  const [linkNewSource, setLinkNewSource] = useState(false);
  const nextSource = useRef(2);
  const [action, setAction] = useState<{
    trigger: ActionTriggerId;
    type: ActionTypeId;
    scriptId: string;
  }>({
    trigger: 'click',
    type: 'goto',
    scriptId: EXAMPLE_CODE_FILE.id,
  });
  const [actions, setActions] = useState<AddedAction[]>(() =>
    blank ? [] : [{ id: 'action-1', trigger: 'click', type: 'goto' }],
  );
  const nextAction = useRef(2);
  const { nameOf, rename, clearRenames } = useRenames();
  const [variables, setVariables] = useState<Variable[]>(VARIABLES);
  const nextVariable = useRef(VARIABLES.length + 1);
  const [overlay, setOverlay] = useState<Overlay>(initialOverlay);
  const [mode, setMode] = useState<Mode>('editor');
  const [watched, setWatched] = useState(0);
  const [outcome, setOutcome] = useState<'skipped' | 'completed' | null>(null);

  /* The session clock only runs while the participant view is on screen. */
  useEffect(() => {
    if (mode !== 'view') return;
    const timer = setInterval(() => setWatched((seconds) => seconds + 1), 1000);
    return () => clearInterval(timer);
  }, [mode]);

  /** Selecting anything always brings its Properties tab forward. */
  const select = useCallback((id: ElementId) => {
    setSelected(id);
    setPanelTab('properties');
  }, []);

  const toggleOption = (key: StreamOption) =>
    setOpts((current) => ({ ...current, [key]: !current[key] }));

  const openOverlay = (next: Exclude<Overlay, null>) => setOverlay(next);
  const closeOverlay = useCallback(() => setOverlay(null), []);
  const toggleOverlay = (next: Exclude<Overlay, null>) =>
    setOverlay((current) => (current === next ? null : next));

  const enterView = () => {
    setOverlay(null);
    setWatched(0);
    setOutcome(null);
    setMode('view');
  };
  const exitView = () => setMode('editor');
  const skipNow = () => {
    setOutcome('skipped');
    setMode('results');
  };
  const backToEditor = () => setMode('editor');

  /** Returns the new variable's id so the panel can focus the row it just created. */
  const addVariable = () => {
    const n = nextVariable.current++;
    const id = `var-${n}`;
    setVariables((current) => [
      ...current,
      { id, name: `variable_${n}`, type: 'string', value: DEFAULT_VALUES.string },
    ]);
    return id;
  };

  /** Adds and selects a local variant without leaving the current project. */
  const addVariant = (name: string) => {
    const n = nextVariant.current++;
    const next = { id: `variant-${n}`, name };
    setVariants((current) => [...current, next]);
    setVariant(next.id);
  };

  const addLayer = (id: ElementId) => {
    const layer = LAYERS.find((item) => item.id === id);
    if (!layer) return;
    const isNewLayer = !layers.some((item) => item.id === id);

    /* A newly added player starts unconfigured; project sources stay reusable
       until the user explicitly links one from the player's inspector. */
    if (id === 'shorts' && isNewLayer) setAttachedSourceIds([]);

    /* Rebuilt from LAYERS rather than appended, so the tree keeps its canonical
       order however the elements were added — a banner added before a player
       still nests under it. */
    setLayers((current) =>
      current.some((item) => item.id === id)
        ? current
        : LAYERS.filter((item) => item.id === id || current.some((c) => c.id === item.id)),
    );
    select(id);
  };

  const startBlankProject = () => {
    setProjectName('Untitled Project');
    setLayers([LAYERS[0]]);
    setVariants([VARIANTS[0]]);
    setVariant('home');
    setSelected('screen1');
    setPanelTab('properties');
    setVariables([]);
    setSources([]);
    setAttachedSourceIds([]);
    setActions([]);
    setThemes([]);
    setSelectedThemeId(null);
    setCodeFiles([]);
    setActiveCodeFileId(null);
    clearRenames();
    setOverlay(null);
  };

  const startTemplateProject = () => {
    setProjectName(DEFAULT_PROJECT_NAME);
    setLayers([...LAYERS]);
    setVariants([...VARIANTS]);
    setVariant('home');
    setSelected('shorts');
    setPanelTab('properties');
    setSources([{ ...DEFAULT_SOURCE }]);
    setAttachedSourceIds([DEFAULT_SOURCE.id]);
    setThemes([{ ...DEFAULT_THEME }]);
    setSelectedThemeId(null);
    setActions([{ id: 'action-1', trigger: 'click', type: 'goto' }]);
    setCodeFiles([{ ...EXAMPLE_CODE_FILE }]);
    setActiveCodeFileId(null);
    clearRenames();
    setOverlay(null);
  };

  const updateVariable = (id: string, patch: Partial<Omit<Variable, 'id'>>) =>
    setVariables((current) =>
      current.map((variable) => {
        if (variable.id !== id) return variable;
        const next = { ...variable, ...patch };
        /* A default that no longer fits the new type falls back to that type's own. */
        if (patch.type && !isValidValue(next.value, next.type)) {
          next.value = DEFAULT_VALUES[next.type];
        }
        return next;
      }),
    );

  const removeVariable = (id: string) =>
    setVariables((current) => current.filter((variable) => variable.id !== id));

  const addTheme = () => {
    const n = nextTheme.current++;
    setThemes((current) => [
      ...current,
      { id: `theme-${n}`, name: `Theme ${n}`, properties: [] },
    ]);
  };

  const removeTheme = (id: string) => {
    setThemes((current) => current.filter((theme) => theme.id !== id));
    setSelectedThemeId((current) => (current === id ? null : current));
  };

  const updateThemeName = (id: string, name: string) =>
    setThemes((current) =>
      current.map((theme) => (theme.id === id ? { ...theme, name } : theme)),
    );

  const addThemeProperty = (themeId: string) => {
    const n = nextThemeProperty.current++;
    setThemes((current) =>
      current.map((theme) =>
        theme.id === themeId
          ? {
              ...theme,
              properties: [
                ...theme.properties,
                { id: `theme-prop-${n}`, name: 'property', value: 'value' },
              ],
            }
          : theme,
      ),
    );
  };

  const updateThemeProperty = (
    themeId: string,
    propertyId: string,
    patch: Partial<Omit<ThemeProperty, 'id'>>,
  ) =>
    setThemes((current) =>
      current.map((theme) =>
        theme.id === themeId
          ? {
              ...theme,
              properties: theme.properties.map((property) =>
                property.id === propertyId ? { ...property, ...patch } : property,
              ),
            }
          : theme,
      ),
    );

  const removeThemeProperty = (themeId: string, propertyId: string) =>
    setThemes((current) =>
      current.map((theme) =>
        theme.id === themeId
          ? {
              ...theme,
              properties: theme.properties.filter((property) => property.id !== propertyId),
            }
          : theme,
      ),
    );

  const createCodeFile = () => {
    const n = nextCodeFile.current++;
    const file = {
      id: `code-file-${n}`,
      name: n === 1 ? 'script.js' : `script-${n}.js`,
      content:
        '// Reusable behavior for prototype actions.\n\nexport function run(context) {\n  // Add custom behavior here.\n}\n',
    };
    setCodeFiles((current) => [...current, file]);
    setActiveCodeFileId(file.id);
  };

  const addCodeFiles = (files: Array<Pick<CodeFile, 'name' | 'content'>>) => {
    const added = files.map((file) => ({
      ...file,
      id: `code-file-${nextCodeFile.current++}`,
    }));
    if (!added.length) return;
    setCodeFiles((current) => [...current, ...added]);
    setActiveCodeFileId(added[0].id);
  };

  const updateCodeFile = (id: string, content: string) =>
    setCodeFiles((current) =>
      current.map((file) => (file.id === id ? { ...file, content } : file)),
    );

  const renameCodeFile = (id: string, name: string) =>
    setCodeFiles((current) =>
      current.map((file) => (file.id === id ? { ...file, name } : file)),
    );

  const removeCodeFile = (id: string) => {
    setCodeFiles((current) => current.filter((file) => file.id !== id));
    setActiveCodeFileId((current) => (current === id ? null : current));
  };

  const clampedSkipAfter = (next: number) =>
    setSkipAfter(Math.min(SKIP_AFTER_RANGE.max, Math.max(SKIP_AFTER_RANGE.min, next)));

  const selectedLayer = layers.find((layer) => layer.id === selected);
  const variantName = variants.find((item) => item.id === variant)?.name ?? 'Home';
  const attachedSources = attachedSourceIds.flatMap((id) => {
    const attached = sources.find((item) => item.id === id);
    return attached ? [attached] : [];
  });
  const source = attachedSources[0] ?? null;
  const editingSource = sources.find((item) => item.id === editingSourceId) ?? null;

  return {
    /* Editor state */
    projectName,
    setProjectName,
    selected,
    selectedName: nameOf(selected, selectedLayer?.name ?? 'Screen 1'),
    select,
    layers,
    hasLayer: (id: ElementId) => layers.some((layer) => layer.id === id),
    addLayer,
    startBlankProject,
    startTemplateProject,

    /* Renaming layers and variants (double-click a row) */
    nameOf,
    rename,
    panelTab,
    setPanelTab,
    dataTab,
    setDataTab,
    themes,
    selectedThemeId,
    setSelectedThemeId,
    addTheme,
    removeTheme,
    updateThemeName,
    addThemeProperty,
    updateThemeProperty,
    removeThemeProperty,
    codeFiles,
    activeCodeFile: codeFiles.find((file) => file.id === activeCodeFileId) ?? null,
    openCodeFile: setActiveCodeFileId,
    closeCodeFile: () => setActiveCodeFileId(null),
    createCodeFile,
    addCodeFiles,
    updateCodeFile,
    renameCodeFile,
    removeCodeFile,
    variants,
    variant,
    variantName: nameOf(variant, variantName),
    setVariant,
    addVariant,
    textAlign,
    setTextAlign: (part: TextPart, align: TextAlign) =>
      setTextAlign((current) => ({ ...current, [part]: align })),

    /* Stream options */
    opts,
    toggleOption,
    skipAfter,
    setSkipAfter: clampedSkipAfter,
    skipAfterRange: SKIP_AFTER_RANGE,
    /** The timer chip is part of screen 1's creative, so it hides on other screens. */
    showTimer: opts.unskippable && selected !== 'screen2' && selected !== 'screen3',

    /* Variables */
    variables,
    addVariable,
    updateVariable,
    removeVariable,

    /* Source */
    source,
    attachedSources,
    hasAttachedSource: attachedSources.length > 0,
    sources,
    hasSource: sources.length > 0,
    /** Project sources this object could still be linked to. */
    unattachedSources: sources.filter((item) => !attachedSourceIds.includes(item.id)),
    editingSource,
    sourceCountRange: SOURCE_COUNT_RANGE,
    editSource: (id: string) => {
      setEditingSourceId(id);
      setOverlay('source');
    },
    /**
     * Opens the new-source dialog. A source added from the data panel belongs to
     * the project and nothing else; only the one created from an object's own
     * inspector links itself to that object.
     */
    newSource: ({ link = false }: { link?: boolean } = {}) => {
      setLinkNewSource(link);
      setOverlay('addSource');
    },
    addSource: (input: Omit<DataSource, 'id'>) => {
      const next = { ...input, id: `source-${nextSource.current++}` };
      setSources((current) => [...current, next]);
      if (linkNewSource) setAttachedSourceIds((current) => [...current, next.id]);
      setOverlay(null);
    },
    /** Links a source the project already has, rather than creating another one. */
    attachSource: (id: string) =>
      setAttachedSourceIds((current) =>
        current.includes(id) ? current : [...current, id],
      ),
    detachSource: (id: string) =>
      setAttachedSourceIds((current) => current.filter((sourceId) => sourceId !== id)),
    deleteSource: (id: string) => {
      setSources((current) => current.filter((item) => item.id !== id));
      setAttachedSourceIds((current) => current.filter((sourceId) => sourceId !== id));
      setEditingSourceId(null);
      setOverlay(null);
    },
    setSourceCount: (count: number) =>
      setSources((current) =>
        current.map((item) => (item.id === editingSourceId ? { ...item, count } : item)),
      ),
    toggleSafeSearch: () =>
      setSources((current) =>
        current.map((item) =>
          item.id === editingSourceId ? { ...item, safe: !item.safe } : item,
        ),
      ),

    /* Actions */
    action,
    actions,
    hasActions: actions.length > 0,
    addAction: () => {
      const id = `action-${nextAction.current++}`;
      setActions((current) => [
        ...current,
        {
          id,
          trigger: action.trigger,
          type: action.type,
          scriptId: action.type === 'script' ? action.scriptId : undefined,
        },
      ]);
    },
    removeAction: (id: string) =>
      setActions((current) => current.filter((item) => item.id !== id)),
    setActionTrigger: (trigger: ActionTriggerId) =>
      setAction((current) => ({ ...current, trigger })),
    setActionType: (type: ActionTypeId) =>
      setAction((current) => ({
        ...current,
        type,
        scriptId:
          type === 'script' && !codeFiles.some((file) => file.id === current.scriptId)
            ? (codeFiles[0]?.id ?? '')
            : current.scriptId,
      })),
    setActionScript: (scriptId: string) =>
      setAction((current) => ({ ...current, scriptId })),

    /* Sharing (View menu) */
    share,
    toggleShare: (key: ShareOption) =>
      setShare((current) => ({ ...current, [key]: !current[key] })),
    /** Where a participant would pick the study up — one link per variant. */
    shareUrl: `ytstudies.app/s/${slugify(nameOf(variant, variantName))}-8f2c`,

    /* Overlays */
    overlay,
    openOverlay,
    closeOverlay,
    toggleOverlay,

    /* Session */
    mode,
    enterView,
    exitView,
    skipNow,
    backToEditor,
    watched,
    outcome,
    countdown: Math.max(0, skipAfter - watched),
    canSkip: !opts.unskippable || watched >= skipAfter,
  };
}
