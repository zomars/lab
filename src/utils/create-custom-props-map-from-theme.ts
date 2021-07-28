import { forEach } from 'lodash';
import {
  bodyFontFamily,
  borderWidths,
  colors,
  customSizes,
  fontSizes,
  fontWeights,
  headerFontFamily,
  lineHeights,
  mutedColor,
  mutedTextColor,
  primaryColor,
  radii,
  sizes,
} from '../theme';

export type TCssPropValue = string|number;

export const customCssPropsMap = new Map<string, TCssPropValue>();

// single props
customCssPropsMap.set('color-muted', mutedColor);
customCssPropsMap.set('color-muted-text', mutedTextColor);
customCssPropsMap.set('color-primary', primaryColor);
customCssPropsMap.set('font-body', bodyFontFamily.join(', '));
customCssPropsMap.set('font-heading', headerFontFamily.join(', '));

forEach(
  colors,
  (colorHexHash: Record<string, string>, colorName: string) => {
    forEach(
      colorHexHash, (value: string, key: string) => {
        customCssPropsMap.set(
          `color-${ colorName }-${ key }`,
          value.toUpperCase(),
        );
      });
  });

sizes.forEach((size: number, index: number) => {
  customCssPropsMap.set(`size-${ index }`, `${ size }px`);
});

forEach(
  customSizes,
  (size: number, key: string) => {
    customCssPropsMap.set(`size-${ key }`, `${ size }px`);
  },
);

forEach(
  lineHeights,
  (value: TCssPropValue, key: string) => {
    customCssPropsMap.set(`line-height-${key}`, value);
  },
);

forEach(
  fontWeights,
  (value: TCssPropValue, key: string) => {
    customCssPropsMap.set(`line-weight-${key}`, value);
  },
);

fontSizes.forEach(
  (value: TCssPropValue, index: number) => {
    customCssPropsMap.set(`font-size-${ index }`, `${ value }rem`);
  },
);

forEach(
  radii,
  (value: TCssPropValue, key: string) => {
    customCssPropsMap.set(`radii-${key}`, `${ value }px`);
  },
);

borderWidths.forEach(
  (value: TCssPropValue, index: number) => {
    customCssPropsMap.set(`border-width-${ index }`, `${ value }px`);
  },
);
