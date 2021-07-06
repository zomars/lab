import { createTheme } from '@material-ui/core/styles';
import {
  bodyFontFamily,
  breakpoints,
  colors,
  headerFontFamily,
} from './theme';

const headerFontFamilyList = headerFontFamily.join(', ');

const headers = {};

['h1', 'h2', 'h3', 'h4', 'h5', 'h6']
  .forEach((headerType: string) => {
    headers[headerType] = {
      fontFamily: headerFontFamilyList,
      fontWeight: 600,
    };
  });

const typography = {
  fontFamily: bodyFontFamily.join(', '),
  ...headers,
  button: {
    fontWeight: 600,
    fontSize: '1.1rem',
  },
};

export const theme = createTheme({
  palette: {
    // @todo: pass primary color
    ...colors,
  },
  typography,
  breakpoints: {
    values: breakpoints,
  },
  shape: {
    borderRadius: 4, // radii.md
  },
});
