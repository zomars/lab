import React, { ReactElement } from 'react';
import { cn } from '@bem-react/classname';
import { classnames } from '@bem-react/classnames';

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
        >
          { children }
        </div>
      </div>
    );
  }
}
