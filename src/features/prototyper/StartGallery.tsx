import { SectionLabel } from '../../ui/atoms';
import { IconButton } from '../../ui/Button';
import { CloseIcon, PlayerMarkIcon, PlusIcon } from '../../ui/icons';
import { HomeLogo } from '../editor/EditorShell';
import { GALLERY_TEMPLATES } from './prototyperData';
import type { PrototyperStore } from './usePrototyper';
import s from './prototyper.module.css';

/**
 * Full-screen "new project" step — a template, or an empty screen. Reached from
 * the project menu, or straight from the home page's "Start from a template".
 */
export function StartGallery({ store }: { store: PrototyperStore }) {
  const close = store.closeOverlay;

  const pickTemplate = () => {
    store.startTemplateProject();
  };

  const startBlank = () => {
    store.startBlankProject();
  };

  return (
    <div className={s.gallery}>
      <div className={s.fullBar}>
        <div className={s.fullBarLead}>
          <HomeLogo>
            <PlayerMarkIcon size={16} />
          </HomeLogo>
          <span className={s.fullBarTitle}>New project</span>
        </div>
        <IconButton onClick={close} aria-label="Close">
          <CloseIcon size={18} />
        </IconButton>
      </div>

      <div className={s.galleryScroll}>
        <div className={s.galleryInner}>
          <h1 className={s.galleryHeading}>Start a new project</h1>
          <p className={s.galleryLead}>
            
          </p>

          <div className={s.groupLabel}>
            <SectionLabel>Templates</SectionLabel>
          </div>
          <div className={s.templateGrid}>
            {GALLERY_TEMPLATES.map((template) => (
              <button
                key={template.name}
                type="button"
                className={s.templateCard}
                onClick={pickTemplate}
              >
                <div className={s.templatePreview} style={{ background: template.screen }}>
                  {template.kind === 'shorts' && (
                    <div className={s.templatePhone}>
                      <div className={s.templatePhoneStream} />
                      <div className={s.templatePhoneAd} />
                    </div>
                  )}
                  {template.kind === 'video' && (
                    <div className={s.templateWatchPage}>
                      <div className={s.templateWatchTop} />
                      <div className={s.templateWatchContent}>
                        <div className={s.templateWatchPlayer}>
                          <span className={s.templateAdBadge}>Ad</span>
                        </div>
                        <div className={s.templateWatchRail} />
                      </div>
                      <div className={s.templateWatchLines} />
                    </div>
                  )}
                  {template.kind === 'livingroom' && (
                    <div className={s.templateTv}>
                      <div className={s.templateTvScreen}>
                        <span className={s.templateTvAd}>Ad · 0:15</span>
                        <span className={s.templateTvCta}>Learn more</span>
                      </div>
                      <div className={s.templateTvStand} />
                    </div>
                  )}
                </div>
                <div className={s.templateBody}>
                  <div className={s.templateName}>{template.name}</div>
                  <div className={s.templateDesc}>{template.desc}</div>
                </div>
              </button>
            ))}
          </div>

          <div className={s.groupLabel}>
            <SectionLabel>Start empty</SectionLabel>
          </div>
          <button type="button" className={s.blankCard} onClick={startBlank}>
            <span className={s.blankIcon}>
              <PlusIcon size={20} />
            </span>
            <span>
              <span className={s.blankName}>Blank screen</span>
              <span className={s.blankDesc}></span>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
