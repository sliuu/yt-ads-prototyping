import { useCallback, useRef, useState } from 'react';
import { SourceThumb } from '../../components/ad/SourceThumb';
import { Button, IconButton } from '../../ui/Button';
import { Checkbox } from '../../ui/Checkbox';
import { cx } from '../../ui/cx';
import { Field, LabeledRow } from '../../ui/Field';
import { SegmentedControl, type SegmentOption } from '../../ui/SegmentedControl';
import { Select } from '../../ui/Select';
import { Stepper } from '../../ui/Stepper';
import { Tabs } from '../../ui/Tabs';
import { useDismiss } from '../../ui/useDismiss';
import {
  AlignCenterIcon,
  AlignJustifyIcon,
  AlignLeftIcon,
  AlignRightIcon,
  ChevronDownIcon,
  CloseIcon,
  CopyIcon,
  DiamondIcon,
  LineHeightIcon,
  PlusIcon,
} from '../../ui/icons';
import { PanelHeading } from '../editor/EditorShell';
import {
  ACTION_TRIGGERS,
  ACTION_TYPES,
  AD_COPY,
  PANEL_TABS,
  TEXT_PARTS,
  type TextAlign,
} from './prototyperData';
import type { PrototyperStore } from './usePrototyper';
import s from './prototyper.module.css';

const ELEMENT_ID = 'aoi9m3bf9s';

const ALIGNMENTS: ReadonlyArray<SegmentOption<TextAlign>> = [
  { id: 'left', label: <AlignLeftIcon size={15} />, title: 'Align left' },
  { id: 'center', label: <AlignCenterIcon size={15} />, title: 'Align center' },
  { id: 'right', label: <AlignRightIcon size={15} />, title: 'Align right' },
  { id: 'justify', label: <AlignJustifyIcon size={15} />, title: 'Justify' },
];

/** Right-hand inspector for whatever is selected on the canvas. */
export function PropertyPanel({ store }: { store: PrototyperStore }) {
  return (
    <>
      <div className={s.panelHead}>
        <PanelHeading
          title={store.selectedName}
          trailing={<DiamondIcon size={17} style={{ color: 'var(--text-muted)' }} />}
        />
        <Tabs options={PANEL_TABS} value={store.panelTab} onChange={store.setPanelTab} />
      </div>

      <div className={s.panelBody}>
        {store.panelTab === 'properties' && (
          <div className={s.propStack}>
            <div className={s.idRows}>
              <LabeledRow label="ID" labelWidth={40}>
                <Field size="sm" mono grow>
                  <span style={{ flex: 1 }}>{ELEMENT_ID}</span>
                  <CopyIcon size={15} style={{ color: 'var(--text-muted)' }} />
                </Field>
              </LabeledRow>
              <LabeledRow label="Width" labelWidth={40}>
                <Field size="sm" grow>
                  1000px
                </Field>
                <span className={s.fieldLabel}>Height</span>
                <Field size="sm" style={{ width: 78 }}>
                  1600px
                </Field>
              </LabeledRow>
            </div>

            {store.selected === 'shorts' && <ShortsProperties store={store} />}
            {store.selected === 'banner' && <BannerProperties />}
          </div>
        )}

        {store.panelTab === 'actions' && <ActionsTab store={store} />}
        {store.panelTab === 'style' && <StyleTab store={store} />}
      </div>
    </>
  );
}

function StyleTab({ store }: { store: PrototyperStore }) {
  const isCustomTheme = store.selectedThemeId === null;

  return (
    <div className={s.propStack}>
      <div>
        <span className={s.groupTitle}>Theme</span>
        <div className={s.fieldBlock}>
          <Select
            label="Theme"
            value={store.selectedThemeId ?? ''}
            /* '' is the no-theme case, so it round-trips back to null. */
            onChange={(id) => store.setSelectedThemeId(id || null)}
            options={[
              { id: '', label: 'Custom theme' },
              ...store.themes.map((theme) => ({
                id: theme.id,
                label: theme.name || 'Untitled theme',
                meta: `${theme.properties.length} props`,
              })),
            ]}
          />
        </div>
      </div>
      {(isCustomTheme || store.selected === 'banner') && (
        <div className={s.divider}>
          {store.selected === 'banner' ? (
            <BannerStyleTab store={store} showBoxStyles={isCustomTheme} />
          ) : (
            <BoxStyleRows />
          )}
        </div>
      )}
    </div>
  );
}

