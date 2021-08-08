import React, { ReactElement } from 'react';
import { TableCell } from '@material-ui/core';
import { IReactNodeProps } from '../../../types/common.types';

export function MDXTableCell(props: IReactNodeProps): ReactElement {
  return (
    <TableCell>
      { props.children }
    </TableCell>
  );
}
