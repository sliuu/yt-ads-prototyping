# Ads Prototyper — ad format prototyping

> **Note:** These screens are my own redesigns. Copy, labels, and advanced settings were rewritten or
> invented to protect Google's confidential information — some deliberately unrelated to the real
> tool.

A React build of the Claude Design handoff in `~/Downloads/design_handoff_ad_prototyper`. Three
screens: a home/welcome page, the **prototype editor** (teal) where researchers assemble and run ad
prototypes, and the **component editor** (green) where UX engineers build the reusable elements the
editor drops in.

All data is local and mocked. Nothing is fetched.

```bash
npm install
npm run dev      # http://localhost:5173
npm run check    # typecheck only
npm run build
```

## Screens

Hash routing, no router dependency (`src/router.ts`):

| Route               | Screen                                         |
| ------------------- | ---------------------------------------------- |
| `#/`                | Welcome — recent projects, plus doorways into templates and components |
| `#/prototyper`      | Prototype editor (also participant view + results) |
| `#/prototyper/templates` | Prototype editor with the template gallery open |
| `#/prototyper/blank` | Prototype editor on an empty screen |
| `#/component-editor`| Component editor                               |
| `#/marketplace`     | Component marketplace — components by surface and publisher |

## Layout

```
src/
  styles/       tokens.css (design tokens) + base.css (reset, fonts, scrollbar)
  ui/           design-system primitives, one ui.module.css for the folder
  components/ad/ ad-surface pieces reused across screens (stream, rail, timer chip)
  features/
    site/       top bar shared by the non-editor pages
    editor/     the shared three-column editor chrome
    welcome/    home screen
    prototyper/ teal editor + participant view + results
    component-editor/ green editor
    marketplace/ component catalogue
```

One `.module.css` per folder rather than per component — the pieces in a folder are one visual
system and are easier to keep consistent when they sit side by side.

## Two accents, one editor

The handoff draws the editor twice, in teal and in green. Here it's drawn once. `tokens.css` keeps
everything accent-independent on `:root`, then redefines the *same* variable names under
`[data-accent='teal']` and `[data-accent='green']`:

```css
[data-accent='teal']  { --accent: #0d9488; --accent-selection: #d6f0e8; /* … */ }
[data-accent='green'] { --accent: #2f9e44; --accent-selection: #d3ecd6; /* … */ }
```

`<EditorShell accent="green">` sets that attribute, and the whole subtree reskins — including the
custom-components section of the Welcome page, which is teal everywhere except that one block.

Icons follow the same rule: every icon in `ui/icons.tsx` draws in `currentColor`, so color is a CSS
concern rather than a prop threaded through components.

## Prototyper state

`usePrototyper.ts` holds it all. Two simplifications over the handoff's runtime class:

- The five modal booleans (`libraryOpen`, `galleryOpen`, `projMenuOpen`, `sourceOpen`, `actionOpen`)
  are one `overlay` union, since only one can be up at a time.
- `countdown` and `canSkip` are derived from a single `watched` counter that ticks while the
  participant view is mounted, instead of being separate state kept in sync by the interval.

## Demo scripts

A project carries JavaScript files in the editor's Code tab, and a "Run script" action points at one
of them. The template project seeds `fade-in-ad.js`; blank projects start with none, so demoing the
Code tab from empty means pasting something in. This one is short enough to read on a slide and
touches the two things the panel is there to show — an element listener and an instrumentation call:

```js
// Mute the stream while the ad is being read, unmute when they tap again.
export function run({ trigger, stream }) {
  trigger.addEventListener('click', () => {
    stream.muted = !stream.muted;
    log('ad_mute_toggled', { muted: stream.muted });
  });
}
```

Nothing executes it — the editor stores and displays the file, and the participant view ignores it.

## Not ported

- `support.js` — the handoff's `<x-dc>` / `<sc-if>` / `<sc-for>` runtime, per its README. Those map
  to components, `&&`, and `.map()`.
- `Case Study v2 (lean).dc.html` — context for the design, not app UI.
