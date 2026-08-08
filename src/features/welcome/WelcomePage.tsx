import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cx } from '../../ui/cx';
import {
  ChevronDownIcon,
  DocumentationIcon,
  PlayerMarkIcon,
  PlusIcon,
  SearchIcon,
} from '../../ui/icons';
import { ROUTES } from '../../router';
import { SiteTopBar } from '../site/SiteTopBar';
import { ProjectCard } from './cards';
import {
  ME,
  NEW_USER,
  PROJECTS,
  PROJECT_SORTS,
  projectAge,
  sortProjects,
  type ProjectSortId,
} from './welcomeData';
import s from './welcome.module.css';

type Ownership = 'mine' | 'anyone';

export function WelcomePage({ newUser }: { newUser?: boolean }) {
  const [ownership, setOwnership] = useState<Ownership>('mine');
  const [sort, setSort] = useState<ProjectSortId>('viewed');
  const [query, setQuery] = useState('');

  /* The empty account owns nothing, so the ownership filter empties itself. */
  const me = newUser ? NEW_USER : ME;
  const needle = query.trim().toLowerCase();
  const projects = sortProjects(
    PROJECTS.filter(
      (project) =>
        (ownership === 'anyone' || project.owner === me) &&
        project.name.toLowerCase().includes(needle),
    ),
    sort,
  );

  /*
   * An account with no projects of its own gets the onboarding block in place of
   * the grid — but only where the emptiness is the account rather than the query,
   * since "no projects yet" would be a lie if a search had just excluded them all.
   */
  const onboarding = projects.length === 0 && ownership === 'mine' && needle === '';

  return (
    <div className={s.page} data-accent="teal">
      <SiteTopBar components newUser={newUser} />

      <div className={s.content}>
        {/*
         * The projects list is the whole page, so its header is the page's header:
         * the two scope pills stand in for a section heading, and the one accented
         * thing on the screen — New project — closes the row at the top right.
         */}
        <div className={cx(s.sectionHeader, s.sectionHeaderFirst)}>
          <div className={s.filterButtons}>
            <FilterButton active={ownership === 'mine'} onClick={() => setOwnership('mine')}>
              My projects
            </FilterButton>
            <FilterButton active={ownership === 'anyone'} onClick={() => setOwnership('anyone')}>
              All projects
            </FilterButton>
          </div>
          <div className={s.headerActions}>
            <label className={s.search}>
              <SearchIcon size={16} style={{ color: 'var(--icon-action)' }} />
              <input
                className={s.searchInput}
                type="search"
                value={query}
                placeholder="Search projects"
                aria-label="Search projects"
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>
            <span className={s.sortSelect}>
              <select
                className={s.sortSelectInput}
                value={sort}
                aria-label="Sort projects"
                onChange={(event) => setSort(event.target.value as ProjectSortId)}
              >
                {PROJECT_SORTS.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDownIcon size={14} strokeWidth={1.6} />
            </span>
            <NewProjectMenu />
          </div>
        </div>
        {projects.length > 0 && (
          <div className={s.gridThree}>
            {projects.map((project) => (
              <ProjectCard key={project.name} project={project} age={projectAge(project, sort)} />
            ))}
          </div>
        )}
        {onboarding && (
          <div className={s.onboard}>
            <h2 className={s.onboardTitle}>You don’t have any projects yet</h2>
            <p className={s.onboardSubtitle}>Start something new</p>
            <div className={s.doorways}>
              <Doorway
                recommended
                href={ROUTES.templates}
                icon={<PlayerMarkIcon size={20} />}
                title="Start from a template"
                desc="A working ad flow in one click, then edit it like any project."
              />
              <Doorway
                href={ROUTES.blank}
                icon={<PlusIcon size={20} />}
                title="Start a blank project"
                desc="One empty 1000×1600 screen."
              />
            </div>
            <a href="#guide" className={s.onboardGuide}>
              <DocumentationIcon size={15} />
              Read the start-up guide
              <span aria-hidden="true">→</span>
            </a>
          </div>
        )}
        {projects.length === 0 && !onboarding && (
          <p className={s.empty}>
            No projects match “{query.trim()}”
            {ownership === 'mine' && ' among the ones you own'}.
          </p>
        )}
      </div>

      <SiteFooter />
    </div>
  );
}

/** Both home screens end the same way, so the band is shared rather than repeated. */
function SiteFooter() {
  return (
    <div className={s.footer}>
      <span>New to Ads Prototyper?</span>
      <a href="#docs">Read the documentation</a>
      <span>·</span>
      <a href="#team">Meet the team</a>
    </div>
  );
}

type DoorwayProps = {
  href: string;
  icon: ReactNode;
  title: string;
  desc: string;
  /** Accents the icon chip; nothing else about the card changes. */
  recommended?: boolean;
};

/**
 * The full-size entry point, kept for the empty account. Once there are projects to
 * show, the same two destinations live in the New project menu instead — a card
 * this large earns its room only when the page has nothing else to say.
 *
 * The two cards are identical apart from the icon chip: tinting the whole preferred
 * card made it read as selected, so only the chip carries the accent. Being first in
 * the stack says the rest.
 */
function Doorway({ href, icon, title, desc, recommended }: DoorwayProps) {
  return (
    <a href={href} className={s.doorway}>
      <span className={cx(s.doorwayIcon, recommended && s.doorwayIconAccent)}>{icon}</span>
      <span className={s.doorwayText}>
        <span className={s.doorwayTitle}>{title}</span>
        <span className={s.doorwayDesc}>{desc}</span>
      </span>
      <span className={s.doorwayArrow} aria-hidden="true">
        →
      </span>
    </a>
  );
}

/**
 * Both ways to start, behind one accented button. Templates leads because it's the
 * path worth taking; blank follows as the fallback it always was. The menu closes
 * on an outside click or Escape — it holds two links, so it never needs to persist.
 */
function NewProjectMenu() {
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!wrap.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <div className={s.newProject} ref={wrap}>
      <button
        type="button"
        className={s.newProjectButton}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((wasOpen) => !wasOpen)}
      >
        <PlusIcon size={15} />
        New project
        <ChevronDownIcon size={13} strokeWidth={1.8} />
      </button>
      {open && (
        <div className={s.newProjectMenu} role="menu">
          <a href={ROUTES.templates} role="menuitem" className={s.newProjectItem}>
            <PlayerMarkIcon size={15} />
            <span>
              New project from template
              <span className={s.newProjectItemDesc}>A working ad flow in one click.</span>
            </span>
          </a>
          <a href={ROUTES.blank} role="menuitem" className={s.newProjectItem}>
            <PlusIcon size={15} />
            <span>
              New blank project
              <span className={s.newProjectItemDesc}>One empty 1000×1600 screen.</span>
            </span>
          </a>
        </div>
      )}
    </div>
  );
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      className={cx(s.filterButton, active && s.filterButtonOn)}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
