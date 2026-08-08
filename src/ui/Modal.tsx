import { useEffect, type CSSProperties, type ReactNode } from 'react';
import { CloseIcon } from './icons';
import { IconButton } from './Button';
import { cx } from './cx';
import s from './ui.module.css';

type ModalProps = {
  width: number;
  onClose: () => void;
  children: ReactNode;
  /** Backdrop stacking — the action picker sits above the element library. */
  zIndex?: number;
  className?: string;
  style?: CSSProperties;
};

/** Centered card over a blurred scrim. Dismisses on backdrop click or Escape. */
export function Modal({ width, onClose, children, zIndex, className, style }: ModalProps) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  return (
    <div className={s.backdrop} style={{ zIndex }} onClick={onClose}>
      <div
        className={cx(s.modal, className)}
        style={{ width, ...style }}
        onClick={(event) => event.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

type ModalHeaderProps = {
  title: string;
  subtitle?: string;
  /** Optional thumbnail or icon shown before the title. */
  leading?: ReactNode;
  onClose: () => void;
};

export function ModalHeader({ title, subtitle, leading, onClose }: ModalHeaderProps) {
  return (
    <div className={s.modalHeader}>
      {leading}
      <div style={{ flex: 1 }}>
        <div className={s.modalTitle}>{title}</div>
        {subtitle && <div className={s.modalSubtitle}>{subtitle}</div>}
      </div>
      <IconButton className={s.modalClose} onClick={onClose} aria-label="Close">
        <CloseIcon size={18} />
      </IconButton>
    </div>
  );
}

export function ModalBody({ children }: { children: ReactNode }) {
  return <div className={s.modalBody}>{children}</div>;
}

export function ModalFooter({ children }: { children: ReactNode }) {
  return <div className={s.modalFooter}>{children}</div>;
}
