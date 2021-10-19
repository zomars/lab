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
