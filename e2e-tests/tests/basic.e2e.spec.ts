import { test, expect } from '@playwright/test';

import { PostList } from '../../src/page-templates/PostList/PostList.e2e';

import {
  skipOnDevBuild,
  skipOnNonPublicProduction,
  skipOnPublicProduction,
} from '../utils';

test.describe('basics', () => {
  test.beforeEach(({ page }) => {
    return page.goto('/');
  });

  test('has list of posts', async ({ page }) => {
    const techPostsList = new PostList({ page });

    await techPostsList.isConnected;

    const posts = await techPostsList.getAllPosts();

    expect(posts.length).toBeGreaterThanOrEqual(3);

    for (const post of posts) {
      const title = await post.getTitle();
      const excerpt = await post.getExcerptText();

      // lousy tests but don't want to hardcode content here
      // because it would have to be updated with every post
      expect(title).not.toBe('');
      expect(excerpt).not.toBe('');
    }
  });

  test.describe('sitemap and robots.txt', () => {
    test.skip(skipOnDevBuild);

    test('serves robots txt file', async ({ page }) => {
      await page.goto('/robots.txt');

      const sitemapRegexStr = '^Sitemap:.*sitemap-index\\.xml$';

      const sitemapLine = page.locator(`text=/${ sitemapRegexStr }/m`);

      await expect(sitemapLine).not.toBeEmpty();
    });

    test.describe('non-public production env', () => {
      test.skip(skipOnPublicProduction);

      test('robots file disallows indexing', async ({ page }) => {
        await page.goto('/robots.txt');

        const disallowRegexStr = '^Disallow: /$';

        const disallowLine = page.locator(`text=/${ disallowRegexStr }/m`);

        await expect(disallowLine).not.toBeEmpty();

        const allowRegexStr = '^Allow: /$';

        const allowLine = page.locator(`text=/${ allowRegexStr }/m`);

        await expect(allowLine).toHaveCount(0);
      });
    });

    test.describe('public production env', () => {
      test.skip(skipOnNonPublicProduction);

      test('robots file allows indexing', async ({ page }) => {
        await page.goto('/robots.txt');

        const disallowRegexStr = '^Disallow: /$';

        const disallowLine = page.locator(`text=/${ disallowRegexStr }/m`);

        await expect(disallowLine).toHaveCount(0);

        const allowRegexStr = '^Allow: /$';

        const allowLine = page.locator(`text=/${ allowRegexStr }/m`);

        await expect(allowLine).not.toBeEmpty();
      });
    });

    test('serves sitemap-index.xml', async ({ page }) => {
      await page.goto('/sitemap/sitemap-index.xml');

      const sitemaps = await page.$$('loc');

      expect(sitemaps.length).toBeGreaterThanOrEqual(1);

      const firstLocText = await sitemaps[0].textContent();

      expect(firstLocText).toMatch(/\/sitemap-0\.xml/);
    });

    test('serves proper sitemap-0.xml', async ({ page }) => {
      await page.goto('/sitemap/sitemap-0.xml');

      const pages = await page.$$('url');

      expect(pages.length).toBeGreaterThanOrEqual(10);

      for (const page of pages) {
        const locs = await page.$$('loc');
        const lastMods = await page.$$('lastmod');

        expect(locs).toHaveLength(1);
        expect(lastMods.length).toBeLessThanOrEqual(1);

        const url = await locs[0].textContent();

        // all blog posts and post listings should have creation date defined
        // eslint-disable-next-line playwright/no-conditional-in-test
        if (url.indexOf('/posts/') !== -1) {
          expect(lastMods).toHaveLength(1);
        }
      }
    });
  });
});
