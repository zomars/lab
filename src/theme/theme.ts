// originally from
// https://github.com/system-ui/theme-ui/blob/develop/packages/preset-tailwind/src/index.ts
// with quite a bit of customization


// Have to match SCSS variables! No export here, sorry
export const breakpoints = {
  xs: 0,
  sm: 600,
  md: 960,
  blogPostMd: 1060, // three columns: 50 + 960 + 50
  lg: 1280,
  xl: 1920,
};

export const fontSize = 16; // px

export const headerFontFamily = [
  'Merriweather',
  'serif',
];

export const bodyFontFamily = [
  'Source Sans Pro',
  'sans-serif',
];

// rems
export const fontSizes = [
  0.75,
  0.875,
  1,
  1.1,
  1.25,
  1.5, // 5th
  1.75,
  2.125,
  3,
  3.75,
  4.5, // 10th
  6,
];

export const lineHeights = {
  none: 1,
  tight: 1.25,
  snug: 1.375,
  normal: 1.5,
  relaxed: 1.625,
  loose: 2,
  body: 1.53,
  heading: 1.1,
};

export const fontWeights = {
  hairline: 100,
  thin: 200,
  light: 300,
  normal: 400,
  body: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  heading: 700,
  extrabold: 800,
  black: 900,
};

const sourceColors: Record<string, string[]> = {
  grey: [
    '#f7fafc',
    '#edf2f7',
    '#e2e8f0',
    '#cbd5e0',
    '#a0aec0',
    '#718096',
    '#4a5568',
    '#2d3748',
    '#1a202c',
  ],
  red: [
    '#fff5f5',
    '#fed7d7',
    '#feb2b2',
    '#fc8181',
    '#f56565',
    '#e53e3e',
    '#c53030',
    '#9b2c2c',
    '#742a2a',
  ],
  orange: [
    '#fffaf0',
    '#feebc8',
    '#fbd38d',
    '#f6ad55',
    '#ed8936',
    '#dd6b20',
    '#c05621',
    '#9c4221',
    '#7b341e',
  ],
  yellow: [
    '#fffff0',
    '#fefcbf',
    '#faf089',
    '#f6e05e',
    '#ecc94b',
    '#d69e2e',
    '#b7791f',
    '#975a16',
    '#744210',
  ],
  green: [
    '#f0fff4',
    '#c6f6d5',
    '#9ae6b4',
    '#68d391',
    '#48bb78',
    '#38a169',
    '#2f855a',
    '#276749',
    '#22543d',
  ],
  teal: [
    '#e6fffa',
    '#b2f5ea',
    '#81e6d9',
    '#4fd1c5',
    '#38b2ac',
    '#319795',
    '#2c7a7b',
    '#285e61',
    '#234e52',
  ],
  blue: [
    '#ebf8ff',
    '#bee3f8',
    '#90cdf4',
    '#63b3ed',
    '#4299e1',
    '#3182ce',
    '#2b6cb0',
    '#2c5282',
    '#2a4365',
  ],
  indigo: [
    '#ebf4ff',
    '#c3dafe',
    '#a3bffa',
    '#7f9cf5',
    '#667eea',
    '#5a67d8',
    '#4c51bf',
    '#434190',
    '#3c366b',
  ],
  purple: [
    '#faf5ff',
    '#e9d8fd',
    '#d6bcfa',
    '#b794f4',
    '#9f7aea',
    '#805ad5',
    '#6b46c1',
    '#553c9a',
    '#44337a',
  ],
  pink: [
    '#fff5f7',
    '#fed7e2',
    '#fbb6ce',
    '#f687b3',
    '#ed64a6',
    '#d53f8c',
    '#b83280',
    '#97266d',
    '#702459',
  ],
};

sourceColors.gray = sourceColors.grey;

export type TThemeColorSet = Record<string, string>;

export const colors: Record<string, TThemeColorSet> = {};

Object.entries(sourceColors)
  .forEach(([colorName, colorsList]) => {
    const hash: Record<string, string> = {};

    colorsList.forEach((hex, index) => {
      hash[100 * (index + 1)] = hex;
    });

    colors[colorName] = hash;
  });

export const primaryColor = colors.blue[700];
export const secondaryColor = colors.red[700];
export const textColor = colors.grey[800];
export const mutedColor = colors.grey[300];
export const mutedTextColor = colors.grey[600];

export const sizes = [
  0,
  1,
  2,
  4,
  8,
  16,
  20, // 6th
  24,
  32,
  48,
  64, // 10th
  80,
  96,
]; // in px

export const customSizes = {
  px: 1,
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 20,
  xl: 48,
  xxl: 96,
}; // in px

export const borderWidths = [
  0,
  1,
  2,
  4,
  8,
];

// border-radius
export const radii = {
  none: 0,
  sm: 0.125 * fontSize,
  default: 0.25 * fontSize,
  md: 0.25 * fontSize,
  lg: 0.5 * fontSize,
};
