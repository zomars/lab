import React, { ReactElement } from 'react';
import { cn } from '@bem-react/classname';

const cnFooter = cn('Footer');

// this import doesn't really work for SSR build
// have same import in globals.scss
import './Footer.scss';

export const Footer = (): ReactElement => {
  return (
    <footer
      className = { cnFooter() }
    >
      <div className = { cnFooter('Wrapper') }>
        <div>
          { new Date().getFullYear() },
          built with { ` ` }
          <a href = 'https://www.gatsbyjs.org'>Gatsby</a>
        </div>
      </div>
    </footer>
  );
};
