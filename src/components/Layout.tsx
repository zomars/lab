import React, { ReactElement } from 'react';
import { cn } from '@bem-react/classname';
import { Header } from './Header/Header';

import './Layout.scss';

const classnames = require('classnames');
const cnLayout = cn('Layout');

export class Layout extends React.Component {
  public render(): ReactElement {
    const {
      children,
      location,
      className,
    } = this.props as any;

    return (
      <div className={ classnames(cnLayout(), className) }>
        <Header
          className={ cnLayout('Header') }
          location={ location }
        />
        <div
          className={ cnLayout('View') }
        >
          { children }
        </div>
      </div>
    );
  }
}
