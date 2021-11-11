import { ElementHandle } from 'playwright';

interface IResolvablePromise<T, U = unknown> extends Promise<T> {
  resolve: (payload: T) => void;
  reject: (payload: U) => void;
}

/**
 * Return promise which can be resolved and rejected from the "outside".
 */
export function getResolvablePromise<T, U = unknown>(
  callback?: (resolve: (payload: T) => void, reject: (payload: U) => void) => void
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
