// eslint-disable-next-line import/no-unresolved
import { Protocol } from 'playwright-core/types/protocol';

export type TCDPProtocolEvents = Protocol.Events;

export enum ECDPNetworkEvents {
  'Network.requestWillBeSent' = 'Network.requestWillBeSent',
  'Network.responseReceived' = 'Network.responseReceived',
  'Network.dataReceived' = 'Network.dataReceived',
  'Network.loadingFinished' = 'Network.loadingFinished',
  'Network.loadingFailed' = 'Network.loadingFailed',
}

export type ECDPNetworkEventsKeys = keyof typeof ECDPNetworkEvents;

export type TCDPNetworkEvents = Pick<TCDPProtocolEvents, ECDPNetworkEventsKeys>;

export type TMimeTypeFileGroup =
  'html' | 'css' | 'js' | 'json' | 'image' | 'font' | 'other' | 'total';

export interface IEmulateNetworkConditionsParameters {
  downloadThroughput: number,
  uploadThroughput: number,
  latency: number,
  offline: boolean,
}

type TGlobal = typeof global;

/**
 * Globals set via jestConfig.globals.
 */
export interface IGlobal extends TGlobal {
  readonly url: string;
  readonly defaultTimeout: number; // ms
  readonly nodeEnv: string;
  readonly networkThrottleOptions: IEmulateNetworkConditionsParameters;
}

export interface INetworkRequest {
  dataLength: number, // dataReceived
  encodedDataLength: number, // loadingFinished
  mimeType: string,
  requestStart: number,
  responseFinish: number,
  requestId: string,
  wallTime: number,
  url: string,
}

export interface INetworkRequestEvent {
  type: ECDPNetworkEvents,
  payload: Partial<INetworkRequest>,
}

export interface ICDPNetworkEvent<T extends ECDPNetworkEventsKeys = ECDPNetworkEventsKeys> {
  type: ECDPNetworkEvents,
  payload: TCDPNetworkEvents[T],
}

export function isNetworkRequestWillBeSentEvent(
  event: ICDPNetworkEvent,
): event is ICDPNetworkEvent<'Network.requestWillBeSent'> {
  return event.type === ECDPNetworkEvents['Network.requestWillBeSent'];
}

export function isNetworkResponseReceivedEvent(
  event: ICDPNetworkEvent,
): event is ICDPNetworkEvent<'Network.responseReceived'> {
  return event.type === ECDPNetworkEvents['Network.responseReceived'];
}

export function isNetworkDataReceivedEvent(
  event: ICDPNetworkEvent,
): event is ICDPNetworkEvent<'Network.dataReceived'> {
  return event.type === ECDPNetworkEvents['Network.dataReceived'];
}

export function isNetworkLoadingFinishedEvent(
  event: ICDPNetworkEvent,
): event is ICDPNetworkEvent<'Network.loadingFinished'> {
  return event.type === ECDPNetworkEvents['Network.loadingFinished'];
}

export function isNetworkLoadingFailedEvent(
  event: ICDPNetworkEvent,
): event is ICDPNetworkEvent<'Network.loadingFailed'> {
  return event.type === ECDPNetworkEvents['Network.loadingFailed'];
}

export interface INetworkRequestsReport {
  totalRequests: number;
  totalEncodedSize: number;
  totalDecodedSize: number;
  totalLoadDuration: number;
  largestRequestDecoded: Partial<INetworkRequest>;
  largestRequestDecodedSize: number;
  largestRequestEncoded: Partial<INetworkRequest>;
  largestRequestEncodedSize: number;
  longestRequest: Partial<INetworkRequest>;
  groups: Partial<Record<TMimeTypeFileGroup, INetworkRequest[]>> | null;
}
