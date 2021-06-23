import { IGlobal } from '../../../e2e-test/e2e.types';
import { PostPreview } from './PostPreview.e2e';

const localGlobal = global as IGlobal & typeof globalThis;

describe('site header', () => {
  beforeEach(async () => {
    await jestPlaywright.resetContext();

    context.setDefaultTimeout(localGlobal.defaultTimeout);

    await page.goto(`${ localGlobal.url }/blog/cars/1`);
  });

  it('random (first) preview has all expected elements', async () => {
    const postPreview = new PostPreview();

    await expect(postPreview.isConnected).resolves.toBe(true);

    await expect(postPreview.getTitleText()).resolves.toEqual(expect.any(String));

    await expect(postPreview.getExcerptText()).resolves.toEqual(expect.any(String));

    await expect(postPreview.getReadMore()).resolves.toBeTruthy();
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
});
