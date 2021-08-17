import React, { ReactElement, ReactNode } from 'react';
import { cn } from '@bem-react/classname';
import { classnames } from '@bem-react/classnames';

import './Layout.scss';

const cnLayout = cn('Layout');

interface ILayoutProps {
  className?: string,
  testId?: string,
  children: ReactNode,
}

export function Layout(props: ILayoutProps): ReactElement {
  const {
    children,
    className,
    testId,
  } = props;

  return (
    <div
      className = { classnames(cnLayout(), className) }
      data-testid = { classnames(cnLayout(), testId) }
    >
      <div
        className = { cnLayout('View') }
      >
        { children }
      </div>
    </div>
  );
}
