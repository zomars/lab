import { PostList } from '../../src/page-templates/PostList/PostList.e2e';
import { IGlobal } from '../e2e.types';

const localGlobal = global as IGlobal & typeof globalThis;

describe('basics', () => {
  beforeEach(async () => {
    await jestPlaywright.resetContext();

    context.setDefaultTimeout(localGlobal.defaultTimeout);

    await page.goto(localGlobal.url);
  });

  it('has list of posts', async () => {
    const techPostsList = new PostList();

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

  it('serves robots txt file', async () => {
    if (localGlobal.nodeEnv === 'development') {
      return;
    }

    await page.goto(`${localGlobal.url}/robots.txt`);

    const contentRegexStr = '^Sitemap:.*sitemap-index\\.xml$';

    const element = await page.$(`text=/${contentRegexStr}/m`);

    expect(element).not.toBeNull();
  });

  it('serves sitemap-index.xml', async () => {
    if (localGlobal.nodeEnv === 'development') {
      return;
    }

    await page.goto(`${localGlobal.url}/sitemap/sitemap-index.xml`);

    const sitemaps = await page.$$('loc');

    expect(sitemaps.length).toBeGreaterThanOrEqual(1);

    const firstLocText = await sitemaps[0].textContent();

    expect(firstLocText).toMatch(/\/sitemap-0\.xml/);
  });

  it('serves proper sitemap-0.xml', async () => {
    if (localGlobal.nodeEnv === 'development') {
      return;
    }

    await page.goto(`${localGlobal.url}/sitemap/sitemap-0.xml`);

    const pages = await page.$$('url');

    expect(pages.length).toBeGreaterThanOrEqual(10);

    for (const page of pages) {
      const locs = await page.$$('loc');
      const lastMods = await page.$$('lastmod');

      expect(locs).toHaveLength(1);
      expect(lastMods.length).toBeLessThanOrEqual(1);

      const url = await locs[0].textContent();

      // all blog posts and post listings should have creation date defined
      if (url.indexOf('/posts/') !== -1) {
        // eslint-disable-next-line jest/no-conditional-expect
        expect(lastMods).toHaveLength(1);
      }
    }
  });
});
