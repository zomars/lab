import {
  ElementHandle,
  Page,
  BrowserContext,
} from '@playwright/test';

import { STATE_CHANGE_EVENT } from '../src/constants';
import { IStateChangeEventDetails } from '../src/types/common.types';

interface IResolvablePromise<T, U = unknown> extends Promise<T> {
  resolve: (payload: T) => void;
  reject: (payload: U) => void;
}

/**
 * Return promise which can be resolved and rejected from the "outside".
 */
export function getResolvablePromise<T, U = unknown>(
  callback?: (resolve: (payload: T) => void, reject: (payload: U) => void) => void,
): IResolvablePromise<T, U> {
  let resolve: (payload: T) => void;
  let reject: (payload: U) => void;

  const promise = new Promise(
    (localResolve, localReject) => {
      resolve = localResolve;
      reject = localReject;

      if (callback) {
        callback.call(null, localResolve, localReject);
      }
    }) as IResolvablePromise<T, U>;

  promise.resolve = resolve;
  promise.reject = reject;

  return promise;
}

/**
 * Return list of innerTexts for the list of ElementHandles.
 */
export async function getElementHandleInnerTexts(
  $elements: ElementHandle<HTMLElement>[],
): Promise<string[]> {
  const promises = $elements.map($element => $element.innerText());

  const texts = await Promise.all(promises);

  return texts.map(text => text.trim());
}

/**
 * Return list of attributes for the list of ElementHandles.
 */
export async function getElementHandleAttributes(
  $elements: ElementHandle<HTMLElement>[],
  attribute: string,
): Promise<string[]> {
  const promises = $elements.map($element => $element.getAttribute(attribute));

  const attrValues = await Promise.all(promises);

  return attrValues.map(value => value?.trim());
}

export function bytesToRoundKiloBytes(value: number): number {
  return Math.round(value / 1000);
}

function waitForSpaNavigationPageFunction(STATE_CHANGE_EVENT: string): Promise<string> {
  let resolved = false;

  return new Promise((resolve, reject) => {
    const eventListener = (event: Event): void => {
      if (event instanceof CustomEvent) {
        resolved = true;

        // eslint-disable-next-line no-extra-parens
        resolve((event.detail as IStateChangeEventDetails).location.pathname);
      }
    };

    window.addEventListener(
      STATE_CHANGE_EVENT,
      eventListener,
      { once: true },
    );

    // cleanup in case of timeout or non-event
    setTimeout(() => {
      window.removeEventListener(STATE_CHANGE_EVENT, eventListener);

      if (!resolved) {
        reject(Error('SPA navigation timeout'));
      }
    }, 10000);
  });
}

/**
 * Proper wait for SPA application page change event.
 * Requires matching product code triggering event from router to work.
 */
export function waitForSpaNavigation(page: Page): Promise<string> {
  // can't pass string constant by reference cause function is executed in the browser context
  return page.evaluate(waitForSpaNavigationPageFunction, STATE_CHANGE_EVENT);
}

/**
 * Resolves the promise with Page object of the new page once SPA navigation happened.
 */
export function waitForSpaNavigationInNewTab(context: BrowserContext): Promise<Page> {
  return context.waitForEvent(
    'page',
    page => waitForSpaNavigation(page).then(() => true),
  );
}

export function skipOnDevBuild(): boolean {
  return process.env.NODE_ENV === 'development';
}

export function skipOnNonPublicProduction(): boolean {
  return process.env.NODE_ENV === 'development' || !!process.env.pr_id;
}

export function skipOnPublicProduction(): boolean {
  return !skipOnNonPublicProduction();
}
