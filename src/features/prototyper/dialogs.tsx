import { useState } from 'react';
import { AdPreview } from '../../components/ad/AdPreview';
import { SourceThumb } from '../../components/ad/SourceThumb';
import { ROUTES } from '../../router';
import { SectionLabel } from '../../ui/atoms';
import { Button, IconButton } from '../../ui/Button';
import { Checkbox } from '../../ui/Checkbox';
import { Field } from '../../ui/Field';
import { Modal, ModalBody, ModalFooter, ModalHeader } from '../../ui/Modal';
import { Select } from '../../ui/Select';
import { Stepper } from '../../ui/Stepper';
import { cx } from '../../ui/cx';
import {
  CheckMarkIcon,
  ChevronRightIcon,
  CloseIcon,
  ComponentMarkIcon,
  LaunchIcon,
  InfoIcon,
  SearchIcon,
} from '../../ui/icons';
import {
  COLLECTION_GROUPS,
  MARKET_COMPONENTS,
  deviceForSurface,
  inCollection,
  matchesSearch,
  surfaceLabel,
  type CollectionId,
  type MarketComponent,
} from '../marketplace/marketplaceData';
import { ACTION_TRIGGERS, ACTION_TYPES, BASIC_ELEMENTS } from './prototyperData';
import type { PrototyperStore } from './usePrototyper';
import type { DataSource, ElementId } from './prototyperData';
import s from './prototyper.module.css';

/**
 * Which layer a component drops onto the canvas. The mock draws two real
 * elements, so the player stands in for whole-page components and the ad banner
 * for every creative that sits on top of one.
 */
function layerFor(component: MarketComponent): ElementId {
  return component.kind === 'shorts' ? 'shorts' : 'banner';
}

/* The few worth showing without opening the full browser. */
const FEATURED_COMPONENTS = MARKET_COMPONENTS.slice(0, 4);

/**
 * Add-an-element picker. Basic elements are primitives; custom components
 * arrive pre-wired with the options the property panel exposes. Ad formats used
 * to sit in between, but they were the same components under other names.
 */
export function ElementLibraryDialog({ store }: { store: PrototyperStore }) {
  const close = store.closeOverlay;
  /* Every element in this mock drops onto the current screen and selects itself. */
  const add = (component: MarketComponent) => {
    store.addLayer(layerFor(component));
    close();
  };

  return (
    <Modal width={560} onClose={close}>
      <div className={s.libraryModal}>
        <div className={s.libraryHead}>
          <span className={s.libraryTitle}>Add an element</span>
          <IconButton onClick={close} aria-label="Close">
            <CloseIcon size={18} />
          </IconButton>
        </div>
        <span className={s.groupLabel}>
          <SectionLabel>Basic</SectionLabel>
        </span>
        <div className={s.basicGrid}>
          {BASIC_ELEMENTS.map((element) => (
            <button key={element.name} type="button" className={s.basicTile} onClick={close}>
              <span className={s.basicGlyph}>{element.glyph}</span>
              <span className={s.basicName}>{element.name}</span>
            </button>
          ))}
        </div>

        <span className={s.groupLabel}>
          <SectionLabel>Custom components</SectionLabel>
        </span>
        <div className={s.adGrid}>
          {FEATURED_COMPONENTS.map((component) => (
            <button
              key={component.id}
              type="button"
              className={s.adTile}
              onClick={() => add(component)}
            >
              <span className={cx(s.tileIcon, s.tileIconComponent)}>
                <ComponentMarkIcon size={18} strokeWidth={1.5} />
              </span>
              <span className={s.tileText}>
                <span className={s.tileName}>{component.name}</span>
                <span className={s.tileMeta}>{surfaceLabel(component.surface)}</span>
              </span>
            </button>
          ))}
        </div>

        <button
          type="button"
          className={s.componentLink}
          onClick={() => store.openOverlay('componentMarketplace')}
        >
          <span className={cx(s.tileIcon, s.tileIconComponent)}>
            <ComponentMarkIcon size={18} strokeWidth={1.5} />
          </span>
          <span className={cx(s.tileName, s.tileNameFill)}>Browse all components</span>
          <ChevronRightIcon size={17} style={{ color: 'var(--text-faint)' }} />
        </button>
      </div>
    </Modal>
  );
}

