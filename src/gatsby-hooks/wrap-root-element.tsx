import React, { ReactElement } from 'react';
import { WrapRootElementBrowserArgs } from 'gatsby';
import { ThemeProvider } from '@mui/material/styles';

import { theme } from '../theme/theme.mui';

import { LightboxContextProvider } from '../context-providers/LightboxContextProvider';
import { PostContextProvider } from '../context-providers/PostContextProvider';
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
        <PostContextProvider>
          <LightboxContextProvider>
            { element }
          </LightboxContextProvider>
        </PostContextProvider>
      </SnackbarAlertsContextProvider>
    </ThemeProvider>
  );
}
