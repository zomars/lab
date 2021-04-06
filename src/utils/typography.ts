// @ts-ignore
import usWebDesignStandards from 'typography-theme-us-web-design-standards';

import { merge } from 'lodash';

export const options = merge(
  usWebDesignStandards,
  {
    baseFontSize: 18,
    includeNormalize: false,
  },
);
