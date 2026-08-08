import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { SourceThumb } from '../../components/ad/SourceThumb';
import { IconButton } from '../../ui/Button';
import { cx } from '../../ui/cx';
import { SegmentedControl } from '../../ui/SegmentedControl';
import { useDismiss } from '../../ui/useDismiss';
import {
  BannerIcon,
  CheckIcon,
  ChevronDownIcon,
  CloseIcon,
  DocumentationIcon,
  LaunchIcon,
  PlusIcon,
  ScreenIcon,
  ShortsPlayerIcon,
  VariantIcon,
  UploadIcon,
  type IconProps,
} from '../../ui/icons';
import { PanelHeading } from '../editor/EditorShell';
import { LayerRow } from '../editor/LayerRow';
import { ResizeHandle } from '../editor/ResizeHandle';
import {
  DATA_TABS,
  VARIABLE_TYPES,
  type LayerIcon,
  type Variable,
  type VariableType,
  type VariantId,
} from './prototyperData';
import type { PrototyperStore } from './usePrototyper';
import s from './prototyper.module.css';

/* The layer tree above it can shrink to nothing, but never past the panel. */
const DATA_RANGE = { min: 120, max: 620 };

const LAYER_ICONS: Record<LayerIcon, (props: IconProps) => ReactNode> = {
  screen: ScreenIcon,
  shorts: ShortsPlayerIcon,
  banner: BannerIcon,
};

/** Variants, the layer tree, and the data sources feeding them. */
export function LeftPanel({ store }: { store: PrototyperStore }) {
  /* The variable row to focus on mount — set when the + button creates one. */
  const [focusId, setFocusId] = useState<string | null>(null);
  /* null until dragged, so the section keeps the fixed height its CSS gives it. */
  const [dataHeight, setDataHeight] = useState<number | null>(null);
  const [variantNameMode, setVariantNameMode] = useState<'new' | 'rename' | null>(null);
  const dataRef = useRef<HTMLElement>(null);

  return (
    <>
      <section className={s.variantsSection}>
        <div className={s.sectionHead}>
          <PanelHeading
            title="Variants"
            action={{
              label: 'New variant',
              icon: <PlusIcon />,
              onClick: () => setVariantNameMode('new'),
            }}
          />
        </div>
        {/* Only ever one variant is being edited, so a chooser beats a list. */}
        <VariantPicker store={store} nameMode={variantNameMode} setNameMode={setVariantNameMode} />
      </section>

      <section className={s.layersSection}>
        <PanelHeading
          title="Layers"
          action={{
            label: 'Add element',
            icon: <PlusIcon />,
            onClick: () => store.openOverlay('library'),
          }}
        />
        <div className={s.layerList}>
          {store.layers.map((layer) => {
            const on = store.selected === layer.id;
            /* The Shorts player is a custom component, so its glyph carries the accent. */
            const accented = layer.icon === 'shorts';
            const color = accented
              ? on
                ? 'var(--accent-deep)'
                : 'var(--accent)'
              : 'var(--text-muted)';
            const Icon = LAYER_ICONS[layer.icon];
            return (
              <LayerRow
                key={layer.id}
                label={store.nameOf(layer.id, layer.name)}
                indent={layer.indent}
                selected={on}
                onClick={() => {
                  store.closeCodeFile();
                  store.select(layer.id);
                }}
                onRename={(name) => store.rename(layer.id, name)}
                icon={<Icon size={15} style={{ color }} />}
              />
            );
          })}
        </div>
      </section>

      <ResizeHandle
        axis="row"
        target={dataRef}
        min={DATA_RANGE.min}
        max={DATA_RANGE.max}
        invert
        label="Resize the data section"
        value={dataHeight}
        onResize={setDataHeight}
      />
      <section
        ref={dataRef}
        className={s.dataSection}
        style={dataHeight === null ? undefined : { height: dataHeight }}
      >
        <div className={s.dataTabs}>
          <SegmentedControl options={DATA_TABS} value={store.dataTab} onChange={store.setDataTab} />
        </div>
        {/* Only the content scrolls, so the tabs stay in view. */}
        <div className={s.dataBody}>
          {store.dataTab === 'data' && (
            <div className={s.dataRows}>
              <div className={s.rowHead}>
                <span className={s.rowHeadTitle}>Sources</span>
                <IconButton title="New source" onClick={() => store.newSource()}>
                  <PlusIcon size={15} strokeWidth={1.6} />
                </IconButton>
              </div>

              {store.hasSource ? (
                store.sources.map((source) => (
                  <button
                    key={source.id}
                    type="button"
                    className={s.sourceCard}
                    onClick={() => store.editSource(source.id)}
                  >
                    <SourceThumb size={38} radius={8} step={6} />
                    <span className={s.sourceInfo}>
                      <span className={s.sourceName}>{source.name}</span>
                      <span className={s.sourceMeta}>youtube · {source.count} results</span>
                    </span>
                    <LaunchIcon size={15} style={{ color: 'var(--icon-faint)' }} />
                  </button>
                ))
              ) : (
                <p className={s.variableEmpty}>No sources yet.</p>
              )}

              <div className={`${s.rowHead} ${s.rowHeadSpaced}`}>
                <span className={s.rowHeadTitle}>Variables</span>
                <IconButton title="New variable" onClick={() => setFocusId(store.addVariable())}>
                  <PlusIcon size={15} strokeWidth={1.6} />
                </IconButton>
              </div>
              {store.variables.length === 0 && (
                <p className={s.variableEmpty}>
                  No variables yet — add one to bind copy or counts.
                </p>
              )}
              {store.variables.map((variable) => (
                <VariableRow
                  key={variable.id}
                  store={store}
                  variable={variable}
                  autoFocus={variable.id === focusId}
                />
              ))}
            </div>
          )}
          {store.dataTab === 'themes' && <ThemeEditor store={store} />}
          {store.dataTab === 'code' && <CodeFilesPanel store={store} />}
        </div>
      </section>
    </>
  );
}

