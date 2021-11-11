import { IGlobal } from '../e2e.types';
import { BlogPost } from '../../src/page-templates/BlogPost/BlogPost.e2e';
import { Head } from '../../src/components/Seo/Seo.e2e';
import { getElementHandleAttributes } from '../utils';

const localGlobal = global as IGlobal & typeof globalThis;

const postUrl = `${localGlobal.url}/blog/posts/2021/audi-s4-seats-into-gti/`;

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

  await expect(headers).toMatchSnapshot();

  const text = await post.getBodyAsText();

  await expect(text).toMatchSnapshot();

  const imgTitles = await post.getImageTitles();

  expect(imgTitles.length).toBeGreaterThanOrEqual(22);

  await expect(imgTitles).toMatchSnapshot();

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
}

describe('Blog Post page', () => {
  beforeEach(async () => {
    await jestPlaywright.resetContext();

    context.setDefaultTimeout(localGlobal.defaultTimeout);
  });

  // eslint-disable-next-line jest/expect-expect
  it('renders the post with JS', async () => {
    await page.goto(postUrl);

    const post = new BlogPost();
    const head = new Head();

    await testBlogPostPage(post, head);
  });

  // eslint-disable-next-line jest/expect-expect
  it('renders the post wo JS', async () => {
    const cdpSession = await page.context().newCDPSession(page);

    // turn JS off
    await cdpSession.send(
      'Emulation.setScriptExecutionDisabled',
      { value: true },
    );

    await page.goto(postUrl);

    const post = new BlogPost();
    const head = new Head();

    await testBlogPostPage(post, head);
  });
});
