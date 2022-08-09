export enum ScreenWidth {
  sm = 600,
  md = 960,
  lg = 1280,
}

export const networkThrottleOptions = {
  downloadThroughput: 1000 * 1000, // 1Mb/s
  uploadThroughput: 512 * 1000,
  latency: 150,
  offline: false,
};
