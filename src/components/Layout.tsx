/** @jsx jsx */

import React, { ReactElement } from 'react';
import { cn } from '@bem-react/classname';
import { classnames } from '@bem-react/classnames';
import { jsx } from 'theme-ui';

import './Layout.scss';

const cnLayout = cn('Layout');

interface ILayoutProps {
  className?: string,
}

export class Layout extends React.Component<ILayoutProps> {
  public render(): ReactElement {
    const {
      children,
      className,
    } = this.props;

    return (
      <div className = { classnames(cnLayout(), className) }>
        <div
          className = { cnLayout('View') }
          sx = {{
            width: ['full', 'full', 'full', 1024, 1024],
          }}
        >
          { children }
        </div>
      </div>
    );
  }
}
