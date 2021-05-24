import React, { ReactElement, ReactNode } from 'react';
import { cn } from '@bem-react/classname';
import { classnames } from '@bem-react/classnames';

import './Layout.scss';

const cnLayout = cn('Layout');

interface ILayoutProps {
  className?: string,
  children: ReactNode,
}

export function Layout(props: ILayoutProps): ReactElement {
  const {
    children,
    className,
  } = props;

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
