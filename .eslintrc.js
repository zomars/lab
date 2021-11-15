/* eslint-disable @typescript-eslint/no-var-requires */
const { rules: namingRules } = require('./naming.eslintrc');
const { rules: reactRules } = require('./react.eslintrc');
const { rules: newlineRules } = require('./newline.eslintrc');

const OFF = 0;
const WARN = 1;
const ERROR = 2;

const ALWAYS = 'always';
const NEVER = 'never';

const settings = {
  react: {
    version: 'detect',
  },
};

const defaultsOverrides = {
  'valid-jsdoc': OFF,
  'react/prop-types': OFF,
  // doesn't seem to support arrow function methods
  'no-invalid-this': OFF,
  indent: OFF, // in favor of @typescript-eslint/indent
  camelcase: OFF, // in favor of @typescript-eslint/naming-convention
  'require-jsdoc': [
    WARN,
    {
      require: {
        FunctionDeclaration: true,
        MethodDefinition: true,
      },
    },
  ],
  'max-len': [
    ERROR,
    {
      code: 100,
      tabWidth: 2,
      ignoreUrls: true,
    },
  ],
};

const importRules = {
  'import/prefer-default-export': OFF,
  'import/no-default-export': ERROR,
  'import/order': ERROR,
  'import/no-dynamic-require': WARN,
};

const tsEslintRules = {
  '@typescript-eslint/ban-ts-comment': WARN,
  '@typescript-eslint/indent': [
    ERROR,
    2,
    {
      SwitchCase: WARN,
      FunctionDeclaration: {
        parameters: 'off',
      },
      FunctionExpression: {
        parameters: 'off',
      },
      ArrayExpression: 'off',
    },
  ],
  '@typescript-eslint/no-useless-constructor': ERROR,
  '@typescript-eslint/explicit-function-return-type': [
    ERROR, {
      allowExpressions: true,
    },
  ],
  '@typescript-eslint/explicit-member-accessibility': [
    ERROR, {
      overrides: {
        constructors: 'off',
      },
    },
  ],
  '@typescript-eslint/member-ordering': ERROR,
  '@typescript-eslint/semi': ERROR,
  '@typescript-eslint/prefer-for-of': ERROR,
  '@typescript-eslint/comma-dangle': [ERROR, 'always-multiline'],
};

const e2eTestOverrides = {
  files: [
    'e2e-test/**/*.ts',
    'src/**/*.e2e.ts',
    'src/**/*.e2e.spec.ts',
  ],
  env: {
    jest: true,
  },
  extends: [
    'plugin:jest-playwright/recommended',
    'plugin:jest/recommended',
    'plugin:jest/style',
    'plugin:rxjs/recommended',
  ],
  rules: {
    'import/no-extraneous-dependencies': [
      ERROR, {
        devDependencies: true,
      },
    ],
  },
  parserOptions: {
    ecmaVersion: 2019,
    sourceType: 'module',
    project: 'tsconfig.e2e.json',
  },
};

const rules = {
  'wrap-iife': [
    ERROR,
    'inside',
  ],
  strict: [
    ERROR,
    'function',
  ],
  'arrow-parens': [
    ERROR,
    'as-needed',
    {
      requireForBlockBody: true,
    },
  ],
  'prefer-template': ERROR,
  'object-shorthand': ERROR,
  'prefer-arrow-callback': ERROR,
  'quote-props': [
    ERROR,
    'as-needed',
  ],
  'padded-blocks': [
    ERROR,
    NEVER,
  ],
  quotes: ERROR,
  'no-cond-assign': ERROR,
  'class-methods-use-this': ERROR,
  'no-unused-vars': [
    ERROR,
    {
      vars: 'all',
      args: 'none',
      ignoreRestSiblings: true,
    },
  ],
  'no-useless-escape': ERROR,
  'prefer-rest-params': WARN,
  'no-use-before-define': [
    WARN,
    {
      classes: false,
    },
  ],
  'no-lonely-if': ERROR,
  'no-unused-expressions': WARN,
  'object-property-newline': [
    ERROR,
    {
      allowAllPropertiesOnSameLine: false,
    },
  ],
  'newline-per-chained-call': WARN,
  'no-nested-ternary': ERROR,
  eqeqeq: ERROR,
  'no-prototype-builtins': WARN,
  'array-callback-return': ERROR,
  'object-curly-spacing': [
    ERROR,
    ALWAYS,
  ],
  'no-mixed-operators': ERROR,
  'no-return-assign': ERROR,
  'no-underscore-dangle': [
    ERROR, {
      allowAfterThis: true,
      allowAfterSuper: true,
      enforceInMethodNames: true,
    },
  ],
  'dot-notation': ERROR,
  'no-multi-assign': ERROR,
  'one-var-declaration-per-line': ERROR,
  'no-useless-return': ERROR,
  'no-loop-func': ERROR,
  'prefer-numeric-literals': ERROR,
  'prefer-destructuring': [
    ERROR,
    {
      VariableDeclarator: {
        array: false,
        object: true,
      },
      AssignmentExpression: {
        array: false,
        object: false,
      },
    }, {
      enforceForRenamedProperties: false,
    },
  ],
  'implicit-arrow-linebreak': ERROR,
  'no-extra-parens': [
    ERROR,
    'all',
    {
      conditionalAssign: false,
      enforceForArrowConditionals: false,
      enforceForNewInMemberExpressions: false,
      ignoreJSX: 'multi-line',
    },
  ],
  'require-await': ERROR,
  'no-return-await': ERROR,
  'max-classes-per-file': [
    ERROR,
    1,
  ],
  'lines-between-class-members': ERROR,
  'comma-dangle': OFF, // replaced with ts rule
  'no-multiple-empty-lines': [ERROR, {
    max: 2,
    maxEOF: 0,
  }],
  ...namingRules,
  ...tsEslintRules,
  ...importRules,
  ...reactRules,
  ...newlineRules,
};

const config = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  plugins: [
    'react',
    'jest',
  ],
  globals: {
    graphql: false,
  },
  extends: [
    'eslint:recommended',
    'google',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:react-hooks/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
    ecmaFeatures: {
      ecmaVersion: 2018,
      jsx: true,
    },
  },
  rules: {
    ...defaultsOverrides,
    ...rules,
  },
  settings,
  overrides: [
    e2eTestOverrides,
  ],
};

module.exports = config;