function CodeFilesPanel({ store }: { store: PrototyperStore }) {
  const uploadRef = useRef<HTMLInputElement>(null);

  const upload = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    store.addCodeFiles(
      await Promise.all(
        files.map(async (file) => ({
          name: file.name,
          content: await file.text(),
        })),
      ),
    );
    event.target.value = '';
  };

  return (
    <div className={s.codeFilesPanel}>
      <div className={s.codeFileActions}>
        <button
          type="button"
          className={s.codeFileAction}
          onClick={() => uploadRef.current?.click()}
        >
          <UploadIcon size={14} />
          Upload file
        </button>
        <button type="button" className={s.codeFileAction} onClick={store.createCodeFile}>
          <PlusIcon size={14} />
          New file
        </button>
        <input
          ref={uploadRef}
          type="file"
          accept=".js,.mjs,text/javascript"
          multiple
          hidden
          onChange={upload}
        />
      </div>

      <div className={s.codeFileList}>
        {store.codeFiles.length === 0 ? (
          <p className={s.variableEmpty}>No JavaScript files yet.</p>
        ) : (
          store.codeFiles.map((file) => (
            <div
              key={file.id}
              className={cx(
                s.codeFileRowWrap,
                store.activeCodeFile?.id === file.id && s.codeFileRowOn,
              )}
            >
              <button
                type="button"
                className={s.codeFileRow}
                onClick={() => store.openCodeFile(file.id)}
              >
                <DocumentationIcon size={14} />
                <span>{file.name}</span>
                <span className={s.codeFileType}>JS</span>
              </button>
              <IconButton title="Delete file" onClick={() => store.removeCodeFile(file.id)}>
                <CloseIcon size={12} />
              </IconButton>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/** Deliberately low-level CSS-like theme controls for power users. */
function ThemeEditor({ store }: { store: PrototyperStore }) {
  return (
    <div className={s.themeEditor}>
      {store.themes.length === 0 && (
        <p className={s.variableEmpty}>No themes yet — add one to reuse styles across elements.</p>
      )}
      {store.themes.map((theme) => (
        <div key={theme.id} className={s.themeRule}>
          <div className={s.themeNameRow}>
            <input
              className={s.themeNameInput}
              value={theme.name}
              aria-label="Theme name"
              onFocus={(event) => event.currentTarget.select()}
              onChange={(event) => store.updateThemeName(theme.id, event.target.value)}
            />
            <IconButton title="Delete theme" onClick={() => store.removeTheme(theme.id)}>
              <CloseIcon size={13} />
            </IconButton>
          </div>
          <div className={s.themeProperties}>
            {theme.properties.map((property) => (
              <div key={property.id} className={s.themePropertyRow}>
                <input
                  className={s.themePropertyName}
                  value={property.name}
                  aria-label="CSS property"
                  spellCheck={false}
                  onChange={(event) =>
                    store.updateThemeProperty(theme.id, property.id, {
                      name: event.target.value,
                    })
                  }
                />
                <span className={s.themeSyntax}>:</span>
                <input
                  className={s.themePropertyValue}
                  value={property.value}
                  aria-label={`${property.name} value`}
                  spellCheck={false}
                  onChange={(event) =>
                    store.updateThemeProperty(theme.id, property.id, {
                      value: event.target.value,
                    })
                  }
                />
                <span className={s.themeSyntax}>;</span>
                <IconButton
                  title="Remove property"
                  onClick={() => store.removeThemeProperty(theme.id, property.id)}
                >
                  <CloseIcon size={12} />
                </IconButton>
              </div>
            ))}
          </div>
          <button
            type="button"
            className={s.addThemeProperty}
            onClick={() => store.addThemeProperty(theme.id)}
          >
            <PlusIcon size={13} />
            Add property
          </button>
        </div>
      ))}
      <button type="button" className={s.addThemeProperty} onClick={store.addTheme}>
        <PlusIcon size={13} />
        Add theme
      </button>
    </div>
  );
}

/**
 * The active-variant chooser. A native `<select>` would only open from its text,
 * would draw a focus ring on plain clicks, and would drop an OS menu into an
 * otherwise custom-styled panel — so this is a button plus its own menu.
 */
function VariantPicker({
  store,
  nameMode,
  setNameMode,
}: {
  store: PrototyperStore;
  nameMode: 'new' | 'rename' | null;
  setNameMode: (mode: 'new' | 'rename' | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const root = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);
  useDismiss(root, open, close);

  useEffect(() => {
    if (!nameMode) return;
    setOpen(false);
    setDraft(nameMode === 'rename' ? store.variantName : '');
  }, [nameMode, store.variantName]);

  const commitName = () => {
    const name = draft.trim();
    if (nameMode === 'new' && name) store.addVariant(name);
    if (nameMode === 'rename' && name) store.rename(store.variant, name);
    setNameMode(null);
  };

  const nameKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') commitName();
    if (event.key === 'Escape') setNameMode(null);
  };

  const choose = (id: VariantId) => {
    store.setVariant(id);
    setOpen(false);
  };

  return (
    <div className={s.variantPicker} ref={root}>
      {nameMode ? (
        <div className={s.variantNameEditor}>
          <VariantIcon size={16} style={{ color: 'var(--accent-deep)' }} />
          <input
            className={s.variantNameInput}
            value={draft}
            autoFocus
            aria-label={nameMode === 'new' ? 'New variant name' : 'Variant name'}
            placeholder={nameMode === 'new' ? 'Variant name' : undefined}
            onFocus={(event) => event.currentTarget.select()}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={nameKeyDown}
            onBlur={commitName}
          />
        </div>
      ) : (
        <button
          type="button"
          className={cx(s.variantButton, open && s.variantButtonOpen)}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-label="Active variant"
          title="Double-click to rename"
          onClick={() => setOpen((current) => !current)}
          onDoubleClick={() => setNameMode('rename')}
        >
          <VariantIcon size={16} style={{ color: 'var(--accent-deep)' }} />
          <span className={s.variantName}>{store.variantName}</span>
          <ChevronDownIcon size={14} strokeWidth={1.6} className={s.variantChevron} />
        </button>
      )}

      {open && (
        <div className={s.variantMenu} role="listbox">
          {store.variants.map((variant) => {
            const on = store.variant === variant.id;
            return (
              <button
                key={variant.id}
                type="button"
                role="option"
                aria-selected={on}
                className={cx(s.variantOption, on && s.variantOptionOn)}
                onClick={() => choose(variant.id)}
              >
                <span className={s.variantOptionLabel}>
                  {store.nameOf(variant.id, variant.name)}
                </span>
                {on && <CheckIcon size={13} strokeWidth={2} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

type VariableRowProps = {
  store: PrototyperStore;
  variable: Variable;
  /** Set on a row the + button just created, so it opens ready to be named. */
  autoFocus: boolean;
};

/** Name and type on the first line, the default value on the second. */
function VariableRow({ store, variable, autoFocus }: VariableRowProps) {
  return (
    <div className={s.variableRow}>
      <div className={s.variableTop}>
        <input
          className={s.variableName}
          value={variable.name}
          aria-label="Variable name"
          autoFocus={autoFocus}
          onFocus={(event) => event.currentTarget.select()}
          onChange={(event) => store.updateVariable(variable.id, { name: event.target.value })}
        />
        <span className={s.variableSelect}>
          <select
            className={s.variableSelectInput}
            value={variable.type}
            aria-label="Variable type"
            onChange={(event) =>
              store.updateVariable(variable.id, {
                type: event.target.value as VariableType,
              })
            }
          >
            {VARIABLE_TYPES.map((type) => (
              <option key={type.id} value={type.id}>
                {type.label}
              </option>
            ))}
          </select>
          <ChevronDownIcon size={13} strokeWidth={1.6} />
        </span>
        <IconButton title="Remove variable" onClick={() => store.removeVariable(variable.id)}>
          <CloseIcon size={13} />
        </IconButton>
      </div>

      <div className={s.variableValueRow}>
        <span className={s.variableValueLabel}>Default</span>
        <VariableValue store={store} variable={variable} />
      </div>
    </div>
  );
}

/** The default-value editor, in whichever shape the variable's type calls for. */
function VariableValue({ store, variable }: { store: PrototyperStore; variable: Variable }) {
  const set = (value: string) => store.updateVariable(variable.id, { value });

  if (variable.type === 'boolean') {
    return (
      <span className={s.variableSelect}>
        <select
          className={s.variableSelectInput}
          value={variable.value}
          aria-label="Default value"
          onChange={(event) => set(event.target.value)}
        >
          <option value="false">false</option>
          <option value="true">true</option>
        </select>
        <ChevronDownIcon size={13} strokeWidth={1.6} />
      </span>
    );
  }

  if (variable.type === 'color') {
    return (
      <>
        <input
          type="color"
          className={s.variableSwatch}
          value={variable.value}
          aria-label="Default color"
          onChange={(event) => set(event.target.value)}
        />
        <input
          className={s.variableValueInput}
          value={variable.value}
          aria-label="Default value"
          onChange={(event) => set(event.target.value)}
        />
      </>
    );
  }

  return (
    <input
      className={s.variableValueInput}
      type={variable.type === 'number' ? 'number' : 'text'}
      inputMode={variable.type === 'number' ? 'decimal' : undefined}
      value={variable.value}
      placeholder={variable.type === 'string' ? 'Empty' : undefined}
      aria-label="Default value"
      onChange={(event) => set(event.target.value)}
    />
  );
}
