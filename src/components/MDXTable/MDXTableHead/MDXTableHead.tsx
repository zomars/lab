import React, { ReactElement } from 'react';
import { TableHead } from '@material-ui/core';
import { IReactNodeProps } from '../../../types/common.types';

export function MDXTableHead(props: IReactNodeProps): ReactElement {
  return (
    <TableHead>
      { props.children }
    </TableHead>
  );
}
