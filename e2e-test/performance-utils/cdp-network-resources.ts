import { CDPSession } from 'playwright';

export interface INetworkRequestInfo {
  dataLength: number, // dataReceived
  encodedDataLength: number, // loadingFinished
  mimeType: string,
  requestStart: number,
  responseFinish: number,
  requestId: string,
  wallTime: number,
  url: string,
}

interface INetworkEventPayload {
  requestId: string,
}

interface INetworkRequestWillBeSent extends INetworkEventPayload {
  request: {
    url: string,
  },
  timestamp: number,
  wallTime: number,
}

interface INetworkDataResponseReceivedPayload extends INetworkEventPayload {
  response: {
    mimeType: string,
  },
}

interface INetworkDataReceivedPayload extends INetworkEventPayload {
  dataLength: number,
}

interface INetworkLoadingFinishedPayload extends INetworkEventPayload {
  encodedDataLength: number,
  timestamp: number;
}

enum ENetworkEvents {
  requestWillBeSent = 'Network.requestWillBeSent',
  responseReceived = 'Network.responseReceived',
  dataReceived = 'Network.dataReceived',
  loadingFinished = 'Network.loadingFinished',
  loadingFailed = 'Network.loadingFailed',
}

/**
 * Capture all network requests till explicitly stopped.
 * Keep the Map of requests parsed as well as a number of currently open connections.
 */
export class NetworkRequestsCdpInterceptor {
  private readonly session: CDPSession;

  private readonly requestsMap = new Map<string, INetworkRequestInfo>();

  private openConnections = 0;

  private stopped = false;

  constructor(cdpSession: CDPSession) {
    this.session = cdpSession;
    this.start();
  }

  public get hasOpenConnections(): boolean {
    return this.openConnections > 0;
  }

  public get requests(): Map<string, INetworkRequestInfo> {
    return this.requestsMap;
  }

  public stop(): void {
    if (this.stopped) {
      return;
    }

    this.stopped = true;

    const { session } = this;

    session.off(ENetworkEvents.requestWillBeSent, this.requestWillBeSentHandler);
    session.off(ENetworkEvents.responseReceived, this.responseReceivedHandler);
    session.off(ENetworkEvents.dataReceived, this.dataReceivedHandler);
    session.off(ENetworkEvents.loadingFinished, this.loadingFinishedHandler);
    session.off(ENetworkEvents.loadingFailed, this.loadingFailedHandler);
  }

  private start(): void {
    this.stopped = false;

    this.openConnections = 0;
    this.requestsMap.clear();

    const { session } = this;

    session.on(ENetworkEvents.requestWillBeSent, this.requestWillBeSentHandler);
    session.on(ENetworkEvents.responseReceived, this.responseReceivedHandler);
    session.on(ENetworkEvents.dataReceived, this.dataReceivedHandler);
    session.on(ENetworkEvents.loadingFinished, this.loadingFinishedHandler);
    session.on(ENetworkEvents.loadingFailed, this.loadingFailedHandler);
  }

  private requestWillBeSentHandler = (payload: INetworkRequestWillBeSent): void => {
    if (this.stopped) {
      return;
    }

    const {
      requestId,
      request: {
        url,
      },
      wallTime,
      timestamp,
    } = payload;

    this.requestsMap.set(requestId, {
      requestId,
      url,
      dataLength: 0,
      encodedDataLength: 0,
      requestStart: timestamp,
      responseFinish: +Infinity,
      wallTime,
    } as INetworkRequestInfo);

    this.openConnections++;
  };

  private loadingFailedHandler = (): void => {
    if (this.stopped) {
      return;
    }

    this.openConnections--;
  };

  private responseReceivedHandler = (payload: INetworkDataResponseReceivedPayload): void => {
    if (this.stopped) {
      return;
    }

    const {
      requestId,
      response: {
        mimeType,
      },
    } = payload;

    const connection = this.requestsMap.get(requestId);

    connection.mimeType = mimeType;
  };

  private dataReceivedHandler = (payload: INetworkDataReceivedPayload): void => {
    if (this.stopped) {
      return;
    }

    const { requestId } = payload;

    const connection = this.requestsMap.get(requestId);

    connection.dataLength += payload.dataLength;
  };

  private loadingFinishedHandler = (payload: INetworkLoadingFinishedPayload): void => {
    if (this.stopped) {
      return;
    }

    const {
      encodedDataLength,
      requestId,
    } = payload;

    const connection = this.requestsMap.get(requestId);

    connection.encodedDataLength = encodedDataLength;
    connection.responseFinish = payload.timestamp;

    this.openConnections--;
  };
}
