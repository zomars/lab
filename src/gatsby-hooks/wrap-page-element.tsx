import { useLocation } from '@reach/router';
import { WrapPageElementBrowserArgs } from 'gatsby';
import React, { ReactElement, useEffect } from 'react';

import { Header } from '../components/Header/Header';
import { STATE_CHANGE_EVENT } from '../constants';
import { usePrevious } from '../hooks/usePrevious.hook';
import { EGtmEventTypes, gtmEventEmitter } from '../services/gtm-event-emitter';

/**
 * Dispatch an event on app state render.
 */
function useLocationChange(): void {
  const location = useLocation();
  const previousLocation = usePrevious(location);

  useEffect(() => {
    if (window) {
      const event = new CustomEvent(STATE_CHANGE_EVENT, { detail: { location } });

      // ignore search param updates
      if (location.pathname !== previousLocation?.pathname) {
        gtmEventEmitter(EGtmEventTypes.spa_navigation, {
          prev_spa_location: previousLocation,
        });
      }

      window.dispatchEvent(event);
    }
  }, [
    location,
    previousLocation,
  ]);
}

/**
 * Add header to every page rendered.
 * Provide contexts required.
 */
function WrapPageElement(
  { element, props }: WrapPageElementBrowserArgs,
): ReactElement {
  useLocationChange();

  return (
    <>
      <Header
        { ...props }
      />

      { element }
    </>
  );
}

// to follow Gatsby's API and keep eslint rules regarding hook names happy
export const wrapPageElement = WrapPageElement;
