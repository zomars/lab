import type { PlaywrightTestConfig } from '@playwright/test';

const {
  NODE_ENV: env,
  pr_id: prId,
  CI: isCiEnv,
} = process.env;

const testPathIgnorePatterns = [
  '/node_modules/',
];

// default option - local production build
let hostname = 'localhost:9000';
let protocol = 'http';

if (env === 'development') {
  hostname = 'localhost:8000';

  testPathIgnorePatterns.push('**/performance/**');
} else if (prId) {
  // github action run
  hostname = `pr-${ prId }--amlab.netlify.app`;
  protocol = 'https';
} else if (env === 'production') {
  // test publicly deployed production version
  hostname = 'lab.amalitsky.com';
  protocol = 'https';
}

const baseURL = `${ protocol }://${ hostname }`;

const config: PlaywrightTestConfig = {
  use: {
    baseURL,
    browserName: 'chromium',
    headless: true,
    viewport: {
      width: 1280,
      height: 800,
    },
    ignoreHTTPSErrors: true,
    video: 'on-first-retry',
  },
  testDir: 'pw-compiled-tests',
  snapshotDir: 'pw-test-snapshots',
  outputDir: 'pw-test-results',
  timeout: 10000, // test timeout
  workers: isCiEnv ? 2 : undefined,
  forbidOnly: !!isCiEnv,
  testIgnore: testPathIgnorePatterns,
  expect: {
    toMatchSnapshot: {
      maxDiffPixelRatio: 0.06,
    },
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.06,
    },
  },
};

// eslint-disable-next-line import/no-default-export
export default config;
