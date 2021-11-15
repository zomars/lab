import { CDPSession } from 'playwright';
import { Observable, TeardownLogic } from 'rxjs';
import {
  ECDPNetworkEvents,
  ICDPNetworkEvent,
  TCDPNetworkEvents,
} from '../e2e.types';

type TEventListeners = {
  [T in ECDPNetworkEvents]: (payload: TCDPNetworkEvents[T]) => void;
};

/**
 * Proxy CDP Network events of ECDPNetworkEvents type through observable. Can be infinite.
 */
export function cdpNetworkEvents$(
  session: CDPSession,
): Observable<ICDPNetworkEvent> {
  return new Observable((subscriber): TeardownLogic => {
    const eventListeners: Partial<TEventListeners> = {};

    function closeSession(): void {
      Object.values(ECDPNetworkEvents)
        .forEach((key) => {
          session.off(
            key,
            eventListeners[key],
          );
        });
    }

    function getEventListener<T extends ECDPNetworkEvents>(
      key: T,
    ): (payload: TCDPNetworkEvents[T]) => void {
      const eventListener =
        <I extends ECDPNetworkEvents>(payload: TCDPNetworkEvents[I]): void => {
          subscriber.next({
            type: key,
            payload,
          });
        };

      eventListeners[key] = eventListener;

      return eventListener;
    }

    try {
      Object.values(ECDPNetworkEvents)
        .forEach((key) => {
          session.on(
            key,
            getEventListener<typeof key>(key),
          );
        });

      session.send('Network.enable')
        .catch((e) => {
          throw e;
        });
    } catch (e) {
      subscriber.error(e);

      console.log('error', e);
    }

    return closeSession;
  });
}
