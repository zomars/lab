type TResourceTiming = Pick<PerformanceNavigationTiming,
'transferSize' | 'encodedBodySize' | 'decodedBodySize'>;

export interface IPerfNavTiming extends TResourceTiming {
  jsSyncBootstrap: number,
  domContentLoaded: number,
  loaded: number,
}

/**
 * Return last navigation timing info.
 */
export function getPerfNavTiming(): Promise<PerformanceNavigationTiming> {
  let promiseResolve: (entry: PerformanceNavigationTiming) => void;

  const promise = new Promise((resolve: (entry: PerformanceNavigationTiming) => void) => {
    promiseResolve = resolve;
  });

  const observer = new PerformanceObserver((entries) => {
    const entriesList = entries.getEntries() as PerformanceNavigationTiming[];
    const [firstEntry] = entriesList;

    promiseResolve(firstEntry.toJSON());
  });

  observer.observe({
    type: 'navigation',
    buffered: true,
  });

  setTimeout(() => observer.disconnect());

  return promise;
}

/**
 * Analyze navigation data to produce metrics we care about.
 */
export function parsePerfTiming(entry: PerformanceNavigationTiming): IPerfNavTiming {
  const {
    decodedBodySize,
    domComplete,
    domContentLoadedEventEnd,
    domContentLoadedEventStart,
    encodedBodySize,
    loadEventEnd,
    loadEventStart,
    responseEnd,
    transferSize,
  } = entry;

  const domContentLoaded = Math.round(domContentLoadedEventStart - responseEnd);

  const loaded = Math.round(domComplete - responseEnd);

  const jsSyncBootstrap = Math.round(
    domContentLoadedEventEnd - domContentLoadedEventStart + loadEventEnd - loadEventStart,
  );

  return {
    decodedBodySize,
    domContentLoaded,
    encodedBodySize,
    jsSyncBootstrap,
    loaded,
    transferSize,
  };
}

/**
 * Return all loaded files till there is a gap of 500ms between API calls being initiated(!).
 * Once gap is met resolve the promise with the list of files.
 */
export function getPerfResourceTiming(): Promise<PerformanceResourceTiming[]> {
  let promiseResolve: (json: PerformanceNavigationTiming[]) => void;
  let timeoutId: number;
  let resolved = false;

  const resources: PerformanceResourceTiming[] = [];

  /**
   * Resolve the promise returned and deregister the observer.
   */
  function resolve(): void {
    resolved = true;

    promiseResolve(
      resources.map(resource => resource.toJSON())
    );

    observer.disconnect();
  }

  /**
   * Prolong execution while we are getting at least one new resource every second.
   */
  function restartTimeout(): void {
    clearTimeout(timeoutId);

    // this will be executed in the browser context, not node context
    timeoutId = setTimeout(resolve, 500) as unknown as number;
  }

  const promise = new Promise((resolve: (json: PerformanceNavigationTiming[]) => void) => {
    promiseResolve = resolve;
  });

  const observer = new PerformanceObserver((entries) => {
    const entriesList = entries.getEntries() as PerformanceNavigationTiming[];

    resources.push(...entriesList);

    // to avoid race condition for the event waiting right after(during) resolution
    if (!resolved) {
      restartTimeout();
    }
  });

  observer.observe({
    type: 'resource',
    buffered: true,
  });

  restartTimeout();

  return promise;
}

/**
 * Sort network request by startTime.
 */
export function parseResourceTiming(
  entries: PerformanceResourceTiming[],
): PerformanceResourceTiming[] {
  return entries.sort(
    (a, b) => a.startTime - b.startTime,
  );
}
