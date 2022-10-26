export function naturalSort(a = '', b = ''): number {
  return `${a}`.localeCompare(`${b}`, undefined, { numeric: true });
}
