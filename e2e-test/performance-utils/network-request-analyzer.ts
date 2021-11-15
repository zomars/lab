import { forEach, groupBy } from 'lodash';

import {
  INetworkRequest,
  INetworkRequestsReport,
  TMimeTypeFileGroup,
} from '../e2e.types';

import { bytesToRoundKiloBytes } from '../utils';

type TMimeType = Exclude<TMimeTypeFileGroup, 'other' | 'total'>;

const fileGroups: Record<TMimeType, string[]> = {
  html: ['text/html'],
  css: ['text/css'],
  js: ['application/javascript'],
  json: ['application/json'],
  image: ['image/webp', 'image/svg+xml', 'image/jpeg'],
  font: ['font/woff2'],
};

const fileGroupByMimeType = new Map<TMimeType, string>();

forEach(fileGroups, (types, group) => {
  types.forEach(fileType => fileGroupByMimeType.set(fileType as TMimeType, group));
});

/**
 * Compute basic metrics and split requests into groups by mime type.
 */
export function analyzeRequests(
  requests: Partial<INetworkRequest>[],
): INetworkRequestsReport {
  let firstRequestStartTime = +Infinity;
  let lastResponseFinishTime = -Infinity;

  let longestLoadTime = -Infinity;

  let largestDecodedSizeB = -Infinity;
  let largestEncodedSizeB = -Infinity;

  let firstRequest;
  let lastRequest;

  let longestRequest;

  let largestRequestEncoded;
  let largestRequestDecoded;

  let totalEncodedSizeB = 0;
  let totalDecodedSizeB = 0;

  for (const request of requests) {
    const {
      requestStart,
      responseFinish,
      encodedDataLength,
      dataLength,
    } = request;

    // earliest request
    if (requestStart < firstRequestStartTime) {
      firstRequestStartTime = requestStart;
      firstRequest = request;
    }

    if (responseFinish > lastResponseFinishTime) {
      lastResponseFinishTime = responseFinish;
      lastRequest = request;
    }

    // largest request loaded (encoded)
    if (encodedDataLength > largestEncodedSizeB) {
      largestEncodedSizeB = encodedDataLength;
      largestRequestEncoded = request;
    }

    totalEncodedSizeB += encodedDataLength;

    // largest request loaded (decoded)
    if (dataLength > largestDecodedSizeB) {
      largestDecodedSizeB = dataLength;
      largestRequestDecoded = request;
    }

    totalDecodedSizeB += dataLength;

    const loadTime = responseFinish - requestStart;

    // slowest request to load
    if (loadTime > longestLoadTime) {
      longestLoadTime = loadTime;
      longestRequest = request;
    }
  }

  const totalEncodedSize = bytesToRoundKiloBytes(totalEncodedSizeB);
  const totalDecodedSize = bytesToRoundKiloBytes(totalDecodedSizeB);

  const largestRequestEncodedSize = bytesToRoundKiloBytes(largestEncodedSizeB);
  const largestRequestDecodedSize = bytesToRoundKiloBytes(largestDecodedSizeB);

  const totalLoadDuration =
    Math.round((
      lastRequest.wallTime - firstRequest.wallTime +
      (lastRequest.responseFinish - lastRequest.requestStart)
    ) * 1000,
    );

  const groups = groupBy(
    requests,
    ({ mimeType }: { mimeType: TMimeType }) => fileGroupByMimeType.get(mimeType) || 'other',
  );

  return {
    totalRequests: requests.length,
    totalEncodedSize,
    totalDecodedSize,
    totalLoadDuration,
    largestRequestEncoded,
    largestRequestEncodedSize,
    largestRequestDecoded,
    largestRequestDecodedSize,
    longestRequest,
    groups: Object.keys(groups).length > 1 ? groups : null,
  };
}
