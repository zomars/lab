import React, { ReactElement } from 'react';
import { WrapRootElementBrowserArgs } from 'gatsby';
import { ThemeProvider } from '@mui/material/styles';

import { LightboxContextProvider } from '../context-providers/LightboxContextProvider';
import { PostContextProvider } from '../context-providers/PostContextProvider';
import { theme } from '../theme/theme.mui';

/**
 * Set up postsContext for all nested elements.
 */
export function wrapRootElement(
  { element }: WrapRootElementBrowserArgs,
): ReactElement {
  return (
    <ThemeProvider theme = { theme }>
      <PostContextProvider>
        <LightboxContextProvider>
          { element }
        </LightboxContextProvider>
      </PostContextProvider>
    </ThemeProvider>
  );
}
