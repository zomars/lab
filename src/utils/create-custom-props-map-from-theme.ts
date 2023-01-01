import { forEach } from 'lodash';
import {
  bodyFontFamily,
  borderWidths,
  colors,
  customSizes,
  fontSize,
  fontSizes,
  fontWeights,
  headerFontFamily,
  lineHeights,
  mutedColor,
  mutedTextColor,
  primaryColor,
  radii,
  secondaryColor,
  sizes,
  textColor,
} from '../theme/theme';

export type TCssPropValue = string|number;

export const customCssPropsMap = new Map<string, TCssPropValue>();

// single props
customCssPropsMap.set('color-muted', mutedColor.toUpperCase());
customCssPropsMap.set('color-text', textColor.toUpperCase());
customCssPropsMap.set('color-muted-text', mutedTextColor.toUpperCase());
customCssPropsMap.set('color-primary', primaryColor.toUpperCase());
customCssPropsMap.set('color-secondary', secondaryColor.toUpperCase());
customCssPropsMap.set('font-body', bodyFontFamily.join(', '));
customCssPropsMap.set('font-heading', headerFontFamily.join(', '));
customCssPropsMap.set('font-size-body', `${ fontSize }px`);

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
    customCssPropsMap.set(`font-weight-${key}`, value);
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
