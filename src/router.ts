import { useEffect, useState } from 'react';

export type RouteId =
  | 'welcome'
  | 'newUser'
  | 'prototyper'
  | 'templates'
  | 'blank'
  | 'componentEditor'
  | 'marketplace';

/** Hash routes keep the prototype deployable as a static bundle. */
export const ROUTES: Record<RouteId, string> = {
  welcome: '#/',
  /** The home screen for an account with nothing in it yet. */
  newUser: '#/newuser',
  prototyper: '#/prototyper',
  /** The editor with the template gallery already open. */
  templates: '#/prototyper/templates',
  /** The editor reached from "start a blank project". */
  blank: '#/prototyper/blank',
  componentEditor: '#/component-editor',
  marketplace: '#/marketplace',
};

function routeFromHash(hash: string): RouteId {
  const match = (Object.keys(ROUTES) as RouteId[]).find((id) => ROUTES[id] === hash);
  return match ?? 'welcome';
}

export function useRoute(): RouteId {
  const [route, setRoute] = useState(() => routeFromHash(window.location.hash));

  useEffect(() => {
    const onHashChange = () => {
      setRoute(routeFromHash(window.location.hash));
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  return route;
}
