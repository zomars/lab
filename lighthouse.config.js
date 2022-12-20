// constants copied from https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/config/constants.js
const DESKTOP_EMULATION_METRICS = {
  mobile: false,
  width: 1350,
  height: 940,
  deviceScaleFactor: 1,
  disabled: false,
};

const DESKTOP_USERAGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/98.0.4695.0 Safari/537.36 Chrome-Lighthouse';

/**
 * @see https://github.com/GoogleChrome/lighthouse#cli-options
 */
const config = {
  extends: 'lighthouse:default',
  settings: {
    throttlingMethod: 'devtools',
    throttling: {
      downloadThroughputKbps: 10 * 1000, // 10 Mbps
      throughputKbps: 10 * 1000, // simulated only
      uploadThroughputKbps: 2 * 1000, // 2 Mbps
      requestLatencyMs: 550, // supposed to equal ~150mb in real env via DebugBear
      rttMs: 550, // simulated only
    },
    disableStorageReset: true,
    skipAudits: ['uses-http2'],
    formFactor: 'desktop',
    screenEmulation: DESKTOP_EMULATION_METRICS,
    emulatedUserAgent: DESKTOP_USERAGENT,
  },
};

module.exports = config;
