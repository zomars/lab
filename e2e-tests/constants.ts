export enum ScreenWidth {
  sm = 600,
  md = 960,
  lg = 1280,
}

// better match the LHCI config
export const networkThrottleOptions = {
  downloadThroughput: 10 * 1000 * 1000, // bytes/sec
  uploadThroughput: 2 * 1000 * 1000,
  latency: 550, // supposed to be ~150ms in real life
  offline: false,
};
