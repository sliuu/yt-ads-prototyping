import { useRoute } from './router';
import { WelcomePage } from './features/welcome/WelcomePage';
import { PrototyperPage } from './features/prototyper/PrototyperPage';
import { ComponentEditorPage } from './features/component-editor/ComponentEditorPage';
import { MarketplacePage } from './features/marketplace/MarketplacePage';

export function App() {
  switch (useRoute()) {
    case 'newUser':
      return <WelcomePage newUser />;
    case 'prototyper':
      return <PrototyperPage />;
    case 'templates':
      return <PrototyperPage init={{ overlay: 'gallery' }} />;
    /* The canvas draws the same creative either way, so this opens on the
       Shorts player too — the layer whose panel actually has something in it. */
    case 'blank':
      return <PrototyperPage init={{ blank: true }} />;
    case 'componentEditor':
      return <ComponentEditorPage />;
    case 'marketplace':
      return <MarketplacePage />;
    default:
      return <WelcomePage />;
  }
}
