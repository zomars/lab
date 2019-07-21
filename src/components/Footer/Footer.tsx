import React, { ReactElement } from 'react'
import { cn } from '@bem-react/classname'

const cnFooter = cn('Footer');
const classnames = require('classnames');

import './Footer.scss';

class Footer extends React.Component {
  public render(): ReactElement {
    const { className } = this.props as any;
    return (
      <footer
        className={ classnames(cnFooter(), className) }
      >
        <div className = { cnFooter('Gatsby') }>
          { new Date().getFullYear() },
          built with { ` ` }
          <a href='https://www.gatsbyjs.org'>Gatsby</a>
        </div>
      </footer>
    );
  }
}

export { Footer };
