// @ts-ignore
import usWebDesignStandards from 'typography-theme-us-web-design-standards';
// https://github.com/KyleAMathews/typography.js/blob/master/packages/typography-theme-us-web-design-standards/src/index.js

import { merge } from 'lodash';

import { fontSize } from '../theme';

export const options = merge(
  usWebDesignStandards,
  {
    baseFontSize: fontSize,
    scaleRatio: 2.4,
    includeNormalize: false,
  },
);
