import React, { ReactElement } from 'react';
import { WrapPageElementBrowserArgs } from 'gatsby';

import { Header } from '../components/Header/Header';
import { postsContext } from '../react-contexts/posts.context';

/**
 * Add header to every page rendered.
 * Provide contexts required.
 */
export function wrapPageElement(
  { element, props }: WrapPageElementBrowserArgs,
): ReactElement {
  return (
    <postsContext.Consumer>
      {
        postsContext => <>
          <Header postsContext = { postsContext } { ...props }/>
          { element }
        </>
      }
    </postsContext.Consumer>
  );
}
