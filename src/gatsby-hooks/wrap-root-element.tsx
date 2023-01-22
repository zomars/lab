import React, { ReactElement } from 'react';
import { WrapRootElementBrowserArgs } from 'gatsby';
import { ThemeProvider } from '@mui/material/styles';

import { theme } from '../theme/theme.mui';

import { LightboxContextProvider } from '../context-providers/LightboxContextProvider';
import { PostListContextProvider } from '../context-providers/PostListContextProvider';
import { SnackbarAlertsContextProvider } from '../context-providers/SnackbarAlertsContextProvider';

/**
 * Set up postsContext for all nested elements.
 */
export function wrapRootElement(
  { element }: WrapRootElementBrowserArgs,
): ReactElement {
  return (
    <ThemeProvider theme = { theme }>
      <SnackbarAlertsContextProvider>
        <PostListContextProvider>
          <LightboxContextProvider>
            { element }
          </LightboxContextProvider>
        </PostListContextProvider>
      </SnackbarAlertsContextProvider>
    </ThemeProvider>
  );
}
