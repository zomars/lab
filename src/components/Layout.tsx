/** @jsx jsx */

import React, { ReactElement } from 'react';
import { cn } from '@bem-react/classname';
import classnames from 'classnames';
import { jsx } from 'theme-ui';

import './Layout.scss';

const cnLayout = cn('Layout');

export class Layout extends React.Component<{
  className?: string,
  children?: ReactElement,
}> {
  public render(): ReactElement {
    const {
      children,
      className,
    } = this.props;

    return (
      <div className={ classnames(cnLayout(), className) }>
        <div
          className = { cnLayout('View') }
          sx = {{
            width: ['full', 'full', 'full', '3/4', '3/5'],
          }}
        >
          { children }
        </div>
      </div>
    );
  }
}
