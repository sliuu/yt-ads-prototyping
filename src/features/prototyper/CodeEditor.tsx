import { useRef, type ReactNode } from 'react';
import { ChevronLeftIcon } from '../../ui/icons';
import type { PrototyperStore } from './usePrototyper';
import s from './prototyper.module.css';

/** Lightweight in-project JavaScript editor used by advanced action files. */
export function CodeEditor({ store }: { store: PrototyperStore }) {
  const file = store.activeCodeFile;
  const highlightRef = useRef<HTMLPreElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  if (!file) return null;

  const lineCount = Math.max(1, file.content.split('\n').length);

  return (
    <main className={s.codeEditorCanvas}>
      <header className={s.codeEditorHead}>
        <button type="button" className={s.codeEditorBack} onClick={store.closeCodeFile}>
          <ChevronLeftIcon size={14} />
          Back
        </button>
        <div className={s.codeEditorFileName}>
          <input
            className={s.codeEditorFileNameInput}
            value={file.name}
            aria-label="File name"
            spellCheck={false}
            onFocus={(event) => event.currentTarget.select()}
            onChange={(event) => store.renameCodeFile(file.id, event.target.value)}
          />
        </div>
        <span className={s.codeEditorStatus}>Saved locally</span>
      </header>
      <div className={s.codeEditorBody}>
        <div ref={lineNumbersRef} className={s.codeLineNumbers} aria-hidden="true">
          {Array.from({ length: lineCount }, (_, index) => (
            <span key={index}>{index + 1}</span>
          ))}
        </div>
        <div className={s.codeEditorPane}>
          <pre ref={highlightRef} className={s.codeHighlight} aria-hidden="true">
            {highlightJavaScript(file.content)}
          </pre>
          <textarea
            className={s.codeTextarea}
            value={file.content}
            aria-label={`Edit ${file.name}`}
            spellCheck={false}
            onChange={(event) => store.updateCodeFile(file.id, event.target.value)}
            onScroll={(event) => {
              if (highlightRef.current) {
                highlightRef.current.scrollTop = event.currentTarget.scrollTop;
                highlightRef.current.scrollLeft = event.currentTarget.scrollLeft;
              }
              if (lineNumbersRef.current) {
                lineNumbersRef.current.scrollTop = event.currentTarget.scrollTop;
              }
            }}
          />
        </div>
      </div>
    </main>
  );
}

const JS_TOKENS =
  /(\/\/[^\n]*|\/\*[\s\S]*?\*\/|'(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*"|`(?:\\.|[^`\\])*`|\b(?:export|import|from|function|return|const|let|var|if|else|for|while|class|new|async|await|true|false|null|undefined)\b|\b\d+(?:\.\d+)?\b)/g;

function highlightJavaScript(code: string): ReactNode[] {
  const parts: ReactNode[] = [];
  let cursor = 0;

  for (const match of code.matchAll(JS_TOKENS)) {
    const index = match.index;
    if (index > cursor) parts.push(code.slice(cursor, index));
    const token = match[0];
    const kind = token.startsWith('//') || token.startsWith('/*')
      ? s.codeTokenComment
      : token.startsWith("'") || token.startsWith('"') || token.startsWith('`')
        ? s.codeTokenString
        : /^\d/.test(token)
          ? s.codeTokenNumber
          : /^(true|false|null|undefined)$/.test(token)
            ? s.codeTokenLiteral
            : s.codeTokenKeyword;
    parts.push(<span key={`${index}-${token}`} className={kind}>{token}</span>);
    cursor = index + token.length;
  }

  if (cursor < code.length) parts.push(code.slice(cursor));
  return parts;
}
