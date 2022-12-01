import React, { ReactElement } from 'react';
import { SvgIcon } from '@mui/material';

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
