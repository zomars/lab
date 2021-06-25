import './src/styles/index.scss';

import { yMetricsInit } from './src/services/y-metrica';

export { wrapPageElement } from './src/gatsby-hooks/wrap-page-element';
export { wrapRootElement } from './src/gatsby-hooks/wrap-root-element';

export function onClientEntry(): void {
  if (process.env.NODE_ENV === 'production') {
    yMetricsInit(window, document);

    // eslint-disable-next-line no-extra-parens
    (window as any).dataLayer = (window as any).dataLayer || [];

    // eslint-disable-next-line no-inner-declarations
    function gtag(): void {
      // eslint-disable-next-line no-extra-parens
      (window as any).dataLayer.push(arguments);
    }

    // eslint-disable-next-line no-extra-parens
    (window as any).gtag = gtag;

    // @ts-ignore
    gtag('js', new Date());

    // @ts-ignore
    gtag('config', 'G-6G7FL8W2JR');
  }
}
