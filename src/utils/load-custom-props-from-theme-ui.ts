import { merge, forEach } from 'lodash';
// @ts-ignore-next-line
import { toTheme } from '@theme-ui/typography';
// @ts-ignore-next-line
import { tailwind } from '@theme-ui/presets';
import { options as typographyOptions } from './typography';

export type TCssPropValue = string|number;

const themeUITypography = toTheme(typographyOptions);

const themeWoStyles = merge(
  tailwind,
  themeUITypography,
);

export const customCssPropsMap = new Map<string, TCssPropValue>();

forEach(
  themeWoStyles.colors as Record<string, TCssPropValue|TCssPropValue[]>,
  (value: TCssPropValue|TCssPropValue[], key: string) => {
    if (typeof value === 'string') {
      customCssPropsMap.set(`color-${key}`, value);
    } else if (Array.isArray(value)) {
      value.forEach((color: TCssPropValue|null, index: number) => {
        if (color !== null) {
          customCssPropsMap.set(`color-${ key }-${ index }`, color);
        }
      });
    }
  });

forEach(
  themeWoStyles.sizes,
  (value: TCssPropValue, key: string) => {
    if (key.includes('/')) {
      key = key.replace('/', '-');
    }

    customCssPropsMap.set(`size-${key}`, value);
  });


forEach(
  themeWoStyles.borderWidths,
  (value: TCssPropValue, key: string) => {
    customCssPropsMap.set(`border-width-${key}`, value);
  });

forEach(
  themeWoStyles.fonts,
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
  themeWoStyles.lineHeights,
  (value: TCssPropValue, key: string) => {
    customCssPropsMap.set(`line-height-${key}`, value);
  });

forEach(
  themeWoStyles.fontWeights,
  (value: TCssPropValue, key: string) => {
    customCssPropsMap.set(`font-weight-${key}`, value);
  });
