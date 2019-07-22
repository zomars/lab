import Typography from 'typography';
import wikiThemeConfig from 'typography-theme-wikipedia';

const fonts = [{
  name: 'EB Garamond',
  styles: [
    '400',
    '500',
    '700'
  ],
}, {
  name: 'Open Sans',
  styles: [
    '300',
    '400',
    '700',
  ]
}];

const overrideThemeStyles = {
  a: {
    color: 'unset',
  },
  'a:visited': {
    textDecoration: 'none',
    color: 'unset',
  },
  'a:hover': {
    textDecoration: 'none',
    color: 'unset',
  },
};

const config = {
  googleFonts: fonts,
  headerFontFamily: [
    'EB Garamond',
    'serif'
  ],
  bodyFontFamily: [
    'Open Sans',
    'sans-serif'
  ],
  overrideThemeStyles: () => overrideThemeStyles,
};

Object.assign(wikiThemeConfig, config);

const typography = new Typography(wikiThemeConfig);

// Hot reload typography in development.
if (process.env.NODE_ENV !== `production`) {
  typography.injectStyles()
}

export default typography;
export const rhythm = typography.rhythm;
export const scale = typography.scale;
