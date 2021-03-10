import { merge } from 'lodash';
import { Theme } from 'theme-ui';
import { toTheme } from '@theme-ui/typography';
import { tailwind } from '@theme-ui/presets'

import { options as typographyOptions } from '../utils/typography';

const styles = {
  p: {
    fontStyle: 'italic', // test only
  }
};

['h1', 'h2', 'h3', 'h4', 'h5', 'h6']
  .forEach(header => {
    styles[header] = {
      color: 'primary',
      fontFamily: '',
    }
  });

const themeUITypography = toTheme(typographyOptions);

const theme = merge(
  tailwind,
  themeUITypography,
  { styles },
);

export default theme as Theme;
