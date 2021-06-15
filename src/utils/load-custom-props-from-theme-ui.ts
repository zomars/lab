import { merge, forEach } from 'lodash';
// @ts-ignore-next-line
import { toTheme } from '@theme-ui/typography';
// @ts-ignore-next-line
import { tailwind } from '@theme-ui/presets';
import {
  colors,
  customSizes,
  primaryColor,
  mutedColor,
  mutedTextColor,
  sizes,
} from '../theme';

import { options as typographyOptions } from './typography';

export type TCssPropValue = string|number;

const themeUITypography = toTheme(typographyOptions);

const themeWoStyles = merge(
  tailwind,
  themeUITypography,
);

export const customCssPropsMap = new Map<string, TCssPropValue>();

forEach(
  colors,
  (colorHexHash: Record<string, string>, colorName: string) => {
    forEach(
      colorHexHash, (value: string, key: string) => {
        customCssPropsMap.set(`color-${ colorName }-${ key }`, value);
      });
  });

customCssPropsMap.set('color-muted', mutedColor);
customCssPropsMap.set('color-muted-text', mutedTextColor);
customCssPropsMap.set('color-primary', primaryColor);

sizes.forEach((size: number, index: number) => {
  customCssPropsMap.set(`size-${ index }`, `${ size }px`);
});

forEach(
  customSizes,
  (size: number, key: string) => {
    customCssPropsMap.set(`size-${ key }`, `${ size }px`);
  }
);

forEach(
  themeWoStyles.borderWidths as Record<string, TCssPropValue>,
  (value: TCssPropValue, key: string) => {
    customCssPropsMap.set(`border-width-${key}`, value);
  });

forEach(
  themeWoStyles.fonts as Record<string, TCssPropValue>,
  (value: TCssPropValue, key: string) => {
    customCssPropsMap.set(`font-${key}`, value);
  });

forEach(
  themeWoStyles.fontSizes,
  (value: TCssPropValue, key: number) => {
    if (typeof value === 'number') {
      value = `${value}px`;
    }

    customCssPropsMap.set(`font-size-${key}`, value);
  });

forEach(
  themeWoStyles.lineHeights as Record<string, TCssPropValue>,
  (value: TCssPropValue, key: string) => {
    customCssPropsMap.set(`line-height-${key}`, value);
  });

forEach(
  themeWoStyles.fontWeights as Record<string, TCssPropValue>,
  (value: TCssPropValue, key: string) => {
    customCssPropsMap.set(`font-weight-${key}`, value);
  });
