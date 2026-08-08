import { useState } from 'react';

/**
 * Names typed into a layer or variant row, keyed by element id. Both editors keep
 * their real content in module constants, so a rename is an override on top of
 * the original rather than a mutation of it — and, this being a prototype, it
 * lives only as long as the page does.
 *
 * Layer ids and variant ids share the map; they don't collide.
 */
export function useRenames() {
  const [names, setNames] = useState<Record<string, string>>({});

  return {
    nameOf: (id: string, fallback: string) => names[id] ?? fallback,
    rename: (id: string, name: string) => setNames((current) => ({ ...current, [id]: name })),
    clearRenames: () => setNames({}),
  };
}
