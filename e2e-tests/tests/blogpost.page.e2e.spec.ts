import { test, expect } from '@playwright/test';

import { BlogPost } from '../../src/page-templates/BlogPost/BlogPost.e2e';
import { Head } from '../../src/components/Seo/Seo.e2e';
import { getElementHandleAttributes, skipOnDevBuild } from '../utils';

const postUrl = '/posts/2021/audi-s4-seats-into-gti/';

const fbCardFields = [
  'type',
  'title',
  'description',
  'image',
  'url',
];

const twCardFields = [
  'card',
  'site',
  'creator',
  'title',
  'image',
  'description',
];

const postTags = [
  'Audi',
  'cars',
  'GTI',
  'manual',
  'tuning',
  'VW',
];

async function testBlogPostPage(
  post: BlogPost,
  head: Head,
): Promise<void> {
  await post.isConnected;

  await head.isConnected;

  const postTitle = await post.getTitle();

  await expect(postTitle).toMatchSnapshot();

  const tags = await post.getTags();

  expect(tags).toEqual(expect.arrayContaining(postTags));

  const headers = await post.getHeaders();

  await expect(headers.join()).toMatchSnapshot();

  const text = await post.getBodyAsText();

  await expect(text).toMatchSnapshot();

  const imgTitles = await post.getImageTitles();

  expect(imgTitles.length).toBeGreaterThanOrEqual(22);

  await expect(imgTitles.join()).toMatchSnapshot();

  const pageTitle = await head.getTitle();

  expect(pageTitle).toContain(postTitle);

  const $fbCardMetaTags = await head.getFbCardMetaTags();

  const fbCardFieldsFromDoc = await getElementHandleAttributes($fbCardMetaTags, 'property');

  expect(fbCardFieldsFromDoc).toEqual(
    expect.arrayContaining(fbCardFields.map(prop => `og:${prop}`)),
  );

  const $twCardMetaTags = await head.getTwitterCardMetaTags();

  const twCardFieldsFromDoc = await getElementHandleAttributes($twCardMetaTags, 'name');

  expect(twCardFieldsFromDoc).toEqual(
    expect.arrayContaining(twCardFields.map(prop => `twitter:${prop}`)),
  );

  const $allCardTags = $fbCardMetaTags.concat($twCardMetaTags);

  for (const $tag of $allCardTags) {
    const value = await $tag.getAttribute('content');

    expect(value).not.toBe('');
    expect(value).toBeDefined();
  }

  const canonicalLink = await head.getCanonicalLinkHref();

  expect(canonicalLink.endsWith(postUrl)).toBeTruthy();

  expect(canonicalLink.startsWith('http')).toBeTruthy();
}

test.describe('Post page', () => {
  test('renders the post with JS', async ({ page }) => {
    await page.goto(postUrl);

    const post = new BlogPost({ page });
    const head = new Head({ page });

    await testBlogPostPage(post, head);
  });

  test.describe('no JS rendering', () => {
    test.skip(skipOnDevBuild);

    test('renders the post wo JS', async ({ page }) => {
      const cdpSession = await page.context().newCDPSession(page);

      // turn JS off
      await cdpSession.send(
        'Emulation.setScriptExecutionDisabled',
        { value: true },
      );

      await page.goto(postUrl);

      const post = new BlogPost({ page });
      const head = new Head({ page });

      await testBlogPostPage(post, head);
    });
  });
});
