import React, {
  ReactElement,
  useEffect,
} from 'react';
import { WrapPageElementBrowserArgs } from 'gatsby';
import {
  useLocation,
} from '@reach/router';

import { Header } from '../components/Header/Header';
import { STATE_CHANGE_EVENT } from '../constants';

/**
 * Dispatch an event on app state render.
 */
function useLocationChange(): void {
  const location = useLocation();

  useEffect(() => {
    if (window) {
      const event = new CustomEvent(STATE_CHANGE_EVENT);

      // what we actually want is componentDidMount after all the children got rendered
      setTimeout(() => {
        window.dispatchEvent(event);
      }, 0);
    }
  }, [location]);
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
