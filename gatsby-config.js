// so that we can use TS for gatsby config files

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('ts-node').register();

module.exports = require('./gatsby.config.ts');
