import { CDPSession } from 'playwright';
import {
  takeWhile,
  groupBy,
  reduce,
  Observable,
  of,
} from 'rxjs';

import {
  map,
  mergeMap,
  timeout,
  catchError,
} from 'rxjs/operators';

import {
  ICDPNetworkEvent,
  IGlobal,
  INetworkRequest,
} from '../../e2e.types';

import { getResolvablePromise } from '../../utils';

import {
  NetworkRequestCDPInterceptor,
  cdpNetworkEvents$,
  getPerfNavTiming,
  printAllRequestsReport,
  parsePerfTiming,
  getPerfResourceTiming,
  parseResourceTiming,
  isTerminationNetworkEvent,
  reduceNetworkRequestData,
  parseNetworkEventData,
  analyzeRequests,
} from '../../performance-utils';

const localGlobal = global as IGlobal & typeof globalThis;

const { url } = localGlobal;

describe('basics', () => {
  let cdpSession: CDPSession;

  beforeAll(() => {
    jest.retryTimes(3);
  });

  beforeEach(async () => {
    await jestPlaywright.resetContext();

    context.setDefaultTimeout(localGlobal.defaultTimeout);

    // type casting due to types mismatch between jest preset and playwright 1.17
    cdpSession = await page.context().newCDPSession(page) as CDPSession;

    await cdpSession.send('Network.enable');

    // throttle the network down
    await cdpSession.send(
      'Network.emulateNetworkConditions',
      localGlobal.networkThrottleOptions,
    );
  });

  afterEach(async () => {
    await cdpSession.detach();
  });

  describe('index page', () => {
    it('loads and renders the page in a reasonable time', async () => {
      await page.goto(url);

      const perfNavTiming = await page.evaluate(getPerfNavTiming);

      const {
        domContentLoaded,
        jsSyncBootstrap,
        loaded,
      } = parsePerfTiming(perfNavTiming);

      console.log(
        ` DOM content loaded: ${Math.round(domContentLoaded)}ms\n`,
        `Loaded: ${Math.round(loaded)}ms\n`,
        `JS bootstrap: ${Math.round(jsSyncBootstrap)}ms\n`,
      );

      expect(domContentLoaded).toBeLessThanOrEqual(500);
      expect(loaded).toBeLessThanOrEqual(1000);
      expect(jsSyncBootstrap).toBeLessThanOrEqual(30);
    });

    it.skip('loads expected number of resources (performance API)', async () => {
      await page.goto(url);

      const perfNavTiming = await page.evaluate(getPerfNavTiming);
      const resourceTiming = await page.evaluate(getPerfResourceTiming);

      const parsedResourceTiming = parseResourceTiming(resourceTiming);

      const {
        decodedBodySize,
        encodedBodySize,
      } = parsePerfTiming(perfNavTiming);

      const requestsNumber = parsedResourceTiming.length + 1;

      expect(requestsNumber).toBeLessThanOrEqual(30);
      expect(requestsNumber).toBeGreaterThanOrEqual(10);

      const encodedTotal = parsedResourceTiming
        .reduce((
          acc: number,
          entry: PerformanceResourceTiming,
        ) => acc + entry.encodedBodySize, encodedBodySize);

      const decodedTotal = parsedResourceTiming
        .reduce((
          acc: number,
          entry: PerformanceResourceTiming,
        ) => acc + entry.decodedBodySize, decodedBodySize);

      const lastResource = parsedResourceTiming[parsedResourceTiming.length - 1];
      const lastResourceLoadedTime = Math.ceil(lastResource.startTime + lastResource.duration);

      console.log(
        ` files loaded: ${requestsNumber}\n`,
        `transferred: ${Math.ceil(encodedTotal/1000)}kB\n`,
        `decoded: ${Math.ceil(decodedTotal/1000)}kB\n`,
        `last resource loaded at: ${lastResourceLoadedTime}ms\n`,
      );
    });

    it('loads expected number of resources', async () => {
      const requestsSettledPromise = getResolvablePromise<Map<string, Partial<INetworkRequest>>>();

      const netReqInterceptor = new NetworkRequestCDPInterceptor(cdpSession);

      let networkRequestsSettledTimeout: number;

      /**
       * Wait for 500ms since the last request being open or(!) fulfilled.
       */
      function restartRequestsSettledTimeout(): void {
        clearTimeout(networkRequestsSettledTimeout);

        // @ts-ignore
        networkRequestsSettledTimeout = setTimeout(() => {
          const { requests } = netReqInterceptor;

          if (!netReqInterceptor.hasOpenConnections && requests.size > 0) {
            netReqInterceptor.stop();
            requestsSettledPromise.resolve(requests);
          } else {
            restartRequestsSettledTimeout();
          }
        }, 499);
      }

      restartRequestsSettledTimeout();

      await page.goto(url);

      const loadedFiles = await requestsSettledPromise;
      const loadedFilesList = Array.from(loadedFiles.values());

      const report = analyzeRequests(loadedFilesList);

      console.log(printAllRequestsReport(report));

      expect(report.totalEncodedSize).toBeLessThanOrEqual(300);
      expect(report.totalDecodedSize).toBeLessThanOrEqual(750);
      expect(report.totalLoadDuration).toBeLessThanOrEqual(1200);

      const { groups: fileGroups } = report;

      expect(fileGroups.js.length).toBeLessThanOrEqual(10);
      expect(fileGroups.css.length).toBeLessThanOrEqual(3);
      expect(fileGroups.json.length).toBeLessThanOrEqual(5);
      expect(fileGroups.font.length).toBeLessThanOrEqual(3);
    });

    it('loads expected number of resources (ob$ervable)', async () => {
      const $observable = cdpNetworkEvents$(cdpSession);

      const requests: Partial<INetworkRequest>[] = [];

      const requestsPromise = $observable
        .pipe(
          timeout({ each: 499 }),
          groupBy(({ payload }: ICDPNetworkEvent) => payload.requestId),
          mergeMap((group$: Observable<ICDPNetworkEvent>) => group$.pipe(
            takeWhile((event: ICDPNetworkEvent): boolean => {
              return !isTerminationNetworkEvent(event);
            }, true),
            map(parseNetworkEventData),
            reduce(reduceNetworkRequestData, {}),
          )),
          catchError(() => of()),
        )
        .forEach((value) => {
          requests.push(value);
        });

      await page.goto(url);

      await requestsPromise;

      const report = analyzeRequests(requests);

      console.log(printAllRequestsReport(report));

      expect(report.totalRequests).toBeLessThanOrEqual(30);
      expect(report.totalEncodedSize).toBeLessThanOrEqual(500);
      expect(report.totalDecodedSize).toBeLessThanOrEqual(1200);
      expect(report.totalLoadDuration).toBeLessThanOrEqual(1300);

      const { groups } = report;

      expect(groups).not.toBeNull();

      expect(groups.js.length).toBeLessThanOrEqual(10);
      expect(groups.css.length).toBeLessThanOrEqual(3);
      expect(groups.json.length).toBeLessThanOrEqual(5);
      expect(groups.font.length).toBeLessThanOrEqual(4);
      expect(groups.image.length).toBeLessThanOrEqual(25);
      expect(groups.other.length).toBeLessThanOrEqual(8);
    });
  });

  describe('post page', () => {
    const url = `${localGlobal.url}/posts/2021/audi-s4-seats-into-gti/`;

    it('loads and renders the page in a reasonable time', async () => {
      await page.goto(url);

      const perfNavTiming = await page.evaluate(getPerfNavTiming);

      const {
        domContentLoaded,
        jsSyncBootstrap,
        loaded,
      } = parsePerfTiming(perfNavTiming);

      console.log(
        ` DOM content loaded: ${Math.round(domContentLoaded)}ms\n`,
        `Loaded: ${Math.round(loaded)}ms\n`,
        `JS bootstrap: ${Math.round(jsSyncBootstrap)}ms\n`,
      );

      expect(domContentLoaded).toBeLessThanOrEqual(500);
      expect(loaded).toBeLessThanOrEqual(1000);
      expect(jsSyncBootstrap).toBeLessThanOrEqual(30);
    });

    it('loads expected number of resources', async () => {
      const requestsSettledPromise =
        getResolvablePromise<Map<string, Partial<INetworkRequest>>>();

      const netReqInterceptor = new NetworkRequestCDPInterceptor(cdpSession);

      let networkRequestsSettledTimeout: number;

      /**
       * Wait for 500ms since the last request being open or(!) fulfilled.
       */
      function restartRequestsSettledTimeout(): void {
        clearTimeout(networkRequestsSettledTimeout);

        // @ts-ignore
        networkRequestsSettledTimeout = setTimeout(() => {
          const { requests } = netReqInterceptor;

          if (!netReqInterceptor.hasOpenConnections && requests.size > 0) {
            netReqInterceptor.stop();
            requestsSettledPromise.resolve(requests);
          } else {
            restartRequestsSettledTimeout();
          }
        }, 499);
      }

      await page.goto(url);

      restartRequestsSettledTimeout();

      const loadedFiles = await requestsSettledPromise;
      const loadedFilesList = Array.from(loadedFiles.values());

      const report = analyzeRequests(loadedFilesList);

      expect(report.totalRequests).toBeLessThanOrEqual(44);

      expect(report.totalEncodedSize).toBeLessThanOrEqual(500);
      expect(report.totalDecodedSize).toBeLessThanOrEqual(1200);
      expect(report.totalLoadDuration).toBeLessThanOrEqual(1300);

      const { groups } = report;

      expect(groups.js.length).toBeLessThanOrEqual(10);
      expect(groups.css.length).toBeLessThanOrEqual(3);
      expect(groups.json.length).toBeLessThanOrEqual(5);
      expect(groups.font.length).toBeLessThanOrEqual(4);
      expect(groups.image.length).toBeLessThanOrEqual(25);
      expect(groups.other.length).toBeLessThanOrEqual(8);
    });
  });
});
