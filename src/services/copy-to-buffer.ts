/**
 * Copy text to the user agent buffer/clipboard.
 * Fails on http and when browser window is out of focus.
 */
export function copyTextToBuffer(text: string): Promise<void> {
  try {
    return navigator.clipboard.writeText(text);
  } catch (e) {
    // eslint-disable-next-line no-extra-parens
    return Promise.reject((e as Error).message);
  }
}
