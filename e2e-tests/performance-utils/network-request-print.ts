import {
  INetworkRequestsReport,
  TMimeTypeFileGroup,
} from '../e2e.types';
import { analyzeRequests } from './network-request-analyzer';

/**
 * Print basic stats out of the report passed.
 * Doesn't consider nested groups (if any).
 */
export function printRequestGroupReport(
  report: INetworkRequestsReport,
  groupType: TMimeTypeFileGroup,
): string {
  const {
    totalRequests,
    totalEncodedSize,
    totalDecodedSize,
    totalLoadDuration,
  } = report;

  let result = `${ groupType }: ${ totalRequests } files ` +
    `(${ totalEncodedSize }kB/${ totalDecodedSize }kB)`;

  if (groupType === 'total') {
    result += `, done at: ${ totalLoadDuration }ms`;
  }

  return result;
}

/**
 * Print basic stats out of the report passed.
 * Return total data as well as date per group.
 */
export function printAllRequestsReport(
  report: INetworkRequestsReport,
): string {
  const log = [
    `${ printRequestGroupReport(report, 'total') }\n`,
  ];

  const { groups: fileGroups } = report;

  Object.entries(fileGroups)
    .map(([type, files]) => {
      return {
        type,
        groupReport: analyzeRequests(files),
      };
    })
    .sort(({ groupReport: groupReportA }, { groupReport: groupReportB }) => {
      return groupReportB.totalDecodedSize - groupReportA.totalDecodedSize;
    })
    .forEach(({ groupReport, type }) => {
      log.push(
        printRequestGroupReport(groupReport, type as TMimeTypeFileGroup),
      );
    });

  return log.join('\n');
}
