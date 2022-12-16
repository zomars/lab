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

const config = {
  extends: 'lighthouse:default',
  settings: {
    throttlingMethod: 'simulate',
    throttling: {
      downloadThroughputKbps: 1000 * 1000, // 1Mb/s
      uploadThroughputKbps: 512 * 1000,
      requestLatencyMs: 150,
    },
    disableStorageReset: true,
    skipAudits: ['uses-http2'],
    formFactor: 'desktop',
    screenEmulation: DESKTOP_EMULATION_METRICS,
    emulatedUserAgent: DESKTOP_USERAGENT,
  },
};

module.exports = config;
