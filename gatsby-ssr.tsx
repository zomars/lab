import React from 'react';
import { RenderBodyArgs } from 'gatsby';

import { Footer } from './src/components/Footer/Footer';

/**
 * Adds footer to all pages rendered.
 */
export function onRenderBody({ setPostBodyComponents }: RenderBodyArgs): void {
  setPostBodyComponents([
    <Footer key = 'footer'/>,
  ]);
}

export { onPreRenderHTML } from './src/gatsby-hooks/on-pre-render-html';
export { replaceRenderer } from './src/gatsby-hooks/replace-renderer';
export { wrapPageElement } from './src/gatsby-hooks/wrap-page-element';
export { wrapRootElement } from './src/gatsby-hooks/wrap-root-element';
