/**
 * There are two modes for e2e testing:
 *   - "dev" for running against local server
 *   - "ci" for running from PR check
 *   - todo add "production"
 **/

/**
 * To be read and set by the every test file(!) via context.setDefaultTimeout
 * Default Playwright timeout is 30 seconds.
*/
const defaultTimeout = 10000;

const jestPlaywrightOptions = {
  launchOptions: {
    headless: true,
    devtools: false,
    args: [
      '--ignore-certificate-errors',
    ],
    timeout: 10000, // this is only browser spin-up timeout
  },
  contextOptions: {
    ignoreHTTPSErrors: true,
    viewport: {
      width: 1280,
      height: 800,
    },
  },
  connectOptions: {
    // slowMo: 350,
  },
  browsers: [
    'chromium',
    // 'firefox',
  ],
  devices: [],
};

const tsJestConfig = {
  tsconfig: 'tsconfig.e2e.json',
};

// production
let hostname = 'localhost:9000';
let protocol = 'http';

const networkThrottleOptions = {
  downloadThroughput: 1000 * 1000, // 1Mb/s
  uploadThroughput: 512 * 1000,
  latency: 150,
  offline: false,
};

const globals = {
  defaultTimeout,
  'ts-jest': tsJestConfig,
  networkThrottleOptions,
};

const testPathIgnorePatterns = [
  '/node_modules/',
];

const {
  NODE_ENV: env,
  pr_id: prId,
  TEST_PUBLIC: testPublic,
} = process.env;

globals.nodeEnv = env;

if (env === 'development') {
  hostname = 'localhost:8000';
  protocol = 'http';

  testPathIgnorePatterns.push('/performance/');
} else if (prId) {
  // github action run
  hostname = `pr${ prId }--amlab.netlify.app`;
  protocol = 'https';
} else if (testPublic) {
  // test publicly deployed production version
  hostname = 'lab.amalitsky.com';
  protocol = 'https';
}

globals.url = `${ protocol }://${ hostname }`;

console.log(`Testing url: ${globals.url}`);

const jestConfig = {
  testMatch: [
    '**/*.e2e.spec.ts',
  ],
  testPathIgnorePatterns,
  preset: 'jest-playwright-preset',
  transform: {
    '\\.ts$': 'ts-jest',
  },
  testEnvironmentOptions: {
    'jest-playwright': jestPlaywrightOptions,
  },
  // has to be higher than playwright's
  testTimeout: defaultTimeout * 3,
  globals,
  setupFilesAfterEnv: [
    'expect-playwright',
  ],
};

module.exports = jestConfig;
