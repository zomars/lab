/**
 * @fileoverview
 * Utilities to work with parsing and constructing URLs.
 */

/**
 * Return URL by tag and page index.
 */
export function getPostListUrlByTag(tag: string, page?: number): string {
  const prefix = `/blog/${tag}`;

  // there is no "zero" page anyway
  if (page) {
    return `${prefix}/${page}`;
  }

  return prefix;
}
