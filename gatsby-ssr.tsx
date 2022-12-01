import React from 'react';
import { RenderBodyArgs } from 'gatsby';

import { Footer } from './src/components/Footer/Footer';

// local fonts in static/fonts which are used for sure
import fontFile1Src from './static/fonts/source-sans-pro-v21-latin-regular.woff2';
import fontFile2Src from './static/fonts/source-sans-pro-v21-latin-600.woff2';
import fontFile3Src from './static/fonts/merriweather-v30-latin-700.woff2';

const fontsToPreload = [
  fontFile1Src,
  fontFile2Src,
  fontFile3Src,
];

/**
 * Adds footer to all pages rendered.
 */
export function onRenderBody(
  {
    setPostBodyComponents,
    setHeadComponents,
  }: RenderBodyArgs,
): void {
  setPostBodyComponents([
    <Footer
      key = 'footer'
    />,
  ]);

  const fonts = fontsToPreload.map(
    (fontFileSrc, index) => {
      return (
        <link
          rel = 'preload'
          href = { fontFileSrc }
          as = 'font'
          type = 'font/woff2'
          crossOrigin = 'anonymous'
          key = { index }
        />
      );
    });

  setHeadComponents(fonts);
}

export { onPreRenderHTML } from './src/gatsby-hooks/on-pre-render-html';
export { replaceRenderer } from './src/gatsby-hooks/replace-renderer';
export { wrapPageElement } from './src/gatsby-hooks/wrap-page-element';
export { wrapRootElement } from './src/gatsby-hooks/wrap-root-element';
