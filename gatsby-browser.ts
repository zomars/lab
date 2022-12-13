import { isWindowWithGTagManager } from './src/types/common.types';
import { getItem } from './src/services/local-storage';

export { wrapPageElement } from './src/gatsby-hooks/wrap-page-element';
export { wrapRootElement } from './src/gatsby-hooks/wrap-root-element';

import './src/styles/index.scss';

export function onClientEntry(): void {
  // populated by playwright config
  const debugMode = getItem('ga_debug_mode') === 'true';

  if (isWindowWithGTagManager(window) && debugMode) {
    window.ga_debug_mode = true;
  }
}
