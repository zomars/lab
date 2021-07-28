/**
 * @fileoverview
 * Here we are making runtime-styling through material theme aware of our own theme.
 * So that stuff rendered by it matches our own styling.
 */

import { createTheme } from '@material-ui/core/styles';
import {
  bodyFontFamily,
  breakpoints,
  colors,
  customSizes,
  fontSize,
  fontSizes,
  fontWeights,
  headerFontFamily, lineHeights,
  primaryColor,
  radii,
} from './theme';

const headerFontFamilyList = headerFontFamily.join(', ');

const headers = {};

['h1', 'h2', 'h3', 'h4', 'h5', 'h6']
  .forEach((headerType: string) => {
    headers[headerType] = {
      fontFamily: headerFontFamilyList,
      fontWeight: fontWeights.heading,
      lineHeight: lineHeights.heading,
      my: customSizes.md,
      color: primaryColor,
    };
  });

// might need to export header customization too

const typography = {
  fontFamily: bodyFontFamily.join(', '),
  ...headers,
  button: {
    fontWeight: fontWeights.semibold,
    fontSize: fontSizes[3] * fontSize, // px
  },
};

export const theme = createTheme({
  palette: {
    primary: {
      main: primaryColor,
    },
    ...colors,
  },
  typography,
  breakpoints: {
    values: breakpoints,
  },
  shape: {
    borderRadius: radii.md, // radii.md
  },
});
