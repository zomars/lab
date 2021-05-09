/** @jsx jsx */
import { jsx, ThemeProvider, Styled } from 'theme-ui';
import React, { ReactElement } from 'react';
import { cn } from '@bem-react/classname';

import theme from '../../gatsby-plugin-theme-ui';

const cnFooter = cn('Footer');

// this import doesn't really work for SSR build
// have same import in globals.scss
import './Footer.scss';

export const Footer = (): ReactElement => {
  return (
    <ThemeProvider theme = { theme }>
      <footer
        className = { cnFooter() }
      >
        <div>
          { new Date().getFullYear() },
          built with { ` ` }
          <Styled.a href = 'https://www.gatsbyjs.org'>Gatsby</Styled.a>
        </div>
      </footer>
    </ThemeProvider>
  );
};
