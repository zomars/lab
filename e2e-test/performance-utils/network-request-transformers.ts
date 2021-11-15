import {
  ICDPNetworkEvent,
  INetworkRequest,
  INetworkRequestEvent,
  isNetworkDataReceivedEvent,
  isNetworkLoadingFailedEvent,
  isNetworkLoadingFinishedEvent,
  isNetworkRequestWillBeSentEvent,
  isNetworkResponseReceivedEvent,
  TCDPNetworkEvents,
  TCDPProtocolEvents,
} from '../e2e.types';

/**
 * Return true when termination event is passed.
 */
export function isTerminationNetworkEvent(event: ICDPNetworkEvent): boolean {
  return isNetworkLoadingFailedEvent(event) || isNetworkLoadingFinishedEvent(event);
}

export function parseRequestWillBeSentEventData(
  payload: TCDPProtocolEvents['Network.requestWillBeSent'],
): Partial<INetworkRequest> {
  const {
    requestId,
    request: {
      url,
    },
    wallTime,
    timestamp,
  } = payload;

  return {
    requestId,
    url,
    dataLength: 0,
    encodedDataLength: 0,
    requestStart: timestamp,
    responseFinish: +Infinity,
    wallTime,
  };
}

export function parseResponseReceivedEventData(
  payload: TCDPNetworkEvents['Network.responseReceived'],
): Partial<INetworkRequest> {
  const {
    requestId,
    response: {
      mimeType,
    },
  } = payload;

  return {
    requestId,
    mimeType,
  };
}

export function parseDataReceivedEventData(
  payload: TCDPNetworkEvents['Network.dataReceived'],
): Partial<INetworkRequest> {
  const {
    requestId,
    dataLength,
  } = payload;

  return {
    requestId,
    dataLength,
  };
}

export function parseLoadingFinishedEventData(
  payload: TCDPNetworkEvents['Network.loadingFinished'],
): Partial<INetworkRequest> {
  const {
    encodedDataLength,
    requestId,
    timestamp,
  } = payload;

  return {
    requestId,
    encodedDataLength,
    responseFinish: timestamp,
  };
}

/**
 * Convert CDP Network event payload onto summarized INetworkRequest form.
 */
export function parseNetworkEventData(
  event: ICDPNetworkEvent,
): INetworkRequestEvent {
  const { type: eventType, payload } = event;

  let updatedPayload;

  if (isNetworkRequestWillBeSentEvent(event)) {
    updatedPayload = parseRequestWillBeSentEventData(event.payload);
  } else if (isNetworkResponseReceivedEvent(event)) {
    updatedPayload = parseResponseReceivedEventData(event.payload);
  } else if (isNetworkDataReceivedEvent(event)) {
    updatedPayload = parseDataReceivedEventData(event.payload);
  } else if (isNetworkLoadingFinishedEvent(event)) {
    updatedPayload = parseLoadingFinishedEventData(event.payload);
  } else if (isNetworkLoadingFailedEvent(event)) {
    updatedPayload = {
      requestId: payload.requestId,
    };
  } else {
    throw Error(`Unknown event type: ${ eventType }`);
  }

  return {
    type: eventType,
    payload: updatedPayload,
  };
}

/**
 * Patch request info with the translated event data received.
 */
export function reduceNetworkRequestData(
  acc: Partial<INetworkRequest>,
  event: INetworkRequestEvent,
): Partial<INetworkRequest> {
  const {
    type: eventType,
    payload,
  } = event;

  switch (eventType) {
    case 'Network.requestWillBeSent':
      Object.assign(acc, payload);

      break;

    case 'Network.responseReceived':
      acc.mimeType = payload.mimeType;

      break;

    case 'Network.dataReceived':
      acc.dataLength += payload.dataLength;

      break;

    case 'Network.loadingFinished':
      acc.encodedDataLength = payload.encodedDataLength;
      acc.responseFinish = payload.responseFinish;

      break;
  }

  return acc;
}
