import { useEffect, useState } from 'react';
import { Button } from '../../ui/Button';
import { Checkbox } from '../../ui/Checkbox';
import { QrCode } from '../../ui/QrCode';
import { SegmentedControl, type SegmentOption } from '../../ui/SegmentedControl';
import type { PrototyperStore } from './usePrototyper';
import s from './prototyper.module.css';

type ExportKind = 'link' | 'qr';

const EXPORTS: ReadonlyArray<SegmentOption<ExportKind>> = [
  { id: 'link', label: 'URL' },
  { id: 'qr', label: 'QR code' },
];

/**
 * The View button's dropdown: how the prototype behaves when a participant runs
 * it, and how they get to it.
 */
export function ViewMenu({ store }: { store: PrototyperStore }) {
  const [kind, setKind] = useState<ExportKind>('link');
  const [copied, setCopied] = useState(false);
  const url = `https://${store.shareUrl}`;

  /* The "Copied" label is a flash, not a state to get stuck in. */
  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1600);
    return () => clearTimeout(timer);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      /* Clipboard access can be refused; the URL is on screen either way. */
    }
  };

  return (
    <div className={s.viewMenu}>
      <div className={s.viewOptions}>
        <Checkbox
          help
          label="Add instrumentation"
          checked={store.share.instrumentation}
          onChange={() => store.toggleShare('instrumentation')}
        />
        <Checkbox
          label="Make available externally"
          checked={store.share.external}
          onChange={() => store.toggleShare('external')}
        />
      </div>

      <div className={s.viewExport}>
        <div className={s.viewExportHead}>
          <span className={s.viewExportTitle}>Export for studies</span>
          <SegmentedControl options={EXPORTS} value={kind} onChange={setKind} />
        </div>

        {!store.share.external ? (
          <p className={s.viewNote}>
            Turn on external access to hand this prototype to participants outside your org.
          </p>
        ) : kind === 'link' ? (
          <div className={s.viewLinkRow}>
            <span className={s.viewLink}>{store.shareUrl}</span>
            <Button variant="outline" onClick={copy}>
              {copied ? 'Copied' : 'Copy'}
            </Button>
          </div>
        ) : (
          <div className={s.viewQr}>
            <QrCode value={url} size={116} className={s.viewQrCode} />
            <span className={s.viewNote}>
              Participants scan this to open the study on their own phone.
            </span>
            <Button variant="outline" className={s.viewQrDownload}>
              Download QR code
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
