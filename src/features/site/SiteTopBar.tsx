import { Avatar } from '../../ui/atoms';
import { ComponentMarkIcon, PlayerMarkIcon } from '../../ui/icons';
import { ROUTES } from '../../router';
import s from './site.module.css';

type SiteTopBarProps = {
  /** Off on the marketplace itself, where the link would point at the current page. */
  components?: boolean;
  /** Renders the empty account's avatar, and points it back at the full one. */
  newUser?: boolean;
};

/**
 * The bar above every non-editor page. The brand chip and avatar draw in
 * `--accent`, so the bar picks up whichever product mode the page declares —
 * teal on the home screen, green in the component marketplace.
 *
 * One nav link. Components is a place you go, not something you make here, so it
 * belongs in the chrome next to the avatar rather than competing with the page's
 * own New project button; docs and team stay in the footer.
 */
export function SiteTopBar({ components, newUser }: SiteTopBarProps) {
  return (
    <div className={s.topBar}>
      <a href={ROUTES.welcome} className={s.brand}>
        <span className={s.brandMark}>
          <PlayerMarkIcon size={16} />
        </span>
        <span className={s.wordmark}>Ads Prototyper</span>
      </a>
      <div className={s.nav}>
        {components && (
          <a href={ROUTES.marketplace} className={s.navLink}>
            <ComponentMarkIcon size={14} />
            Browse components
          </a>
        )}
        {/*
         * A prototype affordance, not a product one: the avatar swaps between the
         * two demo accounts so the empty home screen is reachable without a
         * sign-out flow. In a real build this would open an account menu.
         */}
        <a
          href={newUser ? ROUTES.welcome : ROUTES.newUser}
          className={s.avatarLink}
          title={newUser ? 'Switch to Stephanie’s account' : 'Switch to a new account'}
          aria-label={newUser ? 'Switch to Stephanie’s account' : 'Switch to a new account'}
        >
          <Avatar initials={newUser ? 'N' : 'S'} color="var(--accent)" />
        </a>
      </div>
    </div>
  );
}
