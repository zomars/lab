/** @jsx jsx */
import { jsx, ThemeProvider } from 'theme-ui';
import React, { ReactElement } from 'react'
import { Styled } from 'theme-ui';
import theme from '../../gatsby-plugin-theme-ui';

const styles = {
  display: 'flex',
  flex: '0 0 auto',
  borderColor: 'secondary',
  borderTopWidth: 1,
  borderTopStyle: 'solid',
  py: 0,
  px: 3,
  justifyContent: 'flex-end',
  alignItems: 'center',
  fontSize: 1,
  height: 10,
};

const copyrightStyles = {
  flex: '0 1 auto',
}

export const Footer = (): ReactElement => {
  return (
    <ThemeProvider theme={theme}>
      <footer
        sx = { styles }
      >
        <Styled.div sx = { copyrightStyles }>
          { new Date().getFullYear() },
          built with { ` ` }
          <Styled.a href='https://www.gatsbyjs.org'>Gatsby</Styled.a>
        </Styled.div>
      </footer>
    </ThemeProvider>
  );
}
