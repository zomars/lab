import React from 'react';
import { RenderBodyArgs } from 'gatsby';

import { Footer } from './src/components/Footer/Footer'
export { wrapPageElement } from './src/gatsby-apis/wrap-page-element';

/**
 * Adds footer to all pages rendered.
 */
export function onRenderBody({ setPostBodyComponents }: RenderBodyArgs) {
  setPostBodyComponents([
    <Footer key='footer'/>,
  ]);
}
