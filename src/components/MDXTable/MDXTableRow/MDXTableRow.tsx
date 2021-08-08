import React, { ReactElement } from 'react';
import { TableRow } from '@material-ui/core';
import { IReactNodeProps } from '../../../types/common.types';

export function MDXTableRow(props: IReactNodeProps): ReactElement {
  return (
    <TableRow>
      { props.children }
    </TableRow>
  );
}
