import './src/styles/index.scss';

import { gAnalyticsInit, IGAnalyticsWindow } from './src/services/g-analytics';

export { wrapPageElement } from './src/gatsby-hooks/wrap-page-element';
export { wrapRootElement } from './src/gatsby-hooks/wrap-root-element';

export function onClientEntry(): void {
  if (process.env.NODE_ENV === 'production') {
    gAnalyticsInit(window as unknown as IGAnalyticsWindow);
  }
}
