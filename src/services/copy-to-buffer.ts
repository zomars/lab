/**
 * Copy text to the user agent buffer/clipboard.
 * Fails on http and when browser window is out of focus.
 * Also fails on mobile Safari and ip address.
 */
export function copyTextToBuffer(text: string): Promise<void> {
  try {
    return navigator.clipboard.writeText(text);
  } catch (e) {
    return Promise.reject((e as Error).message);
  }
}
