const ERROR = 2;

const config = {
  extends: [
    'eslint:recommended',
    'google',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'amalitsky/recommended',
    'amalitsky/imports',
    'amalitsky/naming',
    'amalitsky/newlines',
    'amalitsky/react',
  ],
};

config.env = {
  browser: true,
  es6: true,
  node: true,
};

config.plugins = [
  'react',
  'jest',
];

config.globals = {
  graphql: false,
};

config.parserOptions = {
  sourceType: 'module',
  ecmaFeatures: {
    ecmaVersion: 2018,
    jsx: true,
  },
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

config.overrides = [
  e2eTestOverrides,
];

module.exports = config;