/** The custom Shorts component's exposed props: its source, options and timer. */
function ShortsProperties({ store }: { store: PrototyperStore }) {
  return (
    <div className={s.propStack}>
      <div>
        <div className={s.groupHead}>
          <span className={s.groupTitle}>Stream source</span>
          <SourcePicker store={store} />
        </div>
        {store.hasAttachedSource ? (
          <div className={s.sourcePickList}>
            {store.attachedSources.map((source) => (
              <div key={source.id} className={s.sourcePick}>
                <button
                  type="button"
                  className={s.sourcePickMain}
                  onClick={() => store.editSource(source.id)}
                >
                  <SourceThumb size={30} radius={7} step={5} />
                  <span className={s.sourceInfo}>
                    <span className={s.sourcePickName}>{source.name}</span>
                    <span className={s.sourcePickMeta}>{source.count} results · linked</span>
                  </span>
                </button>
                <IconButton
                  className={s.sourcePickRemove}
                  title={`Remove ${source.name} from this object`}
                  aria-label={`Remove ${source.name} from this object`}
                  onClick={() => store.detachSource(source.id)}
                >
                  <CloseIcon size={13} />
                </IconButton>
              </div>
            ))}
          </div>
        ) : (
          <div className={s.sourceEmpty}>No source linked to this object.</div>
        )}
      </div>

      <div>
        <span className={s.groupTitle}>Options</span>
        <div className={s.options}>
          <Checkbox
            help
            label="Instrumentation"
            checked={store.opts.instrumentation}
            onChange={() => store.toggleOption('instrumentation')}
          />
          <Checkbox
            label="Loop stream"
            checked={store.opts.loop}
            onChange={() => store.toggleOption('loop')}
          />
          <Checkbox
            label="Default to muted"
            checked={store.opts.muted}
            onChange={() => store.toggleOption('muted')}
          />
          <Checkbox
            label="Reset stream on pause"
            checked={store.opts.reset}
            onChange={() => store.toggleOption('reset')}
          />
        </div>
      </div>

      <div className={s.divider}>
        <span className={s.groupTitle}>Skip behavior</span>
        <div className={s.options}>
          <Checkbox
            label="Show unskippable timer"
            checked={store.opts.unskippable}
            onChange={() => store.toggleOption('unskippable')}
          />
          {store.opts.unskippable && (
            <div className={s.skipRow}>
              <span>Skip allowed after</span>
              <Stepper
                value={store.skipAfter}
                onChange={store.setSkipAfter}
                min={store.skipAfterRange.min}
                max={store.skipAfterRange.max}
              />
              <span>sec</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * The + beside "Stream source". Sources belong to the project, so linking one
 * that already exists is the common case — creating another is the fallback.
 */
function SourcePicker({ store }: { store: PrototyperStore }) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);
  useDismiss(root, open, close);

  const link = (id: string) => {
    store.attachSource(id);
    setOpen(false);
  };

  return (
    <div className={s.sourceMenuAnchor} ref={root}>
      <IconButton
        title="Link a source"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <PlusIcon strokeWidth={1.6} />
      </IconButton>

      {open && (
        <div className={s.sourceMenu} role="menu">
          {store.unattachedSources.length > 0 ? (
            store.unattachedSources.map((source) => (
              <button
                key={source.id}
                type="button"
                role="menuitem"
                className={s.sourceMenuItem}
                onClick={() => link(source.id)}
              >
                <SourceThumb size={26} radius={6} step={4} />
                <span className={s.sourceInfo}>
                  <span className={s.sourcePickName}>{source.name}</span>
                  <span className={s.sourcePickMeta}>{source.count} results</span>
                </span>
              </button>
            ))
          ) : (
            <p className={s.sourceMenuEmpty}>
              {store.hasSource
                ? 'Every project source is already linked here.'
                : 'This project has no sources yet.'}
            </p>
          )}

          <button
            type="button"
            role="menuitem"
            className={cx(s.sourceMenuItem, s.sourceMenuCreate)}
            onClick={() => {
              setOpen(false);
              store.newSource({ link: true });
            }}
          >
            <PlusIcon size={15} strokeWidth={1.6} />
            Create a new source…
          </button>
        </div>
      )}
    </div>
  );
}

function BannerProperties() {
  return (
    <div className={s.bannerFields}>
      <div>
        <span className={s.fieldLabel}>Heading</span>
        <div className={s.fieldBlock}>
          <Field>{AD_COPY.heading}</Field>
        </div>
      </div>
      <div>
        <span className={s.fieldLabel}>Subtitle</span>
        <div className={s.fieldBlock}>
          <Field>{AD_COPY.subtitle}</Field>
        </div>
      </div>
      <LabeledRow label="Position" labelWidth={60}>
        <Field grow>Bottom overlay</Field>
      </LabeledRow>
    </div>
  );
}

/**
 * The banner's own box style, then one collapsible group per run of text it
 * contains — the header and subtitle are styled here rather than as layers.
 */
function BannerStyleTab({
  store,
  showBoxStyles,
}: {
  store: PrototyperStore;
  showBoxStyles: boolean;
}) {
  return (
    <div className={s.propStack}>
      {showBoxStyles && (
        <div>
          <span className={s.groupTitle}>Banner</span>
          <div className={s.fieldBlock}>
            <BoxStyleRows />
          </div>
        </div>
      )}

      <div className={showBoxStyles ? s.divider : undefined}>
        <span className={s.groupTitle}>Text</span>
        <div className={s.styleGroups}>
          {TEXT_PARTS.map((part) => (
            <TextStyleGroup key={part.id} store={store} part={part} />
          ))}
        </div>
      </div>
    </div>
  );
}

type TextStyleGroupProps = {
  store: PrototyperStore;
  part: (typeof TEXT_PARTS)[number];
};

function TextStyleGroup({ store, part }: TextStyleGroupProps) {
  /* The header opens first, so the section never reads as empty. */
  const [open, setOpen] = useState(part.id === 'heading');

  return (
    <div className={cx(s.styleGroup, open && s.styleGroupOpen)}>
      <button
        type="button"
        className={s.styleGroupHead}
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <ChevronDownIcon size={14} strokeWidth={1.7} className={s.styleGroupChevron} />
        <span className={s.styleGroupTitle}>{part.label}</span>
        <span className={s.styleGroupMeta}>
          {part.weight} · {part.size}px
        </span>
      </button>

      {open && (
        <div className={s.styleGroupBody}>
          <LabeledRow label="Font" labelWidth={52}>
            <Field grow select>
              {part.font}
            </Field>
          </LabeledRow>
          <LabeledRow label="Weight" labelWidth={52}>
            <Field grow select>
              {part.weight}
            </Field>
            <Field style={{ width: 74 }}>{part.size} px</Field>
          </LabeledRow>
          <LabeledRow label="Align" labelWidth={52}>
            <SegmentedControl
              variant="icon"
              options={ALIGNMENTS}
              value={store.textAlign[part.id]}
              onChange={(align) => store.setTextAlign(part.id, align)}
            />
            <Field grow>
              <LineHeightIcon size={13} style={{ color: 'var(--text-muted)' }} />
              {part.lineHeight}
            </Field>
          </LabeledRow>
          <LabeledRow label="Color" labelWidth={52}>
            <span className={s.swatch} style={{ background: part.color, borderColor: '#d3d7da' }} />
            <span className={s.monoValue}>{part.color}</span>
          </LabeledRow>
        </div>
      )}
    </div>
  );
}

/** Wiring an element's click to a screen change — the interaction model in miniature. */
function ActionsTab({ store }: { store: PrototyperStore }) {
  return (
    <div className={s.actionsTab}>
      {store.actions.map((action) => {
        const trigger = ACTION_TRIGGERS.find((item) => item.id === action.trigger)?.label;
        const type = ACTION_TYPES.find((item) => item.id === action.type);
        const script = store.codeFiles.find((file) => file.id === action.scriptId);
        return (
          <div key={action.id} className={s.actionCard}>
            <div className={s.actionCardHead}>
              <span className={s.actionDot} />
              <span className={s.actionCardTitle}>{trigger}</span>
              <IconButton
                className={s.actionDelete}
                title={`Delete ${trigger ?? 'action'} action`}
                aria-label={`Delete ${trigger ?? 'action'} action`}
                onClick={() => store.removeAction(action.id)}
              >
                <CloseIcon size={13} />
              </IconButton>
            </div>
            <div className={s.actionCardRow}>
              <Field grow>{type?.name ?? 'Action'}</Field>
              {action.type === 'script' ? (
                <Field grow mono>{script?.name ?? 'Missing script'}</Field>
              ) : type?.target ? (
                <Field grow select>{type.target.value}</Field>
              ) : null}
            </div>
          </div>
        );
      })}
      <Button variant="dashed" onClick={() => store.openOverlay('action')}>
        <PlusIcon size={14} />
        {store.hasActions ? 'Add another action' : 'Add action'}
      </Button>
    </div>
  );
}

/** Fill, radius and opacity — the style any box on the canvas has. */
function BoxStyleRows() {
  return (
    <div className={s.textFields}>
      <LabeledRow label="Fill" labelWidth={70}>
        <span className={s.swatch} style={{ background: '#111418' }} />
        <span className={s.monoValue}>#111418</span>
      </LabeledRow>
      <LabeledRow label="Radius" labelWidth={70}>
        <Field grow>6 px</Field>
      </LabeledRow>
      <LabeledRow label="Opacity" labelWidth={70}>
        <Field grow>100%</Field>
      </LabeledRow>
    </div>
  );
}
