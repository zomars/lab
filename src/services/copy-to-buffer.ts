/**
 * Copy text to the user agent buffer/clipboard.
 */
export function copyTextToBuffer(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}
