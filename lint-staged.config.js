const config = {
  '**/*.{ts,tsx,js}': [
    () => 'yarn tsc-check', // to omit list of files matched
    'yarn __eslint',
  ],
  '**/*.scss': [
    'yarn stylelint',
  ],
};

module.exports = config;
