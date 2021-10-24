// eslint-disable-next-line @typescript-eslint/no-var-requires
const orderedPropertyHash = require('css-property-sort-order-smacss');

/** @type {string[]} List of CSS properties */
const orderedPropertyList = [];

Object.values(orderedPropertyHash).forEach((listOrListOfLists) => {
  listOrListOfLists.forEach((propertyOrList) => {
    if (Array.isArray(propertyOrList)) {
      orderedPropertyList.push(...propertyOrList);
    } else {
      orderedPropertyList.push(propertyOrList);
    }
  });
});

const always = 'always';
const never = 'never';
const alwaysSingleLine = 'always-single-line';
const OFF = null;

const typeOrder = [
  'at-variables',
  'dollar-variables',
  'custom-properties',
  'declarations',
  'rules',
  'at-rules',
];

/** @type {Object} Stylelint config object */
const config = {
  extends: [
    'stylelint-config-standard-scss',
  ],
  plugins: [
    'stylelint-order',
  ],
  ignoreFiles: [],
  rules: {
    'at-rule-no-unknown': OFF,
    'at-rule-empty-line-before': [
      'always', {
        except: ['first-nested'],
        ignore: [
          'after-comment',
          'blockless-after-blockless',
        ],
        ignoreAtRules: ['if', 'else'],
      },
    ],
    indentation: [
      2, {
        ignore: ['inside-parens'],
      },
    ],
    'order/order': typeOrder,
    'order/properties-order': orderedPropertyList,
    'string-quotes': 'single',
    'length-zero-no-unit': true,
    'max-empty-lines': 2,
    'max-line-length': 120,
    'no-eol-whitespace': true,
    'no-missing-end-of-source-newline': true,
    'unit-case': 'lower',
    'color-hex-case': 'upper',
    'color-hex-length': 'short',
    linebreaks: 'unix',
    'selector-type-no-unknown': OFF,
    'no-descending-specificity': OFF,
    'font-family-name-quotes': OFF,
    'function-url-quotes': never,
    'declaration-colon-space-after': always,
    'declaration-colon-space-before': never,
    // 'declaration-block-semicolon-newline-after': always, - buggy
    'block-closing-brace-newline-after': always,
    'selector-combinator-space-before': always,
    'selector-combinator-space-after': always,
    'no-empty-first-line': true,
    'rule-empty-line-before': [
      'always-multi-line', {
        except: ['first-nested'],
        ignore: ['after-comment'],
      },
    ],
    'value-no-vendor-prefix': true,
    'property-no-vendor-prefix': true,
    'at-rule-no-vendor-prefix': true,
    'block-opening-brace-space-before': always,
    'declaration-block-semicolon-newline-before': 'never-multi-line',
    'value-list-comma-space-after': alwaysSingleLine,
    'selector-list-comma-space-before': never,
    'selector-list-comma-space-after': alwaysSingleLine,
    'function-comma-space-after': alwaysSingleLine,
    'selector-max-empty-lines': 0,
    'function-max-empty-lines': 0,
    'value-list-max-empty-lines': 0,
    'declaration-empty-line-before': [
      never, {
        ignore: ['after-comment'],
      },
    ],
    'declaration-block-no-duplicate-properties': true,
    'declaration-block-no-duplicate-custom-properties': true,
    'selector-class-pattern': OFF,
    'scss/at-mixin-pattern': OFF,
    'selector-list-comma-newline-after': OFF,
  },
};

module.exports = config;
