import { ElementHandle } from 'playwright';

import { IGlobal } from '../../../e2e-test/e2e.types';
import { PostPreview } from './PostPreview.e2e';

const localGlobal = global as IGlobal & typeof globalThis;

const activeTag = 'cars';

describe('site header', () => {
  beforeEach(async () => {
    await jestPlaywright.resetContext();

    context.setDefaultTimeout(localGlobal.defaultTimeout);

    await page.goto(`${ localGlobal.url }/blog/${ activeTag }/1`);
  });

  it('random (first) preview has all expected elements', async () => {
    const postPreview = new PostPreview();

    await expect(postPreview.isConnected).resolves.toBe(true);

    await expect(postPreview.getTitleText()).resolves.toEqual(expect.any(String));

    await expect(postPreview.getExcerptText()).resolves.toEqual(expect.any(String));
  });

  it('post with image is present and has an image', async () => {
    const postPreview = new PostPreview({ withPreview: true });

    await expect(postPreview.isConnected).resolves.toBe(true);

    await expect(postPreview.getImage()).resolves.toBeTruthy();
  });

  // @todo need to handle links open in other tabs
  it.skip('has three areas to click in order to get to the post', async () => {
    const postPreview = new PostPreview({ withPreview: true });

    await expect(postPreview.isConnected).resolves.toBe(true);

    const $title = await postPreview.getTitle();

    $title.click()
      .then();
  });

  // @todo test the whole list of tags - need to know what we are looking for
  it('renders active tag as first', async () => {
    const postPreview = new PostPreview();

    await expect(postPreview.isConnected).resolves.toBe(true);

    const tags = await postPreview.getTags();

    expect(tags.length).toBeGreaterThan(0);

    expect(tags.indexOf(`#${ activeTag }`)).toEqual(0);
  });

  it('renders active tag as text and other tags as links', async () => {
    const postPreview = new PostPreview();

    await expect(postPreview.isConnected).resolves.toBe(true);

    const $tags = await postPreview.getTagElements();

    expect($tags.length).toBeGreaterThan(0);

    const [$activeTag, ...$otherTags] = $tags;

    await expect(PostPreview.isTagLink($activeTag)).resolves.toEqual(false);

    expect($otherTags.length).toBeGreaterThan(0);

    const promises = $otherTags.map(($tag: ElementHandle) => {
      return expect(PostPreview.isTagLink($tag)).resolves.toEqual(true);
    });

    await Promise.all(promises);
  });
});
