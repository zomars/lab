import React, { ReactElement } from 'react';
import { cn } from '@bem-react/classname';

import './Layout.scss';

const classnames = require('classnames');
const cnLayout = cn('Layout');

export class Layout extends React.Component {
  public render(): ReactElement {
    const {
      children,
      className,
    } = this.props as any;

    return (
      <div className={ classnames(cnLayout(), className) }>
        <div
          className={ cnLayout('View') }
        >
          { children }
        </div>
      </div>
    );
  }
}
