type TGlobal = typeof global;

export interface IEmulateNetworkConditionsParameters {
  downloadThroughput: number,
  uploadThroughput: number,
  latency: number,
  offline: boolean,
}

/**
 * Globals set via jestConfig.globals.
 */
export interface IGlobal extends TGlobal {
  readonly url: string;
  readonly defaultTimeout: number; // ms
  readonly nodeEnv: string;
  readonly networkThrottleOptions: IEmulateNetworkConditionsParameters;
}
