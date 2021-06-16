import './src/styles/index.scss';

import { yMetricsInit } from './src/services/y-metrica';

export { wrapPageElement } from './src/gatsby-hooks/wrap-page-element';
export { wrapRootElement } from './src/gatsby-hooks/wrap-root-element';

export function onClientEntry(): void {
  if (process.env.NODE_ENV === 'production') {
    yMetricsInit(window, document);
  }
}
