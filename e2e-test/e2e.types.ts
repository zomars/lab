type TGlobal = typeof global;

/**
 * Globals set via jestConfig.globals.
 */
export interface IGlobal extends TGlobal {
  readonly url: string;
  readonly defaultTimeout: number; // ms
  readonly nodeEnv: string;
}
