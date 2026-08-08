import { useEffect, useRef, useState } from 'react';
import { Avatar } from '../../ui/atoms';
import { IconButton } from '../../ui/Button';
import { ChevronDownIcon, LaunchIcon, PlusIcon, PlayerMarkIcon } from '../../ui/icons';
import { useDismiss } from '../../ui/useDismiss';
import { EditorShell, EditorTopBar, HomeLogo, ProjectTitle } from '../editor/EditorShell';
import { Canvas } from './Canvas';
import { CodeEditor } from './CodeEditor';
import { LeftPanel } from './LeftPanel';
import { ParticipantView } from './ParticipantView';
import { PropertyPanel } from './PropertyPanel';
import { ResultsView } from './ResultsView';
import { StartGallery } from './StartGallery';
import { ViewMenu } from './ViewMenu';
import {
  ActionPickerDialog,
  AddDataSourceDialog,
  ComponentMarketplaceDialog,
  ElementLibraryDialog,
  SourceEditorDialog,
} from './dialogs';
import { usePrototyper, type PrototyperInit } from './usePrototyper';
import s from './prototyper.module.css';

/** The prototype editor: build a screen, run it, read the session back. */
export function PrototyperPage({ init }: { init?: PrototyperInit }) {
  const store = usePrototyper(init);
  const viewRef = useRef<HTMLDivElement>(null);
  const projectRef = useRef<HTMLDivElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const [draftProjectName, setDraftProjectName] = useState(store.projectName);
  const [renaming, setRenaming] = useState(false);
  useDismiss(viewRef, store.overlay === 'viewMenu', store.closeOverlay);
  useDismiss(projectRef, store.overlay === 'projectMenu', store.closeOverlay);

  useEffect(() => {
    if (renaming) titleInputRef.current?.select();
  }, [renaming]);

  const startRenaming = () => {
    setDraftProjectName(store.projectName);
    setRenaming(true);
    store.closeOverlay();
  };

  const finishRenaming = () => {
    const nextName = draftProjectName.trim();
    if (nextName) store.setProjectName(nextName);
    setRenaming(false);
  };

  return (
    <EditorShell
      accent="teal"
      topBar={
        <EditorTopBar
          left={
            <HomeLogo>
              <PlayerMarkIcon size={16} />
            </HomeLogo>
          }
          center={
            <div className={s.projectAnchor} ref={projectRef}>
              {renaming ? (
                <input
                  ref={titleInputRef}
                  className={s.projectTitleInput}
                  /* Sized to what's typed, so the field is never wider than the name. */
                  style={{ width: `${draftProjectName.length + 1}ch` }}
                  value={draftProjectName}
                  aria-label="Project name"
                  onChange={(event) => setDraftProjectName(event.target.value)}
                  onBlur={finishRenaming}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') finishRenaming();
                    if (event.key === 'Escape') setRenaming(false);
                  }}
                />
              ) : (
                <span onDoubleClick={startRenaming} title="Double-click to rename">
                  <ProjectTitle>{store.projectName}</ProjectTitle>
                </span>
              )}
              <IconButton
                onClick={() => store.toggleOverlay('projectMenu')}
                aria-label="Project menu"
              >
                <ChevronDownIcon style={{ color: 'var(--text-soft)' }} />
              </IconButton>
              {store.overlay === 'projectMenu' && (
                <div className={s.projectMenu}>
                  <button
                    type="button"
                    className={s.menuItem}
                    onClick={() => store.openOverlay('gallery')}
                  >
                    <PlusIcon size={15} style={{ color: 'var(--text-body)' }} />
                    New project from template…
                  </button>
                  <button
                    type="button"
                    className={`${s.menuItem} ${s.menuItemMuted}`}
                    onClick={startRenaming}
                  >
                    Rename project
                  </button>
                  <button type="button" className={`${s.menuItem} ${s.menuItemMuted}`}>
                    Duplicate
                  </button>
                </div>
              )}
            </div>
          }
          right={
            <>
              {/* The split button clips its own corners, so the menu anchors outside it. */}
              <div className={s.splitAnchor} ref={viewRef}>
                <div className={s.splitButton}>
                  <button type="button" className={s.splitMain} onClick={store.enterView}>
                    <LaunchIcon size={15} />
                    View
                  </button>
                  <button
                    type="button"
                    className={s.splitCaret}
                    aria-label="View options"
                    aria-haspopup="dialog"
                    aria-expanded={store.overlay === 'viewMenu'}
                    onClick={() => store.toggleOverlay('viewMenu')}
                  >
                    <ChevronDownIcon size={14} />
                  </button>
                </div>
                {store.overlay === 'viewMenu' && <ViewMenu store={store} />}
              </div>
              <Avatar initials="S" color="#0d9488" />
            </>
          }
        />
      }
      left={<LeftPanel store={store} />}
      canvas={store.activeCodeFile ? <CodeEditor store={store} /> : <Canvas store={store} />}
      right={<PropertyPanel store={store} />}
      overlays={
        <>
          {store.overlay === 'library' && <ElementLibraryDialog store={store} />}
          {store.overlay === 'componentMarketplace' && (
            <ComponentMarketplaceDialog store={store} />
          )}
          {store.overlay === 'action' && <ActionPickerDialog store={store} />}
          {store.overlay === 'source' && <SourceEditorDialog store={store} />}
          {store.overlay === 'addSource' && <AddDataSourceDialog store={store} />}
          {store.overlay === 'gallery' && <StartGallery store={store} />}
          {/* Both cover the editor entirely, but stay inside it so they keep the teal accent. */}
          {store.mode === 'view' && <ParticipantView store={store} />}
          {store.mode === 'results' && <ResultsView store={store} />}
        </>
      }
    />
  );
}
