import { groupBy, forEach } from 'lodash';
import { CDPSession } from 'playwright';

import { IGlobal } from '../../e2e.types';
import { getResolvablePromise } from '../../utils';

import {
  NetworkRequestsCdpInterceptor,
  INetworkRequestInfo,
  getPerfNavTiming,
  parsePerfTiming,
  getPerfResourceTiming,
  parseResourceTiming,
} from '../../performance-utils';

const localGlobal = global as IGlobal & typeof globalThis;

const { url } = localGlobal;

const fileGroups = {
  html: ['text/html'],
  css: ['text/css'],
  js: ['application/javascript'],
  json: ['application/json'],
  image: ['image/webp', 'image/svg+xml'],
  font: ['font/woff2'],
};

const fileGroupByMimeType = new Map<string, string>();

forEach(fileGroups, (types: string[], group: string) => {
  types.forEach(fileType => fileGroupByMimeType.set(fileType, group));
});

describe('basics', () => {
  let cdpSession: CDPSession;

  beforeAll(() => {
    jest.retryTimes(3);
  });

  beforeEach(async () => {
    await jestPlaywright.resetContext();

    context.setDefaultTimeout(localGlobal.defaultTimeout);

    cdpSession = await page.context().newCDPSession(page);

    // throttle the network down
    await cdpSession.send(
      'Network.emulateNetworkConditions',
      localGlobal.networkThrottleOptions,
    );
  });

  it('loads and renders in a reasonable time', async () => {
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
    const requestsSettledPromise = getResolvablePromise<Map<string, INetworkRequestInfo>>();

    await cdpSession.send('Network.enable');

    const netReqInterceptor = new NetworkRequestsCdpInterceptor(cdpSession);

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

    const encodedSize = loadedFilesList
      .reduce((acc, { encodedDataLength }) => acc + encodedDataLength, 0);

    const encodedSizeKb = Math.ceil(encodedSize / 1000);

    const decodedSize = loadedFilesList
      .reduce((acc, { dataLength }) => acc + dataLength, 0);

    const decodedSizeKb = Math.ceil(decodedSize / 1000);

    const lastLoadedFile = loadedFilesList[loadedFilesList.length - 1];
    const firstLoadedFile = loadedFilesList[0];

    const lastFileLoadedAt =
      (lastLoadedFile.wallTime +
      (lastLoadedFile.responseFinish - lastLoadedFile.requestStart) -
      firstLoadedFile.wallTime) * 1000;

    let testReport =
      `files loaded: ${ loadedFiles.size }\n` +
      `transferred: ${ encodedSizeKb }kB\n` +
      `decoded: ${ decodedSizeKb }kB\n` +
      `last file loaded at: ${ Math.round(lastFileLoadedAt) }ms \n`;

    expect(loadedFiles.size).toBeLessThanOrEqual(25);

    const fileTypes = groupBy(loadedFilesList,
      ({ mimeType }) => fileGroupByMimeType.get(mimeType) || 'other',
    );

    Object.entries(fileTypes)
      .forEach(([mimeType, files]: [string, INetworkRequestInfo[]]) => {
        const encodedSize =
          files.reduce((acc, { encodedDataLength }) => acc + encodedDataLength, 0);

        const decodedSize =
          files.reduce((acc, { dataLength }) => acc + dataLength, 0);

        testReport +=
          `${mimeType}: ${files.length} files [` +
          `${ Math.ceil(encodedSize / 1000)}kB/${ Math.ceil(decodedSize / 1000)}kB]\n`;

        // `- ${files.map(({ url }) => url).join('\n - ')}`,
      });

    console.log(testReport);

    expect(encodedSizeKb).toBeLessThanOrEqual(300);
    expect(decodedSizeKb).toBeLessThanOrEqual(750);
    expect(lastFileLoadedAt).toBeLessThanOrEqual(1000);

    expect(fileTypes.js.length).toBeLessThanOrEqual(10);
    expect(fileTypes.css.length).toBeLessThanOrEqual(3);
    expect(fileTypes.json.length).toBeLessThanOrEqual(5);
    expect(fileTypes.font.length).toBeLessThanOrEqual(3);
  });
});
