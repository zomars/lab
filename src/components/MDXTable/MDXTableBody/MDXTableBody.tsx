import React, { ReactElement } from 'react';
import { TableBody } from '@material-ui/core';
import { IReactNodeProps } from '../../../types/common.types';

export function MDXTableBody(props: IReactNodeProps): ReactElement {
  return (
    <TableBody>
      { props.children }
    </TableBody>
  );
}