/** A compact marketplace that keeps component selection inside the element flow. */
export function ComponentMarketplaceDialog({ store }: { store: PrototyperStore }) {
  const [collection, setCollection] = useState<CollectionId>('all');
  const [query, setQuery] = useState('');
  const saved = new Set<string>();
  const results = MARKET_COMPONENTS.filter(
    (component) =>
      inCollection(component, collection, saved) && matchesSearch(component, query),
  );

  const addComponent = (component: MarketComponent) => {
    store.addLayer(layerFor(component));
    store.closeOverlay();
  };

  return (
    <Modal width={1040} className={s.componentMarketModal} onClose={store.closeOverlay}>
      <div className={s.componentMarketShell} data-accent="green">
        <header className={s.componentMarketHead}>
          <div>
            <div className={s.componentMarketTitle}>Browse custom components</div>
            <div className={s.componentMarketSubtitle}>
            </div>
          </div>
          <div className={s.componentMarketActions}>
            <a
              href={ROUTES.marketplace}
              target="_blank"
              rel="noreferrer"
              className={s.openMarketplaceLink}
            >
              Open full marketplace
              <LaunchIcon size={15} />
            </a>
            <IconButton onClick={store.closeOverlay} aria-label="Close">
              <CloseIcon size={18} />
            </IconButton>
          </div>
        </header>

        <div className={s.componentMarketBody}>
          <aside className={s.componentMarketSidebar}>
            <label className={s.componentMarketSearch}>
              <SearchIcon size={15} style={{ color: 'var(--text-muted)' }} />
              <input
                className={s.componentMarketSearchInput}
                placeholder="Search components"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>
            {COLLECTION_GROUPS.map((group) => (
              <div key={group.label} className={s.componentMarketGroup}>
                <span className={s.componentMarketGroupLabel}>{group.label}</span>
                {group.collections
                  .filter((entry) => entry.id !== 'saved')
                  .map((entry) => (
                    <button
                      key={entry.id}
                      type="button"
                      className={cx(
                        s.componentMarketCollection,
                        collection === entry.id && s.componentMarketCollectionOn,
                      )}
                      onClick={() => setCollection(entry.id)}
                    >
                      {entry.name}
                    </button>
                  ))}
              </div>
            ))}
          </aside>

          <main className={s.componentMarketResults}>
            <div className={s.componentMarketResultsHead}>
              <span>{results.length} {results.length === 1 ? 'component' : 'components'}</span>
            </div>
            {results.length ? (
              <div className={s.componentMarketGrid}>
                {results.map((component) => (
                  <button
                    key={component.id}
                    type="button"
                    className={s.componentMarketTile}
                    onClick={() => addComponent(component)}
                  >
                    <span className={s.componentMarketPreview}>
                      <AdPreview
                        kind={component.kind}
                        device={deviceForSurface(component.surface)}
                        tint="transparent"
                        bg="#fff"
                      />
                    </span>
                    <span className={s.componentMarketTileBody}>
                      <span className={s.componentMarketTileName}>{component.name}</span>
                      <span className={s.componentMarketTileDesc}>{component.desc}</span>
                      <span className={s.componentMarketPublisher}>{component.publisher}</span>
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <div className={s.componentMarketEmpty}>No components match your search.</div>
            )}
          </main>
        </div>
      </div>
    </Modal>
  );
}

/** Picks a trigger and what it does. Only the "goto" style actions need a target. */
export function ActionPickerDialog({ store }: { store: PrototyperStore }) {
  const close = store.closeOverlay;
  const target = ACTION_TYPES.find((type) => type.id === store.action.type)?.target;

  return (
    <Modal width={480} onClose={close} zIndex={55}>
      <ModalHeader title="Add an action" onClose={close} />
      <ModalBody>
        <div>
          <span className={s.fieldLabel}>Trigger</span>
          <div className={s.triggerRow}>
            {ACTION_TRIGGERS.map((trigger) => (
              <button
                key={trigger.id}
                type="button"
                className={cx(s.trigger, store.action.trigger === trigger.id && s.triggerOn)}
                onClick={() => store.setActionTrigger(trigger.id)}
              >
                {trigger.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <span className={s.fieldLabel}>Action</span>
          <div className={s.actionList}>
            {ACTION_TYPES.map((type) => {
              const on = store.action.type === type.id;
              return (
                <button
                  key={type.id}
                  type="button"
                  className={cx(s.actionOption, on && s.actionOptionOn)}
                  onClick={() => store.setActionType(type.id)}
                >
                  <span className={cx(s.actionGlyph, on && s.actionGlyphOn)}>{type.glyph}</span>
                  <span className={s.actionOptionText}>
                    <span className={s.actionOptionName}>{type.name}</span>
                    <span className={s.actionOptionDesc}>{type.desc}</span>
                  </span>
                  {on && <CheckMarkIcon style={{ color: 'var(--accent)' }} />}
                </button>
              );
            })}
          </div>
        </div>

        {target && (
          <div>
            <span className={s.fieldLabel}>{target.label}</span>
            <div className={s.fieldBlock}>
              <Field size="lg" select>
                {target.value}
              </Field>
            </div>
          </div>
        )}
        {store.action.type === 'script' && (
          <div>
            <span className={s.fieldLabel}>Script file</span>
            <div className={s.fieldBlock}>
              {store.codeFiles.length ? (
                <Select
                  mono
                  size="lg"
                  /* Last field in the modal, and the modal clips its overflow. */
                  placement="up"
                  label="Script file"
                  value={store.action.scriptId}
                  onChange={store.setActionScript}
                  options={store.codeFiles.map((file) => ({ id: file.id, label: file.name }))}
                />
              ) : (
                <div className={s.actionResourceEmpty}>
                  Add a JavaScript file in the Code section first.
                </div>
              )}
            </div>
          </div>
        )}
      </ModalBody>
      <ModalFooter>
        <Button variant="outline" onClick={close}>
          Cancel
        </Button>
        <Button
          disabled={store.action.type === 'script' && store.codeFiles.length === 0}
          onClick={() => {
            store.addAction();
            close();
          }}
        >
          Add action
        </Button>
      </ModalFooter>
    </Modal>
  );
}

/** The pool of clips a Shorts player pulls from during a session. */
export function SourceEditorDialog({ store }: { store: PrototyperStore }) {
  const close = store.closeOverlay;
  const source = store.editingSource;
  if (!source) return null;

  return (
    <Modal width={460} onClose={close} zIndex={55}>
      <ModalHeader
        title="Edit data source"
        subtitle="A live pool of videos your players pull from"
        leading={<SourceThumb size={40} radius={10} step={6} />}
        onClose={close}
      />
      <ModalBody>
        <div>
          <span className={s.fieldLabel}>Name</span>
          <div className={s.fieldBlock}>
            <Field size="lg">{source.name}</Field>
          </div>
        </div>
        <div>
          <span className={s.fieldLabel}>Source</span>
          <div className={s.fieldBlock}>
            <Field size="lg" select>
              YouTube search
            </Field>
          </div>
        </div>
        <div>
          <span className={s.fieldLabel}>Search query</span>
          <div className={s.fieldBlock}>
            <Field size="lg">
              <SearchIcon size={15} style={{ color: 'var(--text-muted)' }} />
              {source.query}
            </Field>
          </div>
        </div>

        <div className={s.countRow}>
          <div className={s.countBlock}>
            <span className={s.fieldLabel}>Results to pull</span>
            <div className={s.fieldBlock}>
              <Stepper
                size="lg"
                value={source.count}
                onChange={store.setSourceCount}
                min={store.sourceCountRange.min}
                max={store.sourceCountRange.max}
              />
            </div>
          </div>
          <div className={s.safeSearch}>
            <Checkbox label="Safe search" checked={source.safe} onChange={store.toggleSafeSearch} />
          </div>
        </div>

        <div className={s.sourceNote}>
          <InfoIcon />
          <span>
            Linked to the <b>YouTube Shorts player</b> on Screen 1. Each session pulls a fresh clip.
          </span>
        </div>
      </ModalBody>
      <ModalFooter>
        <div className={s.sourceFooter}>
          <Button
            variant="ghost"
            className={s.deleteSourceButton}
            onClick={() => store.deleteSource(source.id)}
          >
            Delete source
          </Button>
          <Button variant="outline" onClick={close}>Cancel</Button>
          <Button onClick={close}>Save source</Button>
        </div>
      </ModalFooter>
    </Modal>
  );
}

/** Creates a source and appends it to the project's reusable data-source list. */
export function AddDataSourceDialog({ store }: { store: PrototyperStore }) {
  const [name, setName] = useState('');
  const [type, setType] = useState<DataSource['type']>('search');
  const [query, setQuery] = useState('');
  const [count, setCount] = useState(12);
  const [safe, setSafe] = useState(true);
  const close = store.closeOverlay;

  const add = () => {
    const trimmedName = name.trim();
    if (!trimmedName) return;
    store.addSource({ name: trimmedName, type, query: query.trim(), count, safe });
  };

  return (
    <Modal width={460} onClose={close} zIndex={55}>
      <ModalHeader
        title="Add data source"
        subtitle="Create a reusable pool of content for this project"
        leading={<SourceThumb size={40} radius={10} step={6} />}
        onClose={close}
      />
      <ModalBody>
        <label className={s.sourceFormField}>
          <span className={s.fieldLabel}>Name</span>
          <input
            className={s.sourceFormInput}
            value={name}
            autoFocus
            placeholder="Source name"
            onChange={(event) => setName(event.target.value)}
          />
        </label>
        <label className={s.sourceFormField}>
          <span className={s.fieldLabel}>Source</span>
          <select
            className={s.sourceFormInput}
            value={type}
            onChange={(event) => setType(event.target.value as DataSource['type'])}
          >
            <option value="search">YouTube search</option>
            <option value="playlist">YouTube playlist</option>
            <option value="channel">YouTube channel</option>
          </select>
        </label>
        <label className={s.sourceFormField}>
          <span className={s.fieldLabel}>
            {type === 'search' ? 'Search query' : type === 'playlist' ? 'Playlist URL' : 'Channel URL'}
          </span>
          <input
            className={s.sourceFormInput}
            value={query}
            placeholder={type === 'search' ? 'e.g. product reviews #shorts' : 'https://youtube.com/…'}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        <div className={s.countRow}>
          <div className={s.countBlock}>
            <span className={s.fieldLabel}>Results to pull</span>
            <div className={s.fieldBlock}>
              <Stepper
                size="lg"
                value={count}
                onChange={setCount}
                min={store.sourceCountRange.min}
                max={store.sourceCountRange.max}
              />
            </div>
          </div>
          <div className={s.safeSearch}>
            <Checkbox label="Safe search" checked={safe} onChange={() => setSafe((on) => !on)} />
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button variant="outline" onClick={close}>Cancel</Button>
        <Button disabled={!name.trim()} onClick={add}>Add source</Button>
      </ModalFooter>
    </Modal>
  );
}
