import React, { ReactElement } from 'react';
import { SvgIcon } from '@mui/material';

// eslint-disable-next-line no-unused-vars
import Icon from './lighthouse-icon.import.svg';

export function LighthouseIcon(): ReactElement {
  return (
    <SvgIcon
      sx = {{ filter: 'grayscale(100%)' }}
      component = { Icon }
      viewBox = '0 0 48 48'
    />
  );
}
