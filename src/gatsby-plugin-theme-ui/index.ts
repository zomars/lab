import { merge } from 'lodash';
import { Theme } from 'theme-ui';
// @ts-ignore-next-line
import { toTheme } from '@theme-ui/typography';
import makeCustomProperties from '@theme-ui/custom-properties';
// @ts-ignore-next-line
import { tailwind } from '@theme-ui/presets';

import { options as typographyOptions } from '../utils/typography';

const styles = {} as Record<string, Record<string, any>>;

// setting default styles for non-MDX content
['h1', 'h2', 'h3', 'h4', 'h5', 'h6']
  .forEach((header) => {
    styles[header] = {
      color: 'primary',
      marginBottom: 2,
    };
  });

styles.h1.mt = 3;

styles.p = {
  marginBottom: 2,
};

styles.hr = {
  borderColor: 'gray.4',
  mb: 2,
};

styles.blockquote = {
  color: 'textMuted',
  borderLeftWidth: 4,
  borderLeftStyle: 'solid',
  borderColor: 'gray.4',
  paddingLeft: 2,
};

const themeUITypography = toTheme(typographyOptions);

const themeWoStyles = merge(
  tailwind,
  themeUITypography,
);

// apparently `styles` make it into custom properties export
const allCustomProps = makeCustomProperties(themeWoStyles, 'theme-ui');

const validCustomProps = {};

// filtering invalid keys, there is a bunch of invalid values as well
// which we leave in for now
Object.keys(allCustomProps).forEach((key: string) => {
  if (key.includes('/') || key.includes('&')) {
    return;
  }

  validCustomProps[key] = allCustomProps[key];
});

// exporting custom properties into HTML through style element
styles.root = {
  ...validCustomProps,
};

const theme = merge(
  themeWoStyles,
  { styles },
);

// eslint-disable-next-line import/no-default-export
export default theme as Theme;
