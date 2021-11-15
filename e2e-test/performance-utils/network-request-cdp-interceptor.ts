import { CDPSession } from 'playwright';

import {
  ECDPNetworkEvents,
  INetworkRequest,
  TCDPNetworkEvents,
} from '../e2e.types';

import {
  parseDataReceivedEventData,
  parseLoadingFinishedEventData,
  parseRequestWillBeSentEventData,
  parseResponseReceivedEventData,
  reduceNetworkRequestData,
} from './network-request-transformers';

/**
 * Capture all network requests till explicitly stopped.
 * Keep the Map of requests parsed as well as a number of currently open connections.
 */
export class NetworkRequestCDPInterceptor {
  private readonly session: CDPSession;

  private readonly requestsMap = new Map<string, Partial<INetworkRequest>>();

  private openConnections = 0;

  private stopped = false;

  constructor(cdpSession: CDPSession) {
    this.session = cdpSession;
    this.start();
  }

  public get hasOpenConnections(): boolean {
    return this.openConnections > 0;
  }

  public get requests(): Map<string, Partial<INetworkRequest>> {
    return this.requestsMap;
  }

  public stop(): void {
    if (this.stopped) {
      return;
    }

    this.stopped = true;

    const { session } = this;

    session.off('Network.requestWillBeSent', this.requestWillBeSentHandler);
    session.off('Network.responseReceived', this.responseReceivedHandler);
    session.off('Network.dataReceived', this.dataReceivedHandler);
    session.off('Network.loadingFinished', this.loadingFinishedHandler);
    session.off('Network.loadingFailed', this.loadingFailedHandler);
  }

  private start(): void {
    this.stopped = false;

    this.openConnections = 0;
    this.requestsMap.clear();

    const { session } = this;

    session.on('Network.requestWillBeSent', this.requestWillBeSentHandler);
    session.on('Network.responseReceived', this.responseReceivedHandler);
    session.on('Network.dataReceived', this.dataReceivedHandler);
    session.on('Network.loadingFinished', this.loadingFinishedHandler);
    session.on('Network.loadingFailed', this.loadingFailedHandler);
  }

  private requestWillBeSentHandler = (
    payload: TCDPNetworkEvents['Network.requestWillBeSent'],
  ): void => {
    if (this.stopped) {
      return;
    }

    const { requestId } = payload;
    const request = parseRequestWillBeSentEventData(payload);

    this.requestsMap.set(
      requestId,
      reduceNetworkRequestData({}, {
        type: ECDPNetworkEvents['Network.requestWillBeSent'],
        payload: request,
      }),
    );

    this.openConnections++;
  };

  private loadingFailedHandler = (): void => {
    if (this.stopped) {
      return;
    }

    this.openConnections--;
  };

  private responseReceivedHandler = (
    payload: TCDPNetworkEvents['Network.responseReceived'],
  ): void => {
    if (this.stopped) {
      return;
    }

    const { requestId } = payload;

    const request = this.requestsMap.get(requestId);
    const update = parseResponseReceivedEventData(payload);

    this.requestsMap.set(
      requestId,
      reduceNetworkRequestData(request, {
        type: ECDPNetworkEvents['Network.responseReceived'],
        payload: update,
      }),
    );
  };

  private dataReceivedHandler = (
    payload: TCDPNetworkEvents['Network.dataReceived'],
  ): void => {
    if (this.stopped) {
      return;
    }

    const { requestId } = payload;

    const request = this.requestsMap.get(requestId);
    const update = parseDataReceivedEventData(payload);

    this.requestsMap.set(
      requestId,
      reduceNetworkRequestData(request, {
        type: ECDPNetworkEvents['Network.dataReceived'],
        payload: update,
      }),
    );
  };

  private loadingFinishedHandler = (
    payload: TCDPNetworkEvents['Network.loadingFinished'],
  ): void => {
    if (this.stopped) {
      return;
    }

    const { requestId } = payload;

    const request = this.requestsMap.get(requestId);
    const update = parseLoadingFinishedEventData(payload);

    this.requestsMap.set(
      requestId,
      reduceNetworkRequestData(request, {
        type: ECDPNetworkEvents['Network.loadingFinished'],
        payload: update,
      }),
    );

    this.openConnections--;
  };
}
