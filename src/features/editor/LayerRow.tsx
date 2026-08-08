import { useState, type CSSProperties, type KeyboardEvent, type ReactNode } from 'react';
import { cx } from '../../ui/cx';
import s from './shell.module.css';

type LayerRowProps = {
  label: string;
  icon: ReactNode;
  selected: boolean;
  onClick: () => void;
  /** Tree depth; each level adds 20px of left padding. */
  indent?: number;
  /** Right-aligned extra, e.g. the component editor's "prop" badge. */
  trailing?: ReactNode;
  className?: string;
  /** Passing this makes the name editable: double-click the row to rename it. */
  onRename?: (name: string) => void;
};

/** One row of a layer tree. */
export function LayerRow({
  label,
  icon,
  selected,
  onClick,
  indent = 0,
  trailing,
  className,
  onRename,
}: LayerRowProps) {
  const [editing, setEditing] = useState(false);

  const rowClass = cx(s.layerRow, selected && s.layerRowOn, className);
  const rowStyle = { '--layer-indent': `${10 + indent * 20}px` } as CSSProperties;

  const commit = (draft: string) => {
    const name = draft.trim();
    if (name) onRename?.(name);
    setEditing(false);
  };

  /* An input can't sit inside a <button>, so editing swaps the element out. */
  if (editing) {
    return (
      <div className={rowClass} style={rowStyle}>
        {icon}
        <RenameInput label={label} onCommit={commit} onCancel={() => setEditing(false)} />
        {trailing && <span className={s.layerTrailing}>{trailing}</span>}
      </div>
    );
  }

  return (
    <button
      type="button"
      className={rowClass}
      style={rowStyle}
      onClick={onClick}
      onDoubleClick={onRename && (() => setEditing(true))}
    >
      {icon}
      <span className={s.layerLabel}>{label}</span>
      {trailing && <span className={s.layerTrailing}>{trailing}</span>}
    </button>
  );
}

type RenameInputProps = {
  label: string;
  onCommit: (draft: string) => void;
  onCancel: () => void;
};

/** Enter or blur keeps the new name, Escape drops it. */
function RenameInput({ label, onCommit, onCancel }: RenameInputProps) {
  const [draft, setDraft] = useState(label);

  const keyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') onCommit(draft);
    if (event.key === 'Escape') onCancel();
  };

  return (
    <input
      className={s.renameInput}
      value={draft}
      autoFocus
      onFocus={(event) => event.currentTarget.select()}
      onChange={(event) => setDraft(event.target.value)}
      onKeyDown={keyDown}
      onBlur={() => onCommit(draft)}
    />
  );
}
