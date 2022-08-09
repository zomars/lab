const OFF = 0;

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
];

config.globals = {
  graphql: false,
};

config.parserOptions = {
  sourceType: 'module',
  ecmaFeatures: {
    ecmaVersion: 2019,
    jsx: true,
  },
};

const e2eTestOverrides = {
  files: [
    'e2e-tests/**/*.ts',
    'src/**/*.e2e.ts',
    'src/**/*.e2e.spec.ts',
  ],
  extends: [
    'plugin:rxjs/recommended',
    'plugin:playwright/playwright-test',
  ],
  rules: {
    'playwright/no-skipped-test': OFF,
    'playwright/no-element-handle': OFF,
    'playwright/no-conditional-in-test': OFF,
  },
  parserOptions: {
    ecmaVersion: 2019,
    project: 'tsconfig.pw.json',
  },
};

config.overrides = [
  e2eTestOverrides,
];

module.exports = config;
