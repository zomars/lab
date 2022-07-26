import React, { ReactElement } from 'react';
import { cn } from '@bem-react/classname';

import './Note.scss';

const cnNote = cn('MDXNote');

export enum INoteType {
  note = 'note',
  warning = 'warning',
}

interface INoteProps {
  type: INoteType;
  children: ReactElement[];
}

export function Note(props: INoteProps): ReactElement {
  const {
    children,
    type = INoteType.note,
  } = props;

  return (
    <aside
      className = { cnNote({ type }) }
    >
      { children }
    </aside>
  );
}
